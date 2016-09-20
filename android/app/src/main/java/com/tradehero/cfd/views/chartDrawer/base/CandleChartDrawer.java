package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Paint;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CandleData;
import com.github.mikephil.charting.data.CandleDataSet;
import com.github.mikephil.charting.data.CandleEntry;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.github.mikephil.charting.utils.ViewPortHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class CandleChartDrawer extends BaseChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
        chart.setDragEnabled(true);
        chart.setTouchEnabled(true);
    }

    @Override
    protected CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<CandleEntry> yVals1 = new ArrayList<>();

        ArrayList<String> labels = new ArrayList<>();

        for (int i = 0; i < chartDataList.length(); i++) {
            float open = (float)chartDataList.getJSONObject(i).getDouble("Open");
            float close = (float)chartDataList.getJSONObject(i).getDouble("Close");

            float high = (float)chartDataList.getJSONObject(i).getDouble("High");
            float low = (float)chartDataList.getJSONObject(i).getDouble("Low");

            yVals1.add(new CandleEntry(i, high, low, open,
                    close));

            labels.add(chartDataList.getJSONObject(i).getString("Time"));
        }

        CandleDataSet set1 = new CandleDataSet(yVals1, "Data Set");
        set1.setAxisDependency(YAxis.AxisDependency.LEFT);
        set1.setDrawHighlightIndicators(true);

        set1.setShadowColorSameAsCandle(true);
        //set1.setShadowColor(Color.DKGRAY);
        set1.setShadowWidth(1f);
        //set1.setBarSpace(3f);

        set1.setDecreasingColor(ChartDrawerConstants.CANDEL_DECREASE);
        set1.setDecreasingPaintStyle(Paint.Style.FILL);
        set1.setIncreasingColor(ChartDrawerConstants.CANDEL_INCREASE);
        set1.setIncreasingPaintStyle(Paint.Style.FILL);
        set1.setDrawValues(true);
        set1.setNeutralColor(ChartDrawerConstants.CANDEL_NEUTRAL);
        set1.setHighlightEnabled(false);
        set1.setValueFormatter(new ValueFormatter() {
            @Override
            public String getFormattedValue(float value, Entry entry, int dataSetIndex, ViewPortHandler viewPortHandler) {
                return "";
            }
        });

        CandleData d = new CandleData();
        d.addDataSet(set1);

        CombinedData data = new CombinedData(labels);
        data.setData(d);

        maxVal = data.getYMax();
        minVal = data.getYMin();
        minVal -= (maxVal - minVal) / 5;
        maxVal += (maxVal - minVal) / 5;

        return data;
    }

    //TODO: remove this function when api returns "time" instead of "Time".
    @Override
    protected LimitLineInfo calculateLimitLinesPosition(Calendar startUpLine, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException{
        ArrayList<Integer> limitLineAt = new ArrayList<>();
        ArrayList<Calendar> limitLineCalender = new ArrayList<>();

        Calendar nextLineAt = startUpLine;

        int firstLine = 0;
        limitLineAt.add(firstLine);
        limitLineCalender.add(timeStringToCalendar(chartDataList.getJSONObject(firstLine).getString("Time")));

        for(int i = 0; i < chartDataList.length(); i ++) {
            Calendar calendar = timeStringToCalendar(chartDataList.getJSONObject(i).getString("Time"));

            if (nextLineAt == null) {
                calendar.add(getGapLineUnit(), getGapLineUnitAddMount());
                nextLineAt = calendar;
            } else if (calendar.after(nextLineAt)) {

                while(calendar.after(nextLineAt)) {
                    nextLineAt.add(getGapLineUnit(), getGapLineUnitAddMount());
                }

                limitLineAt.add(i);
                limitLineCalender.add(calendar);
            }
        }

        if (needDrawEndLine(stockInfoObject)) {
            int lastLine = chartDataList.length() - 1;
            limitLineAt.add(lastLine);
            limitLineCalender.add(timeStringToCalendar(chartDataList.getJSONObject(lastLine).getString("time")));
        }

        LimitLineInfo info = new LimitLineInfo();
        info.limitLineAt = limitLineAt;
        info.limitLineCalender = limitLineCalender;
        return info;
    }

    @Override
    protected void calculateZoom(CombinedChart chart, CombinedData data) {
        int dpi = chart.getResources().getDisplayMetrics().densityDpi;
        int totalWidth = chart.getWidth();

        //Wrong calculation!
        int candleWidthDP = 5;
        //int candleSpaceDP = 3;
        int candleWidth = (candleWidthDP * dpi / 160);
        //int candleSpace = (candleSpaceDP * dpi / 160);
        int perScreenCandleCount = totalWidth / (candleWidth /*+ candleSpace*/);

        //Make sure each screen only show 60 candles.
        int totalCandleCount = data.getXValCount();

        if(perScreenCandleCount < totalCandleCount) {
            float scale = (float) totalCandleCount / perScreenCandleCount;
            chart.zoom(scale, 1, totalCandleCount * scale, 0);
        }
    }
}
