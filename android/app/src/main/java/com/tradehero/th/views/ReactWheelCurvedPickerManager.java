package com.tradehero.th.views;

import android.graphics.Color;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.List;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactWheelCurvedPickerManager extends SimpleViewManager<ReactWheelCurvedPicker> {

    private static final String REACT_CLASS = "WheelCurvedPicker";

    private static final int DEFAULT_TEXT_SIZE = 25 * 2;
    private static final int DEFAULT_ITEM_SPACE = 14 * 2;

    @Override
    protected ReactWheelCurvedPicker createViewInstance(ThemedReactContext reactContext) {
        ReactWheelCurvedPicker picker = new ReactWheelCurvedPicker(reactContext);
        picker.setTextColor(Color.LTGRAY);
        picker.setCurrentTextColor(Color.WHITE);
        picker.setTextSize(DEFAULT_TEXT_SIZE);
        picker.setItemSpace(DEFAULT_ITEM_SPACE);

        return picker;
    }

    @ReactProp(name="data")
    public void setData(ReactWheelCurvedPicker picker, ReadableArray items) {
        if (picker != null) {
            ArrayList<String> data = new ArrayList<>();
            for (int i = 0; i < items.size(); i ++) {
                ReadableMap itemMap = items.getMap(i);
                data.add(itemMap.getString("label"));
            }
            picker.setData(data);
        }
    }

    @ReactProp(name="currentTextColor", customType = "Color")
    public void setCurrentTextColor(ReactWheelCurvedPicker picker, Integer color) {
        if (picker != null) {
            picker.setCurrentTextColor(color);
        }
    }

    @ReactProp(name="otherTextColor", customType = "Color")
    public void setOtherTextColor(ReactWheelCurvedPicker picker, Integer color) {
        if (picker != null) {
            picker.setTextColor(color);
        }
    }

    @ReactProp(name="textSize")
    public void setTextSize(ReactWheelCurvedPicker picker, int size) {
        if (picker != null) {
            picker.setTextSize(size * 2);
        }
    }

    @ReactProp(name="itemSpace")
    public void setItemSpace(ReactWheelCurvedPicker picker, int space) {
        if (picker != null) {
            picker.setItemSpace(space * 2);
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }
}
