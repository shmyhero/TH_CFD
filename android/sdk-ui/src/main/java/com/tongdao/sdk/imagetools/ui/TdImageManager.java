package com.tongdao.sdk.imagetools.ui;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.TransitionDrawable;
import android.os.AsyncTask;
import android.view.View;
import android.widget.ImageView;

import com.tongdao.sdk.imagetools.ui.TdImageCache.ImageCacheParams;
import com.tongdao.sdk.imagetools.ui.TdImageCache.Source;
import com.tongdao.sdk.ui.R;

public class TdImageManager {

    public static final int DEFAULT_IMAGE_WORK_TASK_COUNT = 30;
    public static final float DEFAULT_IMAGE_MEMORY_CACHE_SIZE = 0.25f;
    private Context mContext;
    private Bitmap mLoadingBitmap;
    private TdImageCache imageCache;
    public boolean mExitTasksEarly;
    private boolean mFadeInBitmap = true;
    private int FADE_IN_TIME = 300;
    private boolean needClose = false;

    public interface ImageLoadListener {
        void onLoadComplete();

        void onCancelled();
    }

    public TdImageManager(Context context, String uniqueName) {
        mContext = context;
        ImageCacheParams imageCacheParams = new ImageCacheParams(context,
                uniqueName);
        imageCacheParams.setMemCacheSizePercent(context,
                DEFAULT_IMAGE_MEMORY_CACHE_SIZE); // Set memory cache to 25%
        imageCache = new TdImageCache(imageCacheParams);
        new CacheAsyncTask().execute(MESSAGE_INIT_DISK_CACHE);
    }

    public TdImageManager(Context context, String uniqueName, boolean needClose) {
        mContext = context;
        this.needClose = needClose;
        ImageCacheParams imageCacheParams = new ImageCacheParams(context,
                uniqueName);
        imageCacheParams.setMemCacheSizePercent(context,
                DEFAULT_IMAGE_MEMORY_CACHE_SIZE); // Set memory cache to 25%
        imageCache = new TdImageCache(imageCacheParams);
        new CacheAsyncTask().execute(MESSAGE_INIT_DISK_CACHE);
    }

    public TdImageManager(Context context) {
        mContext = context;
    }

    public void setImageCache(TdImageCache imageCache) {
        this.imageCache = imageCache;
    }

    public TdImageManager(Context context, ImageCacheParams imageCacheParams) {
        mContext = context;
        imageCache = new TdImageCache(imageCacheParams);
    }

    private static final int MESSAGE_CLEAR = 0;
    public static final int MESSAGE_INIT_DISK_CACHE = 1;
    private static final int MESSAGE_FLUSH = 2;
    private static final int MESSAGE_CLOSE = 3;

    public class CacheAsyncTask extends AsyncTask<Object, Void, Void> {

        @Override
        protected Void doInBackground(Object... params) {
            switch ((Integer) params[0]) {
                case MESSAGE_CLEAR:
                    clearCacheInternal();
                    break;
                case MESSAGE_INIT_DISK_CACHE:
                    initDiskCacheInternal();
                    break;
                case MESSAGE_FLUSH:
                    flushCacheInternal();
                    break;
                case MESSAGE_CLOSE:
                    closeCacheInternal();
                    break;
            }
            return null;
        }
    }

    protected void initDiskCacheInternal() {
        if (imageCache != null) {
            imageCache.initDiskCache();
        }
    }

    protected void clearCacheInternal() {
        if (imageCache != null) {
            imageCache.clearCache();
        }
    }

    protected void flushCacheInternal() {
        if (imageCache != null) {
            imageCache.flush();
        }
    }

    protected void closeCacheInternal() {
        if (imageCache != null) {
            imageCache.close();
            mExitTasksEarly = true;
            imageCache = null;
        }
    }

    public void clearCache() {
        new CacheAsyncTask().execute(MESSAGE_CLEAR);
    }

