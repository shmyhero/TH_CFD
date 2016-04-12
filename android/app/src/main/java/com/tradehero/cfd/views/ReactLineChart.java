package com.tradehero.cfd.views;

import android.content.Context;
import android.util.AttributeSet;

import com.facebook.react.uimanager.MeasureSpecAssertions;
import com.github.mikephil.charting.charts.LineChart;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactLineChart extends LineChart {
    public ReactLineChart(Context context) {
        super(context);
    }

    public ReactLineChart(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ReactLineChart(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        MeasureSpecAssertions.assertExplicitMeasureSpec(widthMeasureSpec, heightMeasureSpec);

        setMeasuredDimension(
                MeasureSpec.getSize(widthMeasureSpec),
                MeasureSpec.getSize(heightMeasureSpec));
    }
}
