package com.tongdao.sdk.imagetools.ui;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.tongdao.sdk.imagetools.ui.TdDiskLruCache.Snapshot;

import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory.Options;
import android.support.v4.util.LruCache;
import android.util.Log;

public class TdImageCache {
    // Default memory cache size
    private static final int DEFAULT_MEM_CACHE_SIZE = 1024 * 1024 * 1; // 5MB
    // Default disk cache size
    private static final int DEFAULT_DISK_CACHE_SIZE = 1024 * 1024 * 10; // 10MB
    private static final int DISK_CACHE_INDEX = 0;
    // Compression settings when writing images to disk cache
    private static final CompressFormat DEFAULT_COMPRESS_FORMAT = CompressFormat.JPEG;
    // Constants to easily toggle various caches
    private static final boolean DEFAULT_MEM_CACHE_ENABLED = true;
    private static final boolean DEFAULT_DISK_CACHE_ENABLED = true;
    private static final boolean DEFAULT_CLEAR_DISK_CACHE_ON_START = false;
    private static final boolean DEFAULT_INIT_DISK_CACHE_ON_CREATE = false;
    private TdDiskLruCache mDiskLruCache;
    private LruCache<String, Bitmap> mMemoryCache;
    private ImageCacheParams imageCacheParams;
    private Object mDiskCacheLock = new Object();
    private boolean mDiskCacheStarting = true;

    public TdImageCache(ImageCacheParams imageCacheParams) {
        init(imageCacheParams);
    }

    /**
     * This method only used for add bitmap to specify disk lru cache at one time, after finish, it will closed
     *
     * @param context
     * @param data
     * @param uniqueName
     * @param bitmap
     */
    public static void addBitmapToSpecifyDiskLruCache(Context context, String data, String uniqueName, Bitmap bitmap) {
        ImageCacheParams imageCacheParams = new ImageCacheParams(context, uniqueName);
        imageCacheParams.initDiskCacheOnCreate = true;
        TdImageCache imageCache = new TdImageCache(imageCacheParams);
        imageCache.addBitmapToDiskCache(Source.SELF, data, null, bitmap);
        imageCache.flush();
        imageCache.close();
    }

    public static Bitmap getBitmapFromSpecifyDiskLruCache(Context context, String data, String uniqueName) {
        return getBitmapFromSpecifyDiskLruCache(context, data, uniqueName, 1, 0);
    }

    public static Bitmap getBitmapFromSpecifyDiskLruCache(Context context, String data, String uniqueName, int sampleSize, int cornerRadius) {
        ImageCacheParams imageCacheParams = new ImageCacheParams(context, uniqueName);
        imageCacheParams.initDiskCacheOnCreate = true;
        TdImageCache imageCache = new TdImageCache(imageCacheParams);
        Bitmap bm = imageCache.getBitmapFromDiskCache(data, true, sampleSize);
        imageCache.close();
        return bm;
    }

    private void init(ImageCacheParams imageCacheParams) {
        this.imageCacheParams = imageCacheParams;
        // Set up memory cache
        if (imageCacheParams.memoryCacheEnabled) {
            mMemoryCache = new LruCache<String, Bitmap>(imageCacheParams.memCacheSize) {
                /**
                 * Measure item size in bytes rather than units which is more practical
                 * for a bitmap cache
                 */
                @Override
                protected int sizeOf(String key, Bitmap bitmap) {
                    return TdUtils.getBitmapSize(bitmap);
                }
            };
        }

        // By default the disk cache is not initialized here as it should be initialized
        // on a separate thread due to disk access.
        if (imageCacheParams.initDiskCacheOnCreate) {
            // Set up disk cache
            initDiskCache();
        }
    }

