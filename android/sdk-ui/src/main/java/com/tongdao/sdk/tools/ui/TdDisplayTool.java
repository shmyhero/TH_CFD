package com.tongdao.sdk.tools.ui;

import android.content.Context;

import com.tongdao.sdk.imagetools.ui.TdDisplayUtil;

public class TdDisplayTool {
    private static final int MIN_WIDTH = 1024;
    private static final int TEN_DP = 10;

    public static int[] configDisplay(Context appContext, boolean isPortrait, int phoneW, int phoneH) {
        int tempPhoneW = phoneW;
        if (!isPortrait) {
            tempPhoneW = phoneH;
        }

        int display_out_w = 0;
        int display_in_w = 0;
        if (tempPhoneW <= MIN_WIDTH) {
            display_out_w = tempPhoneW - TdDisplayUtil.getRawPixel(appContext, TEN_DP);
            display_in_w = tempPhoneW - TdDisplayUtil.getRawPixel(appContext, TEN_DP * 3);
        } else if (tempPhoneW > 1024 && tempPhoneW <= 1200) {
            display_out_w = 904;
            display_in_w = 840;
        } else if (tempPhoneW > 1200 && tempPhoneW <= 1536) {
            display_out_w = 964;
            display_in_w = 900;
        } else if (tempPhoneW > 1536) {
            display_out_w = 1184;
            display_in_w = 1120;
        }

        int closeWH = 0;

        if (tempPhoneW < 320) {
            closeWH = 24;
        } else if (tempPhoneW >= 320 && tempPhoneW < 480) {
            closeWH = 32;
        } else if (tempPhoneW >= 480 && tempPhoneW < 720) {
            closeWH = 48;
        } else if (tempPhoneW >= 720) {
            closeWH = 64;
        }

        return new int[]{display_out_w, display_in_w, closeWH};
    }

    public static int[] configDisplayForFullScreen(Context appContext, int containerW, int containerH, boolean isPortrait) {
        int tempPhoneW = 0;
        int display_out_w = 0;
        int display_out_h = 0;

        if (containerW >= containerH) {
            //横屏
            double tempWidth = containerH / 10.0 * 16.0;
            if (tempWidth > containerW) {
                tempPhoneW = containerW;
            } else {
                tempPhoneW = (int) tempWidth;
            }
        } else {
            //竖屏
            double tempHeight = containerW / 10.0 * 16.0;
            if (tempHeight > containerH) {
                tempPhoneW = (int) (containerH / 16.0 * 10.0);
            } else {
                tempPhoneW = (int) tempHeight;
            }
        }

        int closeWH = 0;

        if (tempPhoneW < 320) {
            closeWH = 24;
        } else if (tempPhoneW >= 320 && tempPhoneW < 480) {
            closeWH = 32;
        } else if (tempPhoneW >= 480 && tempPhoneW < 720) {
            closeWH = 48;
        } else if (tempPhoneW >= 720) {
            closeWH = 64;
        }

        display_out_w = tempPhoneW;

        int data = getOutH(isPortrait, display_out_w);
        display_out_h = data;
        return new int[]{display_out_w, display_out_h, closeWH};
    }


    private static int getOutH(boolean isPortrait, int display_out_w) {
        int display_out_h = 0;
        //竖屏
        if (isPortrait) {
            display_out_h = (int) ((display_out_w / 10.0) * 16.0);
        } else {
            //横屏
            display_out_h = (int) ((display_out_w / 16.0) * 10.0);
        }

        return display_out_h;
    }
}
