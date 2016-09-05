package com.tradehero.cfd;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

/**
 * Created by Rambo on 16/9/5.
 */
public class CFDApplication extends Application implements Application.ActivityLifecycleCallbacks {

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
