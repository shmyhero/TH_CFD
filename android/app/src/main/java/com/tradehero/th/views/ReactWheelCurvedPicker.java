package com.tradehero.th.views;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;

import com.aigestudio.wheelpicker.view.WheelCurvedPicker;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactWheelCurvedPicker extends WheelCurvedPicker {

    public ReactWheelCurvedPicker(Context context) {
        super(context);
    }

    public ReactWheelCurvedPicker(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void drawItems(Canvas canvas) {
        super.drawItems(canvas);

        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        canvas.drawLine(rectCurItem.left, rectCurItem.top, rectCurItem.right, rectCurItem.top, paint);
        canvas.drawLine(rectCurItem.left, rectCurItem.bottom, rectCurItem.right, rectCurItem.bottom, paint);
    }
}
