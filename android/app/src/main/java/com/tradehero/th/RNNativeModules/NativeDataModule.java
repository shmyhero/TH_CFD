package com.tradehero.th.RNNativeModules;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.tradehero.th.module.LogicData;


/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class NativeDataModule extends ReactContextBaseJavaModule {

    private static final String NAME = "NativeData";

    public NativeDataModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void passDataToNative(String dataName, String data) {
        LogicData.getInstance().setData(dataName, data);
    }

    public static void passDataToRN(ReactContext context, String dataName, String data) {
        WritableArray args = Arguments.createArray();
        args.pushString(dataName);
        args.pushString(data);

        context.getJSModule(RCTNativeAppEventEmitter.class).
                emit("nativeSendDataToRN", args);
    }
}