    /**
     * Initializes the disk cache.  Note that this includes disk access so this should not be
     * executed on the main/UI thread. By default an ImageCache does not initialize the disk
     * cache when it is created, instead you should call initDiskCache() to initialize it on a
     * background thread.
     */
    public void initDiskCache() {
        // Set up disk cache
        synchronized (mDiskCacheLock) {
            if (mDiskLruCache == null || mDiskLruCache.isClosed()) {
                File diskCacheDir = imageCacheParams.diskCacheDir;
                if (imageCacheParams.diskCacheEnabled && diskCacheDir != null) {
                    if (!diskCacheDir.exists()) {
                        diskCacheDir.mkdirs();
                    }
                    if (TdUtils.getUsableSpace(diskCacheDir) > imageCacheParams.diskCacheSize) {
                        try {
                            mDiskLruCache = TdDiskLruCache.open(diskCacheDir, 1, 1, imageCacheParams.diskCacheSize);
                        } catch (IOException e) {
                            imageCacheParams.diskCacheDir = null;
                            Log.e("initDiskCache", "IOException");
                        }
                    }
                }
            }
            mDiskCacheStarting = false;
            mDiskCacheLock.notifyAll();
        }
    }

    public Bitmap getBitmapFromMemory(String data) {
        return mMemoryCache != null ? mMemoryCache.get(data) : null;
    }

    public Bitmap getBitmapFromDiskCache(String data) {
        return getBitmapFromDiskCache(data, true, 1);
    }

    /**
     * load bitmap from disk and add it to memory bitmap cache
     *
     * @param data
     * @param inSampleSize means if you want to scale or not
     * @param effect       for bitmap effect, 0 for nothing, 1 for blur etc.
     * @return bitmap loaded from disk
     */
    public Bitmap getBitmapFromDiskCache(String data, boolean enableMemoryCache, int inSampleSize) {
        Bitmap bm = null;
        synchronized (mDiskCacheLock) {
            while (mDiskCacheStarting) {
                try {
                    mDiskCacheLock.wait();
                } catch (InterruptedException e) {
                }
            }

            if (mDiskLruCache != null) {
                InputStream inputStream = null;
                try {
                    Snapshot snapshot = mDiskLruCache.get(TdUtils.hashKeyForDisk(data));
                    if (snapshot != null) {
                        inputStream = snapshot.getInputStream(DISK_CACHE_INDEX);
                        if (inputStream != null) {
                            Options options = new Options();
                            options.inSampleSize = inSampleSize;
                            bm = BitmapFactory.decodeStream(inputStream, null, options);
                        }
                    }
                } catch (OutOfMemoryError e) {
                    Log.e("ImageCache", "OutOfMemoryError");
                } catch (IOException e) {
                    Log.e("ImageCache", "IOException");
                } finally {
                    if (inputStream != null) {
                        try {
                            inputStream.close();
                            inputStream = null;
                        } catch (IOException e) {
                            inputStream = null;
                        }
                    }
                }
            }

            if (bm != null && enableMemoryCache) {
                addBitmapToMemoryCache(data, bm);
            }
        }
        return bm;
    }

    public void addBitmapToMemoryCache(String data, Bitmap bm) {
        if (data != null && bm != null) {
            if (mMemoryCache != null && mMemoryCache.get(data) == null) {
                mMemoryCache.put(data, bm);
            }
        }
    }

    /**
     * Clears both the memory and disk cache associated with this ImageCache object. Note that
     * this includes disk access so this should not be executed on the main/UI thread.
     */
    public void clearCache() {
        if (mMemoryCache != null) {
            mMemoryCache.evictAll();
        }

        synchronized (mDiskCacheLock) {
            mDiskCacheStarting = true;
            if (mDiskLruCache != null && !mDiskLruCache.isClosed()) {
                try {
                    mDiskLruCache.delete();
                } catch (IOException e) {
                    Log.e("clearCache", "IOException");
                }
                mDiskLruCache = null;
                initDiskCache();
            }
        }
    }

    /**
     * Flushes the disk cache associated with this ImageCache object. Note that this includes
     * disk access so this should not be executed on the main/UI thread.
     */
    public void flush() {
        synchronized (mDiskCacheLock) {
            if (mDiskLruCache != null) {
                try {
                    mDiskLruCache.flush();
                } catch (IOException e) {
                    Log.e("ImageCache flush", "IOException");
                }
            }
        }
    }

    /**
     * Closes the disk cache associated with this ImageCache object. Note that this includes
     * disk access so this should not be executed on the main/UI thread.
     */
    public void close() {
        synchronized (mDiskCacheLock) {
            if (mDiskLruCache != null) {
                try {
                    if (!mDiskLruCache.isClosed()) {
                        mDiskLruCache.close();
                        mDiskLruCache = null;
                    }
                } catch (IOException e) {
                    Log.e("cache close", "IOException");
                }
            }
        }
    }