    public void flushCache() {
        new CacheAsyncTask().execute(MESSAGE_FLUSH);
    }

    public void closeCache() {
        new CacheAsyncTask().execute(MESSAGE_CLOSE);
    }

    /*
     * load image bitmap form disklrucache
     */
    public Bitmap loadImage(String data) {
        if (data == null) {
            return null;
        }

        Bitmap bm = null;
        if (imageCache != null) {
            bm = imageCache.getBitmapFromMemory(data);
            if (bm == null) {
                bm = imageCache.getBitmapFromDiskCache(data);
                if (bm == null) {
                    if (TdUrlReachableTool.isHasNetwork(mContext)
                            && imageCache != null) {
                        imageCache.addBitmapToDiskCache(Source.NETWORK, data,
                                null, null);
                        if (imageCache != null) {
                            bm = imageCache.getBitmapFromDiskCache(data);
                        }
                    }
                }
            }
        }

        if (needClose) {
            closeCache();
        }
        return bm;
    }

    /*
     * load image form memory if enableMemoryCache is true
     */
    public void loadImage(Object data, ImageView imageView,
                          boolean enableMemoryCache) {
        loadImage(data, imageView, enableMemoryCache, 1, null, null);
    }

    public void loadImage(Object data, ImageView imageView) {
        loadImage(data, imageView, true, 1, null, null);
    }

    public void loadImage(Object data, ImageView imageView, View progressView) {
        loadImage(data, imageView, true, 1, null, progressView);
    }

    public void loadImage(Object data, ImageView imageView,
                          boolean enableMemoryCache, int inSampleSize, Bitmap loadingBitmap,
                          View progressView) {
        loadImage(data, imageView, enableMemoryCache, inSampleSize,
                loadingBitmap,
                progressView, null);
    }

    @SuppressLint("NewApi")
    public void loadImage(Object data, ImageView imageView,
                          boolean enableMemoryCache, int inSampleSize, Bitmap loadingBitmap,
                          View progressView, ImageLoadListener callback) {
        if (data == null || imageView == null) {
            return;
        }

        Bitmap bm = null;
        if (enableMemoryCache && imageCache != null) {
            bm = imageCache.getBitmapFromMemory(String.valueOf(data));
        }
        if (bm != null && !bm.isRecycled()) {
            imageView.setImageBitmap(bm);
            imageView.setTag(R.id.tag_image_is_loaded, true);

            if (callback != null) {
                callback.onLoadComplete();
            }
        } else if (cancelPotentialWork(data, imageView)) {
            ImageWorkerTask imageWorkerTask = new ImageWorkerTask(imageView,
                    data, enableMemoryCache, inSampleSize, progressView, callback);
            imageView.setImageDrawable(new AsyncDrawable(mContext
                    .getResources(), loadingBitmap != null ? loadingBitmap
                    : mLoadingBitmap, imageWorkerTask));
            if (CONCURRENT_IMAGEWORKERTASK_COUNT > 0) {
                synchronized (concurrentImageWorkerTaskLock) {
                    CONCURRENT_IMAGEWORKERTASK_COUNT--;
                }
                imageWorkerTask.execute();
            } else {
                asyncTasksPool.add(imageWorkerTask);
            }
        }
    }

    public void addBitmapToDiskCache(String data, Bitmap bitmap) {
        if (data != null && bitmap != null && imageCache != null) {
            imageCache.addBitmapToDiskCache(Source.SELF, data, null, bitmap);
        }
    }

    public void addFileToDiskCache(String data, String filePath) {
        if (data != null && filePath != null && imageCache != null) {
            imageCache.addBitmapToDiskCache(Source.FILE, data, filePath, null);
        }
    }

