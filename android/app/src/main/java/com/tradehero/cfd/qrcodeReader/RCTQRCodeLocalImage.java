package com.tradehero.cfd.qrcodeReader;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;

import java.io.File;
import java.io.IOException;
import java.util.EnumSet;
import java.util.Hashtable;
import java.util.List;


public class RCTQRCodeLocalImage extends ReactContextBaseJavaModule {
    public RCTQRCodeLocalImage(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RCTQRCodeLocalImage";
    }

    @ReactMethod
    public void decode(String path, Callback callback) {
        Hashtable<DecodeHintType, Object> hints = new Hashtable<DecodeHintType, Object>();
        hints.put(DecodeHintType.CHARACTER_SET, "utf-8"); // 设置二维码内容的编码
//      hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);

        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true; // 先获取原大小
        Bitmap scanBitmap = BitmapFactory.decodeFile(path, options);

        int sampleSize = (int) (options.outHeight / (float) 200);

        if (sampleSize <= 0)
            sampleSize = 1;
        options.inSampleSize = sampleSize;
        options.inJustDecodeBounds = false; // 获取新的大小

        scanBitmap = BitmapFactory.decodeFile(path, options);
        int[] intArray = new int[scanBitmap.getWidth()*scanBitmap.getHeight()];
        scanBitmap.getPixels(intArray, 0, scanBitmap.getWidth(), 0, 0, scanBitmap.getWidth(), scanBitmap.getHeight());

        RGBLuminanceSource source = new RGBLuminanceSource(scanBitmap.getWidth(), scanBitmap.getHeight(), intArray);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        QRCodeReader reader = new QRCodeReader();
        try {
            Result result = reader.decode(bitmap, hints);
            if (result == null) {
                callback.invoke("image format error");
            } else {
                callback.invoke(null, result.toString());
            }

        } catch (Exception e) {
            Log.e("QRCode error", "error", e);
            callback.invoke("decode error");
        }
    }
}
