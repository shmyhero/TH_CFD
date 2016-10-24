package com.tradehero.cfd.views;

import android.content.Context;
import android.os.SystemClock;
import android.view.LayoutInflater;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.tradehero.cfd.R;

import java.util.Map;

/**
 * Created by windy on 16/8/30.
 */
public class ReactStockEditFragmentNativeManager extends ViewGroupManager<ReactStockEditFragmentNative> {

    public static final String REACT_CLASS = "StockEditFragment";
    public static Context staticContext;
    private EventDispatcher mEventDispatcher;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ReactStockEditFragmentNative createViewInstance(ThemedReactContext reactContext) {
        staticContext = reactContext;
//        final ReactStockEditFragmentNative rootView = (ReactStockEditFragmentNative) LayoutInflater.from(reactContext).inflate(R.layout.stock_edit_native, null);
        ReactStockEditFragmentNative rootView = new ReactStockEditFragmentNative(reactContext);
        rootView.initView();

        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        rootView.setEventDispatcher(mEventDispatcher);

        return rootView;
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
//        return MapBuilder.of(
//                ReactStockEditFragmentNative.NativeRefreshEvent.EVENT_NAME, MapBuilder.of("registrationName", "onNativeRefresh")
//        );
        return createExportedCustomDirectEventTypeConstants();
    }

    public static Map createExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder().
                put(ReactStockEditFragmentNative.NativeRefreshEvent.EVENT_NAME, MapBuilder.of("registrationName", "onNativeRefresh")).
                put(ReactStockEditFragmentNative.TapAlertEvent.EVENT_NAME, MapBuilder.of("registrationName", "onTapAlertButton")).build();
    }


    @ReactProp(name = "isActual")
    public void setIsAcutal(ReactStockEditFragmentNative reactStockEditFragmentNative, boolean isLogin){
        if (reactStockEditFragmentNative != null) {
            reactStockEditFragmentNative.setIsActual(isLogin);
        }
    }

    @ReactProp(name = "isLogin")
    public void setIsLogin(ReactStockEditFragmentNative reactStockEditFragmentNative, boolean isLogin) {
        if (reactStockEditFragmentNative != null) {
            reactStockEditFragmentNative.setIsLogin(isLogin);
        }
    }


    @ReactProp(name = "alertData")
    public void alertData(ReactStockEditFragmentNative reactStockEditFragmentNative, String alertData) {
        if (reactStockEditFragmentNative != null) {
            reactStockEditFragmentNative.setAlertData(alertData);
        }
    }
}
