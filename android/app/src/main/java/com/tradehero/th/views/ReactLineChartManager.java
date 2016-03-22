package com.tradehero.th.views;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.github.mikephil.charting.animation.Easing;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.tradehero.th.R;

import java.util.ArrayList;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactLineChartManager extends SimpleViewManager<ReactLineChart> {

    private static final String REACT_CLASS = "LineChart";

    @Override
    protected ReactLineChart createViewInstance(ThemedReactContext reactContext) {
        ReactLineChart chart = new ReactLineChart(reactContext);

        chart.setDrawGridBackground(false);

        // no description text
        chart.setDescription("");
        chart.setNoDataTextDescription("You need to provide data for the chart.");

        chart.setMinOffset(10f);

        chart.getXAxis().setPosition(XAxis.XAxisPosition.BOTH_SIDED);
        chart.getXAxis().setLabelsToSkip(19);

        YAxis leftAxis = chart.getAxisLeft();
        leftAxis.setAxisMaxValue(42f);
        leftAxis.setAxisMinValue(28f);
        leftAxis.enableGridDashedLine(10f, 10f, 0f);
        leftAxis.setDrawZeroLine(true);

        // limit lines are drawn behind data (and not on top)
        leftAxis.setDrawLimitLinesBehindData(true);
        leftAxis.setLabelCount(2, true);
        leftAxis.setPosition(YAxis.YAxisLabelPosition.INSIDE_CHART);

        chart.getAxisRight().setEnabled(false);

        // add data
        setData(reactContext, chart, 45, 10);

        chart.animateX(2500, Easing.EasingOption.EaseInOutQuart);

        return chart;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    private void setData(ThemedReactContext reactContext, ReactLineChart chart, int count, float range) {

        ArrayList<String> xVals = new ArrayList<String>();
        for (int i = 0; i < count; i++) {
            xVals.add((i) + "");
        }

        ArrayList<Entry> yVals = new ArrayList<Entry>();

        for (int i = 0; i < count; i++) {

            float mult = (range + 1);
            float val = (float) (Math.random() * mult) + 30;// + (float)
            // ((mult *
            // 0.1) / 10);
            yVals.add(new Entry(val, i));
        }

        // create a dataset and give it a type
        LineDataSet set1 = new LineDataSet(yVals, "DataSet 1");
        // set1.setFillAlpha(110);
        // set1.setFillColor(Color.RED);

        // set the line to be drawn like this "- - - - - -"
        set1.enableDashedLine(10f, 0f, 0f);
        set1.setColor(Color.WHITE);
        set1.setCircleColor(Color.TRANSPARENT);
        set1.setLineWidth(1f);
        set1.setCircleRadius(3f);
        set1.setDrawCircleHole(false);
        set1.setValueTextSize(0f);
        Drawable drawable = ContextCompat.getDrawable(reactContext, R.drawable.fade_red);
        set1.setFillDrawable(drawable);
        set1.setDrawFilled(true);

        ArrayList<ILineDataSet> dataSets = new ArrayList<ILineDataSet>();
        dataSets.add(set1); // add the datasets

        // create a data object with the datasets
        LineData data = new LineData(xVals, dataSets);

        // set data
        chart.setData(data);
    }
}
