package com.tradehero.th.RNNativeModules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tradehero.th.module.LogicData;

import org.json.JSONArray;
import org.json.JSONException;

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
        try {
            JSONArray jsonArray = new JSONArray(data);
            LogicData.getInstance().setData(dataName, jsonArray);
        } catch (JSONException e) {

        }
    }


}
