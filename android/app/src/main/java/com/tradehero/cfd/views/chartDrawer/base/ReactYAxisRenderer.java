package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;

import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.renderer.YAxisRenderer;
import com.github.mikephil.charting.utils.Transformer;
import com.github.mikephil.charting.utils.Utils;
import com.github.mikephil.charting.utils.ViewPortHandler;

/**
 * Created by Neko on 2017/2/20.
 */

public class ReactYAxisRenderer extends YAxisRenderer {

    protected Paint mBackgroundPaint;
    public ReactYAxisRenderer(ViewPortHandler viewPortHandler, YAxis yAxis, Transformer trans) {
        super(viewPortHandler, yAxis, trans);
    }

    public void setBackgroundColor(int color){
        mBackgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBackgroundPaint.setColor(color);
        mBackgroundPaint.setStyle(Paint.Style.FILL);
    }

    @Override
    public void renderAxisLabels(Canvas c) {

        if(mYAxis.getAxisDependency() == YAxis.AxisDependency.LEFT){
            if(mViewPortHandler.getContentRect().left != 0) {
                RectF new_Background = new RectF(mViewPortHandler.getContentRect());
                new_Background.right = mViewPortHandler.getContentRect().left - Utils.convertDpToPixel(1); //+ Utils.convertDpToPixel(1); //border
                new_Background.left = 0;
                new_Background.bottom = c.getHeight();
                c.drawRect(new_Background, mBackgroundPaint);
            }
        }else {
            if(mViewPortHandler.getContentRect().right != c.getWidth()) {
                RectF new_Background = new RectF(mViewPortHandler.getContentRect());
                new_Background.left = mViewPortHandler.getContentRect().right + Utils.convertDpToPixel(1); //+ Utils.convertDpToPixel(1); //border
                new_Background.right = c.getWidth();
                new_Background.bottom = c.getHeight();
                c.drawRect(new_Background, mBackgroundPaint);
            }
        }

        if (!mYAxis.isEnabled() || !mYAxis.isDrawLabelsEnabled())
            return;

        super.renderAxisLabels(c);
    }
}
