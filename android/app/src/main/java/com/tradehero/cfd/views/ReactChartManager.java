package com.tradehero.cfd.views;

import android.graphics.Color;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerBuilder;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;
import com.tradehero.cfd.views.chartDrawer.base.IChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;



public class ReactChartManager extends ViewGroupManager<ReactChart> {

    private static final String REACT_CLASS = "LineChart";

    private ChartDrawerConstants.CHART_TYPE mChartType = ChartDrawerConstants.CHART_TYPE.today;

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

        chart.setExtraLeftOffset(0);
        chart.setExtraRightOffset(0);

        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
        chart.getXAxis().removeAllLimitLines();
        chart.getAxisLeft().setDrawLimitLinesBehindData(false);
        chart.getAxisRight().setDrawLimitLinesBehindData(false);
        chart.getXAxis().setDrawLimitLinesBehindData(false);
        chart.getAxisLeft().setDrawGridLines(false);
        chart.getAxisRight().setDrawGridLines(false);
        chart.getXAxis().setDrawGridLines(false);
        chart.getAxisLeft().setAxisLineColor(ChartDrawerConstants.CHART_BORDER_COLOR);
        chart.getAxisRight().setAxisLineColor(ChartDrawerConstants.CHART_BORDER_COLOR);
        chart.getXAxis().setAxisLineColor(ChartDrawerConstants.CHART_BORDER_COLOR);
        chart.getAxisLeft().setTextColor(ChartDrawerConstants.CHART_TEXT_COLOR);
        chart.getAxisRight().setTextColor(ChartDrawerConstants.CHART_TEXT_COLOR);
        chart.getXAxis().setTextColor(ChartDrawerConstants.CHART_TEXT_COLOR);
        chart.getXAxis().setTextSize(8f);
        chart.getAxisLeft().setSpaceTop(20);
        chart.getAxisLeft().setSpaceBottom(20);
        chart.getAxisRight().setSpaceTop(20);
        chart.getAxisRight().setSpaceBottom(20);
        chart.setDragDecelerationEnabled(false);//设置拖拽后放开,无惯性移动。
        chart.setDragEnabled(false);



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
        }
    }



    @Override
    public String getName() {
        return REACT_CLASS;
    }

}