    /**
     * Returns true if the current work has been canceled or if there was no
     * work in progress on this image view. Returns false if the work in
     * progress deals with the same data. The work is not stopped in that case.
     */
    public static boolean cancelPotentialWork(Object data, ImageView imageView) {
        final ImageWorkerTask bitmapWorkerTask = getBitmapWorkerTask(imageView);

        if (bitmapWorkerTask != null) {
            final Object bitmapData = bitmapWorkerTask.data;
            if (bitmapData == null || !bitmapData.toString().equals(data)) {
                bitmapWorkerTask.cancel(true);
            } else {
                // The same work is already in progress.
                return false;
            }
        }
        return true;
    }

    /**
     * @return Retrieve the currently active work task (if any) associated with
     * this imageView. null if there is no such task.
     */
    private static ImageWorkerTask getBitmapWorkerTask(ImageView imageView) {
        if (imageView != null) {
            final Drawable drawable = imageView.getDrawable();
            if (drawable instanceof AsyncDrawable) {
                final AsyncDrawable asyncDrawable = (AsyncDrawable) drawable;
                return asyncDrawable.getBitmapWorkerTask();
            }
        }
        return null;
    }

    /**
     * Called when the processing is complete and the final bitmap should be set
     * on the ImageView.
     */
    @SuppressWarnings("deprecation")
    private void setImageBitmap(ImageView imageView, Bitmap bitmap) {
        if (bitmap != null) {
            if (mFadeInBitmap) {
                // Transition drawable with a transparent drwabale and the final
                // bitmap
                TransitionDrawable td = new TransitionDrawable(
                        new Drawable[]{
                                new ColorDrawable(android.R.color.transparent),
                                new BitmapDrawable(mContext.getResources(), bitmap)});
                if (mLoadingBitmap != null) {
                    // Set background to loading bitmap
                    imageView.setBackgroundDrawable(new BitmapDrawable(mContext
                            .getResources(), mLoadingBitmap));
                }
                imageView.setImageDrawable(td);
                td.startTransition(FADE_IN_TIME);
            } else {

                imageView.setImageBitmap(bitmap);
            }
        }

        imageView.setTag(R.id.tag_image_is_loaded, true);
    }

    /**
     * A custom Drawable that will be attached to the imageView while the work
     * is in progress. Contains a reference to the actual worker task, so that
     * it can be stopped if a new binding is required, and makes sure that only
     * the last started worker process can bind its result, independently of the
     * finish order.
     */
    private static class AsyncDrawable extends BitmapDrawable {
        private final WeakReference<ImageWorkerTask> bitmapWorkerTaskReference;

        public AsyncDrawable(Resources res, Bitmap bitmap,
                             ImageWorkerTask bitmapWorkerTask) {
            super(res, bitmap);
            bitmapWorkerTaskReference = new WeakReference<ImageWorkerTask>(
                    bitmapWorkerTask);
        }

        public ImageWorkerTask getBitmapWorkerTask() {
            return bitmapWorkerTaskReference.get();
        }
    }

    /**
     * IMPORTANT limitation for concurrent image worker task execution,
     * otherwise will throw RejectedexecutionException
     */
    private int CONCURRENT_IMAGEWORKERTASK_COUNT = DEFAULT_IMAGE_WORK_TASK_COUNT;
    private Object concurrentImageWorkerTaskLock = new Object();
    private List<ImageWorkerTask> asyncTasksPool = Collections
            .synchronizedList(new ArrayList<TdImageManager.ImageWorkerTask>());

    public class ImageWorkerTask extends AsyncTask<Void, Void, Bitmap> {
        private String data;
        private final WeakReference<ImageView> imageViewReference;
        private WeakReference<View> progressViewReference;
        private int quality = 1;
        private boolean enableMemoryCache;
        private ImageLoadListener callback;

        public ImageWorkerTask(ImageView imageView, Object data,
                               boolean enableMemoryCache, int quality, View progressView,
                               ImageLoadListener imageLoadListener) {
            this.data = String.valueOf(data);
            this.quality = quality;
            this.enableMemoryCache = enableMemoryCache;
            imageViewReference = new WeakReference<ImageView>(imageView);
            if (progressView != null) {
                progressViewReference = new WeakReference<View>(progressView);
            }
            this.callback = imageLoadListener;
        }

