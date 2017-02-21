package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.RectF;

import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.renderer.XAxisRenderer;
import com.github.mikephil.charting.utils.Transformer;
import com.github.mikephil.charting.utils.ViewPortHandler;

/**
 * Created by Neko on 2017/2/20.
 */

public class ReactXAxisRenderer extends XAxisRenderer {
    protected Paint mBackgroundPaint;
    public ReactXAxisRenderer(ViewPortHandler viewPortHandler, XAxis xAxis, Transformer trans) {
        super(viewPortHandler, xAxis, trans);
    }

    public void setBackgroundColor(int color){
        mBackgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBackgroundPaint.setColor(color);
        mBackgroundPaint.setStyle(Paint.Style.FILL);
    }

    @Override
    public void renderLimitLines(Canvas c) {
        if (mXAxis.getPosition() == XAxis.XAxisPosition.TOP) {
            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
            new_Background.top = 0;
            new_Background.bottom = mViewPortHandler.getContentRect().top - 1;
            c.drawRect(new_Background, mBackgroundPaint);
        }else {
            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
            new_Background.top = mViewPortHandler.getContentRect().bottom + 1;
            new_Background.bottom = c.getHeight();
            c.drawRect(new_Background, mBackgroundPaint);
        }
        super.renderLimitLines(c);
    }

    @Override
    public void renderAxisLabels(Canvas c) {
        if (!mXAxis.isEnabled() || !mXAxis.isDrawLabelsEnabled())
            return;

//        if (mXAxis.getPosition() == XAxis.XAxisPosition.TOP) {
//            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
//            new_Background.top = 0;
//            new_Background.bottom = mViewPortHandler.getContentRect().top;
//            c.drawRect(new_Background, mBackgroundPaint);
//        }else {
//            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
//            new_Background.top = mViewPortHandler.getContentRect().bottom;
//            new_Background.bottom = c.getHeight();
//            c.drawRect(new_Background, mBackgroundPaint);
//        }

        super.renderAxisLabels(c);
    }
//
//    @Override
//    protected void drawLabels(Canvas c, float pos, PointF anchor) {
//
//
//        super.drawLabels(c, pos, anchor);
//    }
}
