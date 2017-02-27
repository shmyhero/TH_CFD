package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.RectF;
import android.graphics.Region;

import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.renderer.XAxisRenderer;
import com.github.mikephil.charting.utils.Transformer;
import com.github.mikephil.charting.utils.Utils;
import com.github.mikephil.charting.utils.ViewPortHandler;

/**
 * Created by Neko on 2017/2/20.
 */

public class ReactXAxisRenderer extends XAxisRenderer {
    protected Paint mBackgroundPaint;
    protected int horizontalPaddingLeft = 0;
    protected int horizontalPaddingRight = 0;
    public ReactXAxisRenderer(ViewPortHandler viewPortHandler, XAxis xAxis, Transformer trans) {
        super(viewPortHandler, xAxis, trans);
    }

    public void setBackgroundColor(int color){
        mBackgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBackgroundPaint.setColor(color);
        mBackgroundPaint.setStyle(Paint.Style.FILL);
    }

    public void setHorizontalPaddingLeft(int value){
        horizontalPaddingLeft = value;
    }

    public void setHorizontalPaddingRight(int value){
        horizontalPaddingRight = value;
    }

    @Override
    public void renderLimitLineLine(Canvas c, LimitLine limitLine, float[] position) {
        c.clipRect(mViewPortHandler.getContentRect());
        super.renderLimitLineLine(c, limitLine, position);
        c.clipRect(new RectF(0,0,c.getWidth(),c.getHeight()), Region.Op.UNION);
    }

    @Override
    public void renderLimitLineLabel(Canvas c, LimitLine limitLine, float[] position, float yOffset) {
        float xOffset = limitLine.getLineWidth() + limitLine.getXOffset();
        final LimitLine.LimitLabelPosition labelPosition = limitLine.getLabelPosition();
        float textPosition = position[0];
        if (labelPosition == LimitLine.LimitLabelPosition.RIGHT_TOP) {
            textPosition = position[0] + xOffset;
        } else if (labelPosition == LimitLine.LimitLabelPosition.RIGHT_BOTTOM) {
            textPosition = position[0] + xOffset;
        } else if (labelPosition == LimitLine.LimitLabelPosition.LEFT_TOP) {
            textPosition = position[0] - xOffset;
        } else if (labelPosition == LimitLine.LimitLabelPosition.LEFT_BOTTOM){
            textPosition = position[0] - xOffset;
        } else {
            textPosition = position[0] - xOffset/2;
        }

        if(textPosition < mViewPortHandler.getContentRect().left || textPosition > mViewPortHandler.getContentRect().right ){
            //The limit line is hiding. Don't draw label also.
            return;
        }
//
//        RectF rect = new RectF();
//        rect.left = mViewPortHandler.getContentRect().left - (horizontalPaddingLeft * 2);
//        rect.right = mViewPortHandler.getContentRect().right + (horizontalPaddingRight * 2);
//        rect.top = 0;
//        rect.bottom = c.getHeight();
//        c.clipRect(rect);
        super.renderLimitLineLabel(c, limitLine, position, yOffset);
//        c.clipRect(new RectF(0,0,c.getWidth(),c.getHeight()), Region.Op.UNION);
    }
}
