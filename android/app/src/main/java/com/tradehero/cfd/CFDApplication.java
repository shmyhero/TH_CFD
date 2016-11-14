package com.tradehero.cfd;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;

import javax.annotation.Nullable;

/**
 * Created by Neko on 16/9/5.
 */
public class CFDApplication extends Application implements Application.ActivityLifecycleCallbacks, ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected String getJSMainModuleName() {
            return "index.android";
        }

        @Nullable
        @Override
        protected String getBundleAssetName() {
            return "index.android.bundle";
        }

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return RNManager.getRNPackages();
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    Boolean isAppFront = false;
    int currentFrontActivitiesCount = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(this);
    }

    public Boolean IsAppFront(){
        return isAppFront;
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

    }

    @Override
    public void onActivityStarted(Activity activity) {
        currentFrontActivitiesCount++;
        if(!isAppFront){
            isAppFront = true;
        }
    }

    @Override
    public void onActivityResumed(Activity activity) {

    }

    @Override
    public void onActivityPaused(Activity activity) {

    }

    @Override
    public void onActivityStopped(Activity activity) {
        currentFrontActivitiesCount--;
        if(currentFrontActivitiesCount == 0 && isAppFront){
            isAppFront = false;
        }
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onActivityDestroyed(Activity activity) {

    }
}
