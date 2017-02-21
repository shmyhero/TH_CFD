package com.tradehero.cfd.views;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.Log;

import com.facebook.react.uimanager.MeasureSpecAssertions;
import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.renderer.XAxisRenderer;
import com.tradehero.cfd.views.chartDrawer.base.ReactXAxisRenderer;
import com.tradehero.cfd.views.chartDrawer.base.ReactYAxisRenderer;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactChart extends CombinedChart {
    public boolean isAcutal = false;

    public ReactChart(Context context) {
        super(context);
    }

    public ReactChart(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ReactChart(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        MeasureSpecAssertions.assertExplicitMeasureSpec(widthMeasureSpec, heightMeasureSpec);

        setMeasuredDimension(
                MeasureSpec.getSize(widthMeasureSpec),
                MeasureSpec.getSize(heightMeasureSpec));
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // No-op since UIManagerModule handles actually laying out children.
    }

    @Override
    public void requestLayout() {
        // No-op, terminate `requestLayout` here, UIManagerModule handles laying out children and
        // `layout` is called on all RN-managed views by `NativeViewHierarchyManager`
    }

//    @Override
//    public void computeScroll(){
//        return;
//    }


    public void setIsActual(boolean isActual){
        this.isAcutal = isActual;
    }

    @Override
    protected void init() {
        super.init();

        mAxisRendererLeft = new ReactYAxisRenderer(mViewPortHandler, mAxisLeft, mLeftAxisTransformer);
        ((ReactYAxisRenderer)mAxisRendererLeft).setBackgroundColor(Color.rgb(240, 240, 240)); // light
        mAxisRendererRight = new ReactYAxisRenderer(mViewPortHandler, mAxisRight, mRightAxisTransformer);
        ((ReactYAxisRenderer)mAxisRendererRight).setBackgroundColor(Color.rgb(240, 240, 240)); // light

        mXAxisRenderer = new ReactXAxisRenderer(mViewPortHandler, mXAxis, mLeftAxisTransformer);
        ((ReactXAxisRenderer)mXAxisRenderer).setBackgroundColor(Color.rgb(240, 240, 240)); // light
    }

//    @Override
//    protected void onDraw(Canvas canvas) {
//        super.onDraw(canvas);
//
//        ((ReactYAxisRenderer)mAxisRendererRight).setBackgroundColor(mGridBackgroundPaint);
//
//        RectF new_Background = new RectF(mViewPortHandler.getContentRect());
//        new_Background.left = mViewPortHandler.getContentRect().right;
//        new_Background.right = canvas.getWidth();
//        new_Background.bottom = canvas.getHeight();
//        canvas.drawRect(new_Background, mGridBackgroundPaint);
//
//        mAxisRendererLeft.renderAxisLabels(canvas);
//        mAxisRendererRight.renderAxisLabels(canvas);
//    }


    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        //canvas.drawRect(mViewPortHandler.getContentRect(), mBorderPaint);
    }

    public void setGridBackgroundColor(int color) {
        super.setGridBackgroundColor(0);
        ((ReactYAxisRenderer)mAxisRendererRight).setBackgroundColor(color);
        ((ReactYAxisRenderer)mAxisRendererLeft).setBackgroundColor(color);
        ((ReactXAxisRenderer)mXAxisRenderer).setBackgroundColor(color);
    }
//
//    @Override
//    protected void drawGridBackground(Canvas c) {
//        super.drawGridBackground(c);
//
//        if (mDrawGridBackground) {
//
//            // draw the grid background
//            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
//            new_Background.left = mViewPortHandler.getContentRect().right;
//            new_Background.right = c.getWidth();
//            c.drawRect(new_Background, mGridBackgroundPaint);
//        }
//
//        if (mDrawBorders) {
//            c.drawRect(mViewPortHandler.getContentRect(), mBorderPaint);
//        }
//    }
}
