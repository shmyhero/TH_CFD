package com.tradehero.th.views;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.SystemClock;
import android.util.AttributeSet;

import com.aigestudio.wheelpicker.core.AbstractWheelPicker;
import com.aigestudio.wheelpicker.view.WheelCurvedPicker;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.List;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactWheelCurvedPicker extends WheelCurvedPicker implements AbstractWheelPicker.OnWheelChangeListener {

    private final EventDispatcher mEventDispatcher;
    private List<Integer> mValueData;

    public ReactWheelCurvedPicker(ReactContext reactContext) {
        super(reactContext);
        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        setOnWheelChangeListener(this);
    }

    @Override
    protected void drawItems(Canvas canvas) {
        super.drawItems(canvas);

        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        canvas.drawLine(rectCurItem.left, rectCurItem.top, rectCurItem.right, rectCurItem.top, paint);
        canvas.drawLine(rectCurItem.left, rectCurItem.bottom, rectCurItem.right, rectCurItem.bottom, paint);
    }

    public void setValueData(List<Integer> data) {
        mValueData = data;
    }

    public void onWheelScrolling(float deltaX, float deltaY) {

    }

    public void onWheelSelected(int index, String data) {
        if (mValueData != null && index < mValueData.size()) {
            mEventDispatcher.dispatchEvent(
                    new ItemSelectedEvent(getId(), SystemClock.uptimeMillis(), mValueData.get(index)));
        }
    }

    public void onWheelScrollStateChanged(int state) {

    }
}

class ItemSelectedEvent extends Event<ItemSelectedEvent> {

    public static final String EVENT_NAME = "wheelCurvedPickerPageSelected";

    private final int mValue;

    protected ItemSelectedEvent(int viewTag, long timestampMs,  int value) {
        super(viewTag, timestampMs);
        mValue = value;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("data", mValue);
        return eventData;
    }
}
