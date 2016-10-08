package com.tongdao.sdk.imagetools.ui;

import android.content.Context;
import android.net.ConnectivityManager;

public class TdUrlReachableTool {
    public static boolean isHasNetwork(Context context) {
        ConnectivityManager conManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (conManager != null && conManager.getActiveNetworkInfo() != null) {
            return conManager.getActiveNetworkInfo().isAvailable();
        } else {
            return false;
        }
    }
}
