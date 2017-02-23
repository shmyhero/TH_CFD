package com.tradehero.cfd.views;

import android.graphics.Color;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.formatter.YAxisValueFormatter;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.github.mikephil.charting.utils.Utils;
import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.module.LogicData;
import com.tradehero.cfd.views.chartDrawer.ChartDrawerBuilder;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;
import com.tradehero.cfd.views.chartDrawer.base.IChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class ReactChartManager extends ViewGroupManager<ReactChart> {

    private static final String REACT_CLASS = "LineChart";

    private ChartDrawerConstants.CHART_TYPE mChartType = ChartDrawerConstants.CHART_TYPE.today;

    int textColor = ChartDrawerConstants.CHART_TEXT_COLOR;
    int borderColor = ChartDrawerConstants.CHART_BORDER_COLOR;
    int chartOffsetLeft = 0;
    int chartOffsetRight = 0;
    int chartOffsetTop = 0;
    int chartOffsetBottom = 0;

    @Override
    protected ReactChart createViewInstance(ThemedReactContext reactContext) {

        ReactChart chart = new ReactChart(reactContext);
        chart.setDrawGridBackground(false);
        chart.setDragEnabled(true);
        chart.setScaleEnabled(true);
//        chart.setTouchEnabled(true);
        chart.getLegend().setEnabled(false);
        chart.setDoubleTapToZoomEnabled(false);
        chart.setScaleXEnabled(true);
        chart.setScaleMinima(0.5f,1.0f);
        chart.setScaleYEnabled(false);

        chart.setExtraOffsets(chartOffsetLeft,chartOffsetTop,chartOffsetRight,chartOffsetBottom);
        //chart.setViewPortOffsets(0,0,15,15);
        //chart.setExtraRightOffset(0);

        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
        chart.getXAxis().removeAllLimitLines();
        chart.getAxisLeft().setDrawLimitLinesBehindData(false);
        chart.getAxisRight().setDrawLimitLinesBehindData(false);
        chart.getXAxis().setDrawLimitLinesBehindData(false);
        chart.getAxisLeft().setDrawGridLines(false);
        chart.getAxisRight().setDrawGridLines(false);
        chart.getXAxis().setDrawGridLines(false);
        chart.getAxisLeft().setAxisLineColor(borderColor);
        chart.getAxisRight().setAxisLineColor(borderColor);
        chart.getXAxis().setAxisLineColor(borderColor);
        chart.getAxisLeft().setTextColor(textColor);
        chart.getAxisRight().setTextColor(textColor);
        chart.getXAxis().setTextColor(textColor);
        chart.getXAxis().setTextSize(8f);

        chart.getAxisRight().setValueFormatter(new YAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, YAxis yAxis) {
                return String.format("%.1f", value);
            }
        });

        chart.getAxisLeft().setSpaceTop(10);
        chart.getAxisLeft().setSpaceBottom(10);
        chart.getAxisRight().setSpaceTop(10);
        chart.getAxisRight().setSpaceBottom(10);
        chart.setDragDecelerationEnabled(false);//设置拖拽后放开,无惯性移动。
        chart.setDragEnabled(false);

        //chart.setExtraLeftOffset(15);
        chart.setHighlightPerDragEnabled(false);
        chart.setHighlightPerTapEnabled(false);
        chart.setOnChartGestureListener(new OnChartGestureListener() {
            @Override
            public void onChartGestureStart(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

            }

            @Override
            public void onChartGestureEnd(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

            }

            @Override
            public void onChartLongPressed(MotionEvent me) {

            }

            @Override
            public void onChartDoubleTapped(MotionEvent me) {

            }

            @Override
            public void onChartSingleTapped(MotionEvent me) {
                Log.d("","Chart onChartSingleTapped!!!");
                if(!MainActivity.isLandscape()){
                    LogicData.getInstance().sendChartClickedToRN();
                }
            }

            @Override
            public void onChartFling(MotionEvent me1, MotionEvent me2, float velocityX, float velocityY) {

            }

            @Override
            public void onChartScale(MotionEvent me, float scaleX, float scaleY) {

            }

            @Override
            public void onChartTranslate(MotionEvent me, float dX, float dY) {

            }
        });


        return chart;

    }

    @ReactProp(name = "data")
    public void setData(ReactChart chart, String stockInfoData) {
        if (chart != null && stockInfoData != null && stockInfoData.length() > 0) {

            try {
                JSONObject stockInfoObject = new JSONObject(stockInfoData);
                if (!stockInfoObject.has("priceData")) {
                    return;
                }

                JSONArray chartDataList = stockInfoObject.getJSONArray("priceData");

                //TODO: If you want to enable Drawer, undo-comment the following lines.

                IChartDrawer drawer = ChartDrawerBuilder.createDrawer(mChartType);
                drawer.setTextColor(textColor);
                drawer.setBorderColor(borderColor);

                if(drawer != null){
                    drawer.draw(chart, stockInfoObject, chartDataList);
                    return;
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @ReactProp(name = "colorType")
    public void setColorType(ReactChart chart, int type) {
        if (type == 1) {
            ChartDrawerConstants.CHART_BORDER_COLOR = Color.WHITE;
            ChartDrawerConstants.CHART_LINE_COLOR = Color.WHITE;
        }
    }

    @ReactProp(name = "chartType")
    public void setChartType(ReactChart chart, String type) {
        ChartDrawerConstants.CHART_TYPE[] allType = ChartDrawerConstants.CHART_TYPE.values();
        for (int i = 0; i < allType.length; i++) {
            if (allType[i].getName().equals(type)) {
                mChartType = allType[i];
                break;
            }
        }
    }

    @ReactProp(name = "chartIsActual")
    public void setChartIsActual(ReactChart chart, boolean chartIsActual){
        chart.setIsActual(chartIsActual);
        Log.d("ChartIsActual","chartIsActual = " + chartIsActual);
    }



    @ReactProp(name = "description")
    public void setDescription(ReactChart chart, String description) {
        if (chart != null) {
            chart.setDescription(description);
        }
    }

    @ReactProp(name = "descriptionColor")
    public void setDescriptionColor(ReactChart chart, int type) {
        if (chart != null) {
            chart.setDescriptionColorLRTB(type);
        }
    }

    @ReactProp(name = "noDataText")
    public void setNoDataText(ReactChart chart, String text) {
        if (chart != null) {
            chart.setNoDataText(text);
        }
    }

    @ReactProp(name = "noDataTextDescription")
    public void setNoDataTextDescription(ReactChart chart, String description) {
        if (chart != null) {
            if (description != null) {
                chart.setNoDataTextDescription(description);
            }
        }
    }

    @ReactProp(name = "padding", defaultFloat = 0.0f)
    public void setPadding(ReactChart chart, float padding) {
        if (chart != null) {
            chart.setMinOffset(padding);
        }
    }

    @ReactProp(name = "xAxisPosition")
    public void setXAxisPosition(ReactChart chart, String position) {
        if (chart != null) {
            chart.getXAxis().setPosition(XAxis.XAxisPosition.valueOf(position));
        }
    }

    @ReactProp(name = "xAxisStep", defaultInt = 1)
    public void setXAxisStep(ReactChart chart, int step) {
        if (chart != null) {
            chart.getXAxis().setLabelsToSkip(step - 1);
        }
    }

    @ReactProp(name = "xAxisTextSize", defaultFloat = 10.0f)
    public void setXAxisTextSize(ReactChart chart, float size) {
        if (chart != null) {
            chart.getXAxis().setTextSize(size);
        }
    }

    @ReactProp(name = "xAxisDrawLabel")
    public void setXAxisDrawLabel(ReactChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getXAxis().setDrawLabels(drawEnabled);
        }
    }

    @ReactProp(name = "leftAxisEnabled", defaultBoolean = true)
    public void setLeftAxisEnabled(ReactChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisLeft().setEnabled(enabled);
            this.setChartPaddingLeft(chart, chartOffsetLeft);
        }
    }

    @ReactProp(name = "leftAxisMaxValue")
    public void setLeftAxisMaxValue(ReactChart chart, float value) {
        if (chart != null) {
            chart.getAxisLeft().setAxisMaxValue(value);
        }
    }

    @ReactProp(name = "leftAxisMinValue")
    public void setLeftAxisMinValue(ReactChart chart, float value) {
        if (chart != null) {
            chart.getAxisLeft().setAxisMinValue(value);
        }
    }

    @ReactProp(name = "leftAxisPosition")
    public void setLeftAxisPosition(ReactChart chart, String position) {
        if (chart != null) {
            chart.getAxisLeft().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
        }
    }

    @ReactProp(name = "leftAxisLabelCount")
    public void setLeftAxisLabelCount(ReactChart chart, int num) {
        if (chart != null) {
            chart.getAxisLeft().setLabelCount(num, true);
        }
    }

    @ReactProp(name = "leftAxisTextSize", defaultFloat = 10.0f)
    public void setLeftAxisTextSize(ReactChart chart, float size) {
        if (chart != null) {
            chart.getAxisLeft().setTextSize(size);
        }
    }

    @ReactProp(name = "leftAxisDrawLabel")
    public void setLeftAxisDrawLabel(ReactChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getAxisLeft().setDrawLabels(drawEnabled);
            this.setChartPaddingLeft(chart, chartOffsetLeft);
        }
    }

    @ReactProp(name = "leftAxisLimitLines")
    public void setLeftAxisLimitLines(ReactChart chart, ReadableArray lines) {
        if (chart != null) {
            for (int i = 0; i < lines.size(); i++) {
                LimitLine line = new LimitLine(lines.getInt(i));
                line.setLineColor(Color.GRAY);
                line.setLineWidth(0.5f);
                line.enableDashedLine(10f, 0f, 0f);
                line.setTextSize(0f);

                chart.getAxisLeft().addLimitLine(line);
            }
        }
    }

    @ReactProp(name = "rightAxisEnabled", defaultBoolean = true)
    public void setRightAxisEnabled(ReactChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisRight().setEnabled(enabled);
            this.setChartPaddingRight(chart, chartOffsetLeft);
        }
    }

    @ReactProp(name = "rightAxisMaxValue")
    public void setRightAxisMaxValue(ReactChart chart, float value) {
        if (chart != null) {
            chart.getAxisRight().setAxisMaxValue(value);
        }
    }

    @ReactProp(name = "rightAxisMinValue")
    public void setRightAxisMinValue(ReactChart chart, float value) {
        if (chart != null) {
            chart.getAxisRight().setAxisMinValue(value);
        }
    }

    @ReactProp(name = "rightAxisPosition")
    public void setRightAxisPosition(ReactChart chart, String position) {
        if (chart != null) {
            chart.getAxisRight().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
        }
    }

    @ReactProp(name = "rightAxisLabelCount")
    public void setRightAxisLabelCount(ReactChart chart, int num) {
        if (chart != null) {
            chart.getAxisRight().setLabelCount(num, true);
        }
    }

    @ReactProp(name = "rightAxisTextSize", defaultFloat = 10.0f)
    public void setRightAxisTextSize(ReactChart chart, float size) {
        if (chart != null) {
            chart.getAxisRight().setTextSize(size);
        }
    }

    @ReactProp(name = "rightAxisDrawLabel")
    public void setRightAxisDrawLabel(ReactChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getAxisRight().setDrawLabels(drawEnabled);
            this.setChartPaddingRight(chart, chartOffsetRight);
        }
    }

    @ReactProp(name = "drawBackground")
    public void setDrawBackground(ReactChart chart, boolean enabled) {
        if (chart != null) {
            chart.setDrawGridBackground(enabled);
        }
    }

    @ReactProp(name = "backgroundColor")
    public void setBackgroundColor(ReactChart chart, String backgroundColor) {
        if (chart != null) {
            int colorInt = getColor(backgroundColor);
            chart.setGridBackgroundColor(colorInt);
        }
    }

    @ReactProp(name = "drawBorders")
    public void setDrawBorders(ReactChart chart, boolean drawBorders) {
        if (chart != null) {
            chart.setDrawBorders(drawBorders);
        }
    }

    @ReactProp(name = "rightAxisDrawGridLines")
    public void setRightAxisDrawGridLines(ReactChart chart, boolean drawGridLines) {
        if (chart != null) {
            chart.getAxisRight().setDrawGridLines(drawGridLines);
            chart.getAxisRight().setDrawAxisLine(drawGridLines);
        }
    }

    @ReactProp(name = "textColor")
    public void setTextColor(ReactChart chart, String color) {
        if (chart != null) {
            int colorInt = getColor(color);
            chart.getAxisLeft().setTextColor(colorInt);
            chart.getAxisRight().setTextColor(colorInt);
            chart.getXAxis().setTextColor(colorInt);
            textColor = colorInt;
        }
    }

    @ReactProp(name = "borderColor")
    public void setBorderColor(ReactChart chart, String color) {
        if (chart != null) {
            int colorInt = getColor(color);
            chart.setBorderColor(colorInt);
            chart.getAxisLeft().setAxisLineColor(colorInt);
            chart.getAxisLeft().setGridColor(colorInt);
            chart.getAxisRight().setAxisLineColor(colorInt);
            chart.getAxisRight().setGridColor(colorInt);
            chart.getXAxis().setAxisLineColor(colorInt);
            borderColor = colorInt;
        }
    }

    @ReactProp(name = "chartPaddingTop")
    public void setChartPaddingTop(ReactChart chart, int padding){
        if (chart != null) {
            //chartOffsetTop = (int)Utils.convertPixelsToDp(padding);
            chartOffsetTop = padding;
            if(chart.getXAxis().isEnabled() && chart.getXAxis().getPosition() == XAxis.XAxisPosition.TOP) {
                chart.getXAxis().setYOffset(chartOffsetTop);
                chart.setExtraTopOffset(0);
            }else {
                chart.setExtraTopOffset(chartOffsetTop);
            }
        }
    }

    @ReactProp(name = "chartPaddingLeft")
    public void setChartPaddingLeft(ReactChart chart, int padding){
        if (chart != null) {
            //chartOffsetLeft = (int)Utils.convertPixelsToDp(padding);
            chartOffsetLeft = padding;
            if(chart.getAxisLeft().isEnabled() && chart.getAxisLeft().isDrawLabelsEnabled()) {
                chart.getAxisLeft().setXOffset(chartOffsetLeft);
                chart.setExtraLeftOffset(0);
            }else {
                chart.setExtraLeftOffset(chartOffsetLeft);
            }
            chart.setXAxisPaddingLeft(chartOffsetLeft);
        }
    }

    @ReactProp(name = "chartPaddingRight")
    public void setChartPaddingRight(ReactChart chart, int padding){
        if (chart != null) {
            //chartOffsetRight = (int)Utils.convertPixelsToDp(padding);
            chartOffsetRight = padding;
            if(chart.getAxisRight().isEnabled() && chart.getAxisRight().isDrawLabelsEnabled()) {
                chart.getAxisRight().setXOffset(chartOffsetRight);
                chart.setExtraRightOffset(0);
            }else {
                chart.setExtraRightOffset(chartOffsetRight);
            }
            chart.setXAxisPaddingRight(chartOffsetLeft);
        }
    }

    @ReactProp(name = "chartPaddingBottom")
    public void setChartPaddingBottom(ReactChart chart, int padding){
        if (chart != null) {
            //chartOffsetBottom = (int)Utils.convertPixelsToDp(padding);
            chartOffsetBottom = padding;
            if(chart.getXAxis().isEnabled() && chart.getXAxis().getPosition() == XAxis.XAxisPosition.BOTTOM) {
                chart.getXAxis().setYOffset(chartOffsetBottom);
                chart.setExtraBottomOffset(0);
            }else {
                chart.setExtraBottomOffset(chartOffsetBottom);
            }
        }
    }

    @ReactProp(name = "lineChartGradient")
    public void setLineChartGradient(ReactChart chart, ReadableArray input){
        if (chart != null) {
            int[] colors = new int[input.size()];
            for (int i=0; i < colors.length; i++) {
                String colorStr = input.getString(i);
                colors[i] = getColor(colorStr);
            }
            chart.setGradientColors(colors);
        }
    }


    @Override
    public String getName() {
        return REACT_CLASS;
    }

    private int getColor(String colorStr){
        int color = 0;
        if(!colorStr.equalsIgnoreCase("transparent")) {
            color = Color.parseColor(colorStr);
        }
        return color;
    }
}
