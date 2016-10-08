/*
 * Copyright (C) 2012 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tongdao.sdk.imagetools.ui;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.util.Log;

import com.tongdao.sdk.tools.TongDaoApiTool.TdSSLTrustManager;

import javax.net.ssl.HttpsURLConnection;


public class TdUtils {

    public static final String THUMBS_CACHE_DIR = "thumbs";
    public static final String IMAGES_CACHE_DIR = "images";
    public static final String HTTP_CACHE_DIR = "http";

    /**
     * Download a bitmap from a URL and write the content to an output stream.
     *
     * @param urlString The URL to fetch
     * @return true if successful, false otherwise
     */
    public static boolean downloadUrlToStream(String urlString,
                                              OutputStream outputStream) {
        disableConnectionReuseIfNecessary();
        HttpsURLConnection urlConnection = null;
        BufferedOutputStream out = null;
        BufferedInputStream in = null;
        try {
            URL url = new URL(urlString);
            urlConnection = (HttpsURLConnection) url.openConnection();
            TdSSLTrustManager.addSSLManagerForConnection(urlConnection);
            in = new BufferedInputStream(urlConnection.getInputStream());
            out = new BufferedOutputStream(outputStream);
            int b;
            while ((b = in.read()) != -1) {
                out.write(b);
            }
            return true;
        } catch (IOException e) {
            Log.e("IOException", "Error in downloadBitmap");
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
                urlConnection = null;
            }
            try {
                if (out != null) {
                    out.close();
                    out = null;
                }
                if (in != null) {
                    in.close();
                    in = null;
                }
            } catch (final IOException e) {
                out = null;
                in = null;
            }
        }
        return false;
    }

    /**
     * copy a file from a path and write the content to an output stream.
     *
     * @return true if successful, false otherwise
     */
    public static boolean copyFileToStream(String pathString,
                                           OutputStream outputStream) {
        if (pathString == null) {
            return false;
        }
        BufferedOutputStream out = null;
        BufferedInputStream in = null;

        try {
            File file = new File(pathString);
            if (!file.exists()) {
                return false;
            }
            in = new BufferedInputStream(new FileInputStream(file));
            out = new BufferedOutputStream(outputStream);

            int b;
            while ((b = in.read()) != -1) {
                out.write(b);
            }

            return true;
        } catch (IOException e) {
            Log.e("IOException", "Error in copyFileToStream");
        } finally {
            try {
                if (out != null) {
                    out.close();
                    out = null;
                }
                if (in != null) {
                    in.close();
                    in = null;
                }
            } catch (final IOException e) {
                out = null;
                in = null;
            }
        }
        return false;
    }

    public static void addFileToDiskCache(Context context, String dataLink,
                                          TdImageManager imageManager, int widthPixels, int heightPixels) {
        String filePath = context.getFilesDir() + File.separator
                + dataLink.substring(dataLink.lastIndexOf("/") + 1);
        File file = new File(filePath);
        if (file.exists()) {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            Bitmap bitmap = null;
            bitmap = BitmapFactory.decodeFile(filePath, options);
            int be1 = Math.round(options.outHeight / (float) heightPixels);
            int be2 = Math.round(options.outWidth / (float) widthPixels);
            int be;

            if (be1 >= 1 && be2 >= 1) {
                if (be1 >= be2) {
                    be = be1;
                } else {
                    be = be2;
                }
            } else if (be1 >= 1 && be2 < 1) {
                be = be1;
            } else if (be1 < 1 && be2 >= 1) {
                be = be2;
            } else {
                be = 1;
            }

            options.inSampleSize = be;
            options.inJustDecodeBounds = false;
            try {
                bitmap = BitmapFactory.decodeFile(filePath, options);
                imageManager.addBitmapToDiskCache(dataLink, bitmap);
                // add thumbs to disk lru cache
                // ImageCache.addBitmapToSpecifyDiskLruCache(context, dataLink,
                // THUMBS_CACHE_DIR, bitmap);
                TdImageCache.addBitmapToSpecifyDiskLruCache(context, dataLink,
                        HTTP_CACHE_DIR, bitmap);
                bitmap.recycle();
            } catch (OutOfMemoryError error) {
                Log.e("OutOfMemoryError", "OutOfMemoryError");
            }

            file.delete();
        }
    }

    /**
     * Workaround for bug pre-Froyo, see here for more info:
     * http://android-developers.blogspot.com/2011/09/androids-http-clients.html
     */
    public static void disableConnectionReuseIfNecessary() {
        // HTTP connection reuse which was buggy pre-froyo
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.FROYO) {
            System.setProperty("http.keepAlive", "false");
        }
    }

    /**
     * Get a usable cache directory (external if available, internal otherwise).
     *
     * @param context    The context to use
     * @param uniqueName A unique directory name to append to the cache dir
     * @return The cache dir
     */
    public static File getDiskCacheDir(Context context, String uniqueName) {
        return new File(getDiskCacheDirPath(context, uniqueName));
    }

    public static String getDiskCacheDirPath(Context context, String uniqueName) {
        // maybe later will use external
        return context.getCacheDir().getPath() + File.separator + uniqueName;
    }

    /**
     * A hashing method that changes a string (like a URL) into a hash suitable
     * for using as a disk filename.
     */
    static MessageDigest mDigest;

    public static String hashKeyForDisk(String key) {
        String cacheKey;
        try {
            if (mDigest == null) {
                mDigest = MessageDigest.getInstance("MD5");
            }
            mDigest.update(key.getBytes());
            cacheKey = bytesToHexString(mDigest.digest());
        } catch (NoSuchAlgorithmException e) {
            cacheKey = String.valueOf(key.hashCode());
        }
        return cacheKey;
    }

    private static String bytesToHexString(byte[] bytes) {
        // http://stackoverflow.com/questions/332079
        StringBuilder sb = new StringBuilder();
        int length = bytes.length;
        for (int i = 0; i < length; i++) {
            String hex = Integer.toHexString(0xFF & bytes[i]);
            if (hex.length() == 1) {
                sb.append('0');
            }
            sb.append(hex);
        }
        return sb.toString();
    }

    /**
     * Get the size in bytes of a bitmap.
     *
     * @param bitmap
     * @return size in bytes
     */
    @TargetApi(12)
    public static int getBitmapSize(Bitmap bitmap) {
        if (hasHoneycombMR1()) {
            return bitmap.getByteCount();
        }
        // Pre HC-MR1
        return bitmap.getRowBytes() * bitmap.getHeight();
    }

    /**
     * Check if external storage is built-in or removable.
     *
     * @return True if external storage is removable (like an SD card), false
     * otherwise.
     */
    @TargetApi(9)
    public static boolean isExternalStorageRemovable() {
        if (hasGingerbread()) {
            return Environment.isExternalStorageRemovable();
        }
        return true;
    }

    /**
     * Get the external app cache directory.
     *
     * @param context The context to use
     * @return The external cache dir
     */
    @TargetApi(8)
    public static String getExternalCacheDir(Context context) {
        if (hasFroyo()) {
            final File file = context.getExternalCacheDir();
            if (file != null) {
                return file.getAbsolutePath();
            }
        }

        final String cacheDir = "/Android/data/" + context.getPackageName()
                + "/cache";
        // Before Froyo we need to construct the external cache dir ourselves
        return Environment.getExternalStorageDirectory().getPath() + cacheDir;
    }

    /**
     * Check how much usable space is available at a given path.
     *
     * @param path The path to check
     * @return The space available in bytes
     */
    @SuppressWarnings("deprecation")
    @TargetApi(9)
    public static long getUsableSpace(File path) {
        if (hasGingerbread()) {
            return path.getUsableSpace();
        }
        final StatFs stats = new StatFs(path.getPath());
        return (long) stats.getBlockSize() * (long) stats.getAvailableBlocks();
    }

    public static boolean hasFroyo() {
        // Can use static final constants like FROYO, declared in later versions
        // of the OS since they are inlined at compile time. This is guaranteed
        // behavior.
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.FROYO;
    }

    public static boolean hasGingerbread() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD;
    }

    public static boolean hasHoneycomb() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB;
    }

    public static boolean hasHoneycombMR1() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR1;
    }

    public static boolean hasJellyBean() {
        return Build.VERSION.SDK_INT >= 14;
        // return Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN;
    }

//	private static byte[] getBitmapBytes(Bitmap bitmap) throws IOException {
//	        Bitmap localBitmap = Bitmap.createBitmap(80, 80, Bitmap.Config.RGB_565);
//	        Canvas localCanvas = new Canvas(localBitmap);
//	        int i;
//	        int j;
//	        if (bitmap.getHeight() > bitmap.getWidth()) {
//	            i = bitmap.getWidth();
//	            j = bitmap.getWidth();
//	        } else {
//	            i = bitmap.getHeight();
//	            j = bitmap.getHeight();
//	        }
//	            localCanvas.drawARGB(255, 255, 255, 255);
//	            localCanvas.drawBitmap(bitmap, new Rect(0, 0, i, j), new Rect(0, 0,80, 80), null);
//	            bitmap.recycle();
//	            ByteArrayOutputStream localByteArrayOutputStream = new ByteArrayOutputStream();
//	            localBitmap.compress(Bitmap.CompressFormat.JPEG, 100,localByteArrayOutputStream);
//	            localBitmap.recycle();
//	            byte[] arrayOfByte = localByteArrayOutputStream.toByteArray();
//	            localByteArrayOutputStream.close();
//                return arrayOfByte;
//	    }

}
