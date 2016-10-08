package com.tongdao.sdk.imagetools.ui;


import android.content.Context;
import android.graphics.drawable.Drawable;

public class TdDisplayUtil {

    public static int getRawPixel(Context ctx, float dp) {
        return (int) (ctx.getResources().getDisplayMetrics().density * dp + 0.5f); // +0.5f is used that the result is always at least 1px and not 0px
    }

    public static int getDIP(Context ctx, float px) {
        return (int) (px / ctx.getResources().getDisplayMetrics().density + 0.5f); // +0.5f is used that the result is always at least 1dp and not 0dp
    }

    public static int getRawFontPixel(Context ctx, float sp) {
        return (int) (ctx.getResources().getDisplayMetrics().scaledDensity * sp + 0.5f); // +0.5f is used that the result is always at least 1px and not 0px
    }

    public static int getSP(Context ctx, float px) {
        return (int) (px / ctx.getResources().getDisplayMetrics().scaledDensity + 0.5f); // +0.5f is used that the result is always at least 1dp and not 0dp
    }

    public static int getScreenWidth(Context appContext) {
        return appContext.getResources().getDisplayMetrics().widthPixels;
    }

    public static int getScreenHeight(Context appContext) {
        return appContext.getResources().getDisplayMetrics().heightPixels;
    }

    public static Drawable getAppIcon(Context appContext) {
        return appContext.getApplicationInfo().loadIcon(appContext.getPackageManager());
    }
}
