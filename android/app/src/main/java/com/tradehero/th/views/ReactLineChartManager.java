package com.tradehero.th.views;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
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
        chart.setDragEnabled(false);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(false);
        chart.getLegend().setEnabled(false);

        // add data
        setData(reactContext, chart, 45, 10);

        return chart;
    }

    @ReactProp(name = "description")
    public void setDescription(ReactLineChart chart, @Nullable String description) {
        if (chart != null) {
            chart.setDescription(description);
        }
    }

    @ReactProp(name = "noDataTextDescription")
    public void setNoDataTextDescription(ReactLineChart chart, @Nullable String description) {
        if (chart != null) {
            if (description != null) {
                chart.setNoDataTextDescription(description);
            }
        }
    }

    @ReactProp(name = "padding", defaultFloat = 0.0f)
    public void setPadding(ReactLineChart chart, float padding) {
        if (chart != null) {
            chart.setMinOffset(padding);
        }
    }

    @ReactProp(name = "xAxisPosition")
    public void setXAxisPosition(ReactLineChart chart, @Nullable String position) {
        if (chart != null) {
            chart.getXAxis().setPosition(XAxis.XAxisPosition.valueOf(position));
        }
    }

    @ReactProp(name = "xAxisStep", defaultInt = 1)
    public void setXAxisStep(ReactLineChart chart, int step) {
        if (chart != null) {
            chart.getXAxis().setLabelsToSkip(step - 1);
        }
    }

    @ReactProp(name = "xAxisTextSize", defaultFloat = 10.0f)
    public void setXAxisTextSize(ReactLineChart chart, float size) {
        if (chart != null) {
            chart.getXAxis().setTextSize(size);
        }
    }

    @ReactProp(name = "leftAxisEnabled", defaultBoolean = true)
    public void setLeftAxisEnabled(ReactLineChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisLeft().setEnabled(enabled);
        }
    }

    @ReactProp(name = "leftAxisMaxValue")
    public void setLeftAxisMaxValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisLeft().setAxisMaxValue(value);
        }
    }

    @ReactProp(name = "leftAxisMinValue")
    public void setLeftAxisMinValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisLeft().setAxisMinValue(value);
        }
    }

    @ReactProp(name = "leftAxisPosition")
    public void setLeftAxisPosition(ReactLineChart chart, String position) {
        if (chart != null) {
            chart.getAxisLeft().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
        }
    }

    @ReactProp(name = "leftAxisLabelCount")
    public void setLeftAxisLabelCount(ReactLineChart chart, int num) {
        if (chart != null) {
            chart.getAxisLeft().setLabelCount(num, true);
        }
    }

    @ReactProp(name = "leftAxisTextSize", defaultFloat = 10.0f)
    public void setLeftAxisTextSize(ReactLineChart chart, float size) {
        if (chart != null) {
            chart.getAxisLeft().setTextSize(size);
        }
    }

    @ReactProp(name = "rightAxisEnabled", defaultBoolean = true)
    public void setRightAxisEnabled(ReactLineChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisRight().setEnabled(enabled);
        }
    }

    @ReactProp(name = "rightAxisMaxValue")
    public void setRightAxisMaxValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisRight().setAxisMaxValue(value);
        }
    }

    @ReactProp(name = "rightAxisMinValue")
    public void setRightAxisMinValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisRight().setAxisMinValue(value);
        }
    }

    @ReactProp(name = "rightAxisPosition")
    public void setRightAxisPosition(ReactLineChart chart, String position) {
        if (chart != null) {
            chart.getAxisRight().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
        }
    }

    @ReactProp(name = "rightAxisLabelCount")
    public void setRightAxisLabelCount(ReactLineChart chart, int num) {
        if (chart != null) {
            chart.getAxisRight().setLabelCount(num, true);
        }
    }

    @ReactProp(name = "rightAxisTextSize", defaultFloat = 10.0f)
    public void setRightAxisTextSize(ReactLineChart chart, float size) {
        if (chart != null) {
            chart.getAxisRight().setTextSize(size);
        }
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