        @Override
        protected void onPreExecute() {
            final View progressView = getAttachedProgressView();
            if (progressView != null) {
                progressView.setVisibility(View.VISIBLE);
            }
        }

        @Override
        protected Bitmap doInBackground(Void... params) {
            if (imageCache == null) {
                return null;
            }

            Bitmap bm = null;
            if (!isCancelled() && getAttachedImageView() != null
                    && !mExitTasksEarly && imageCache != null) {
                bm = imageCache.getBitmapFromDiskCache(data, enableMemoryCache,
                        quality);
            }

            if (bm == null && !isCancelled() && getAttachedImageView() != null
                    && !mExitTasksEarly) {

                if (TdUrlReachableTool.isHasNetwork(mContext)
                        && imageCache != null) {
                    imageCache.addBitmapToDiskCache(Source.NETWORK, data, null,
                            null);
                    if (imageCache != null) {
                        bm = imageCache.getBitmapFromDiskCache(data,
                                enableMemoryCache, quality);
                    }
                }
            } else {
                //Log.e("ImageManager","ImageWorkerTask-[found in disk or memory]");
            }

            return bm;
        }

        /**
         * Once the image is processed, associates it to the imageView
         */
        @Override
        protected void onPostExecute(Bitmap bitmap) {
            handleTaskFinish();
            if (isCancelled() || mExitTasksEarly) {
                bitmap = null;
                return;
            }

            final ImageView imageView = getAttachedImageView();
            if (imageView != null) {
                setImageBitmap(imageView, bitmap);
            }

            final View progressView = getAttachedProgressView();
            if (progressView != null) {
                progressView.setVisibility(View.GONE);
            }

            if (needClose) {
                closeCache();
            }

            if (callback != null) {
                callback.onLoadComplete();
            }
        }

        @Override
        protected void onCancelled() {
            handleTaskFinish();
            if (callback != null) {
                callback.onCancelled();
            }
        }

        private void handleTaskFinish() {
            synchronized (concurrentImageWorkerTaskLock) {
                CONCURRENT_IMAGEWORKERTASK_COUNT++;
                if (CONCURRENT_IMAGEWORKERTASK_COUNT > DEFAULT_IMAGE_WORK_TASK_COUNT) {
                    CONCURRENT_IMAGEWORKERTASK_COUNT = DEFAULT_IMAGE_WORK_TASK_COUNT;
                }
            }

            if (CONCURRENT_IMAGEWORKERTASK_COUNT > 0
                    && asyncTasksPool.size() > 0) {
                ImageWorkerTask task = asyncTasksPool.remove(0);
                while (task.getStatus() != Status.PENDING
                        && asyncTasksPool.size() > 0) {
                    task = asyncTasksPool.remove(0);
                }
                if (task.getStatus() == Status.PENDING) {
                    synchronized (concurrentImageWorkerTaskLock) {
                        CONCURRENT_IMAGEWORKERTASK_COUNT--;
                    }
                    task.execute();
                }
            }

        }

        /**
         * Returns the ImageView associated with this task as long as the
         * ImageView's task still points to this task as well. Returns null
         * otherwise.
         */
        private ImageView getAttachedImageView() {
            final ImageView imageView = imageViewReference.get();
            final ImageWorkerTask bitmapWorkerTask = getBitmapWorkerTask(imageView);

            if (this == bitmapWorkerTask) {
                return imageView;
            }
            return null;
        }

        private View getAttachedProgressView() {
            return progressViewReference != null ? progressViewReference.get() : null;
        }
    }

    public void setLoadingImage(int loadingImage) {
        this.mLoadingBitmap = BitmapFactory.decodeResource(mContext.getResources(), loadingImage);
    }

    public void setExitTasksEarly(boolean exitTasksEarly) {
        this.mExitTasksEarly = exitTasksEarly;
    }

}
