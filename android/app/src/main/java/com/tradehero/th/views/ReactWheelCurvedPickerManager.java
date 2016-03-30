package com.tradehero.th.views;

import android.graphics.Color;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;
import java.util.List;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactWheelCurvedPickerManager extends SimpleViewManager<ReactWheelCurvedPicker> {

    private static final String REACT_CLASS = "WheelCurvedPicker";

    @Override
    protected ReactWheelCurvedPicker createViewInstance(ThemedReactContext reactContext) {
        ReactWheelCurvedPicker picker = new ReactWheelCurvedPicker(reactContext);
        picker.setTextColor(Color.LTGRAY);
        picker.setCurrentTextColor(Color.WHITE);
        picker.setTextSize(50);
        picker.setItemSpace(20);

        List<String> data = new ArrayList<>();
        data.add("100");
        data.add("200");
        data.add("300");
        picker.setData(data);
        return picker;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }
}