    /**
     * A holder class that contains cache parameters.
     */
    public static class ImageCacheParams {
        public int memCacheSize = DEFAULT_MEM_CACHE_SIZE;
        public int diskCacheSize = DEFAULT_DISK_CACHE_SIZE;
        public File diskCacheDir;
        public boolean memoryCacheEnabled = DEFAULT_MEM_CACHE_ENABLED;
        public boolean diskCacheEnabled = DEFAULT_DISK_CACHE_ENABLED;
        public boolean clearDiskCacheOnStart = DEFAULT_CLEAR_DISK_CACHE_ON_START;
        public boolean initDiskCacheOnCreate = DEFAULT_INIT_DISK_CACHE_ON_CREATE;

        public ImageCacheParams(Context context, String uniqueName) {
            diskCacheDir = TdUtils.getDiskCacheDir(context, uniqueName);
        }

        public ImageCacheParams(File diskCacheDir) {
            this.diskCacheDir = diskCacheDir;
        }

        /**
         * Sets the memory cache size based on a percentage of the device memory class.
         * Eg. setting percent to 0.2 would set the memory cache to one fifth of the device memory
         * class. Throws {@link IllegalArgumentException} if percent is < 0.05 or > .8.
         * <p/>
         * This value should be chosen carefully based on a number of factors
         * Refer to the corresponding Android Training class for more discussion:
         * http://developer.android.com/training/displaying-bitmaps/
         *
         * @param context Context to use to fetch memory class
         * @param percent Percent of memory class to use to size memory cache
         */
        public void setMemCacheSizePercent(Context context, float percent) {
            if (percent < 0.05f || percent > 0.8f) {
                throw new IllegalArgumentException("setMemCacheSizePercent - percent must be "
                        + "between 0.05 and 0.8 (inclusive)");
            }
            memCacheSize = Math.round(percent * getMemoryClass(context) * 1024 * 1024);
        }

        private static int getMemoryClass(Context context) {
            return ((ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE)).getMemoryClass();
        }
    }

    /**
     * Source will tell the function where can get the bitmap from
     * NETWORK means need download bitmap form the link data
     * FILE means need copy file from the string data, here need to get mediaId and use mediaId to get file from app cache folder
     * SELF means @param bitmap is used for save
     */
    public static enum Source {
        NETWORK, FILE, SELF
    }

    ;

    public void addBitmapToDiskCache(Source source, String data, String filePath, Bitmap bitmap) {
        if (data == null) {
            return;
        }
        synchronized (mDiskCacheLock) {
            // Add to disk cache
            if (mDiskLruCache != null) {
                final String key = TdUtils.hashKeyForDisk(data);
                OutputStream out = null;
                try {
                    TdDiskLruCache.Snapshot snapshot = mDiskLruCache.get(key);
                    if (snapshot == null) {
                        final TdDiskLruCache.Editor editor = mDiskLruCache.edit(key);
                        if (editor != null) {
                            out = editor.newOutputStream(DISK_CACHE_INDEX);
                            boolean editSuccess = false;
                            switch (source) {
                                case NETWORK:
                                    editSuccess = TdUtils.downloadUrlToStream(data, out);
                                    break;
                                case FILE:
                                    editSuccess = TdUtils.copyFileToStream(filePath, out);
                                    break;
                                default:
                                    editSuccess = bitmap != null ? bitmap.compress(DEFAULT_COMPRESS_FORMAT, 100, out) : false;
                                    break;
                            }
                            if (editSuccess) {
                                editor.commit();
                            } else {
                                editor.abort();
                            }
                        }
                    } else {
                        snapshot.getInputStream(DISK_CACHE_INDEX).close();
                    }
                } catch (final IOException e) {
                    Log.e("addBitmapToCache", "IOException");
                } catch (Exception e) {
                    Log.e("addBitmapToCache", "Exception");
                } finally {
                    try {
                        if (out != null) {
                            out.close();
                            out = null;
                        }
                    } catch (IOException e) {
                        out = null;
                    }
                }
            }
        }
    }
}
