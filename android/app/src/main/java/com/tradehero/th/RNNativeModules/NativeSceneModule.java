package com.tradehero.th.RNNativeModules;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tradehero.th.MainActivity;
import com.tradehero.th.NativeViewActivity;
import com.tradehero.th.StockEditFragment;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class NativeSceneModule extends ReactContextBaseJavaModule {

    private static final String NAME = "NativeScene";

    public NativeSceneModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void launchNativeScene(String sceneName) {
        Activity currentActivity = getCurrentActivity();

        Intent intent = new Intent();
        intent.setClassName(currentActivity, NativeViewActivity.class.getName());
        intent.putExtra(NativeViewActivity.START_FRAGMENT_NAME, MainActivity.class.getPackage().getName() + "." + sceneName);
        currentActivity.startActivity(intent);
    }
}
