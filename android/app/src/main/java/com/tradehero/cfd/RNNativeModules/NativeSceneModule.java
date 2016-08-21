package com.tradehero.cfd.RNNativeModules;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.meiqia.meiqiasdk.activity.MQMessageFormActivity;
import com.meiqia.meiqiasdk.util.MQIntentBuilder;
import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.NativeViewActivity;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class NativeSceneModule extends ReactContextBaseJavaModule {

    private static final String NAME = "NativeScene";
    private static final String ACT_MEIQIA = "MeiQia";

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
        if (ACT_MEIQIA.equals(sceneName)) {
            startMeiQia(currentActivity);
            return;
        } else {
            Intent intent = new Intent();
            intent.setClassName(currentActivity, NativeViewActivity.class.getName());
            intent.putExtra(NativeViewActivity.START_FRAGMENT_NAME, MainActivity.class.getPackage().getName() + "." + sceneName);
            currentActivity.startActivity(intent);
        }
    }

    public void startMeiQia(Context context) {
        //对话模式
        Intent intent = new MQIntentBuilder(context).build();
        context.startActivity(intent);


        //留言模式
//        context.startActivity(new Intent(context, MQMessageFormActivity.class));
    }
}
