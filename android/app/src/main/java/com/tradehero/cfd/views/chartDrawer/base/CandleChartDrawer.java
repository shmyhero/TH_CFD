package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Paint;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CandleData;
import com.github.mikephil.charting.data.CandleDataSet;
import com.github.mikephil.charting.data.CandleEntry;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.tradehero.cfd.StringUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class CandleChartDrawer extends BaseChartDrawer {


    int _perScreenCandleCount = 30;

    @Override
    protected void resetChart(final CombinedChart chart) {
        super.resetChart(chart);
        chart.setDragEnabled(true);
        chart.setTouchEnabled(true);
        chart.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_UP:
                        resetChartInScreen(chart, false);
                        break;
                }
                return false;
            }
        });
    }

    public void resetChartInScreen(final CombinedChart chart, boolean isShowEnd) {
        float minV = Float.MAX_VALUE;
        float maxV = Float.MIN_VALUE;
        float maxY = chart.getYChartMax();
        float minY = chart.getYChartMin();
        int highIndex = chart.getHighestVisibleXIndex();
        int lowIndex = chart.getLowestVisibleXIndex();
        if (isShowEnd) {
            highIndex = chart.getData().getXValCount();
            lowIndex = highIndex - _perScreenCandleCount;
        }

        try {
            for (int i = lowIndex - 2; i < highIndex + 2; i++) {
                if (i >= 0 && i < chart.getData().getXValCount()) {
                    float high = (float) mChartDataList.getJSONObject(i).getDouble("high");
                    float low = (float) mChartDataList.getJSONObject(i).getDouble("low");
                    minV = Math.min(low, minV);
                    maxV = Math.max(high, maxV);
                }
            }
        } catch (Exception e) {
            Log.e("resetChartInScreen", e.toString());
        }

        if (chart.getScaleY() > 0) {
            chart.zoom(1, 1 / chart.getScaleY(), 0, 0);
        }

        float ScaleY = (maxY - minY) / (maxV - minV);
        chart.zoom(1, ScaleY * 0.6f, 0f, 0f);
        int indexCenter = Math.round((chart.getLowestVisibleXIndex() + chart.getHighestVisibleXIndex()) / 2);
        if (isShowEnd) {
            indexCenter = chart.getData().getXValCount();
        }
        chart.centerViewTo(indexCenter, (maxV + minV) / 2, YAxis.AxisDependency.LEFT);

        if (preClose != 0 && _perScreenCandleCount > 0) {
            float maxPrice = maxV;
            float minPrice = minV;
            float maxPercentage = (maxPrice - preClose) / preClose * 100;
            float minPercentage = (minPrice - preClose) / preClose * 100;
            setDescription(chart, StringUtils.formatNumber(maxPrice), StringUtils.formatNumber(minPrice), StringUtils.formatNumber(maxPercentage) + "%", StringUtils.formatNumber(minPercentage) + "%");
        } else {
            setDescription(chart, "", "", "", "");
        }

    }

    @Override
    protected CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<CandleEntry> yVals1 = new ArrayList<>();

        ArrayList<String> labels = new ArrayList<>();
        mChartDataList = chartDataList;

        for (int i = 0; i < chartDataList.length(); i++) {
            float open = (float) chartDataList.getJSONObject(i).getDouble("open");
            float close = (float) chartDataList.getJSONObject(i).getDouble("close");

            float high = (float) chartDataList.getJSONObject(i).getDouble("high");
            float low = (float) chartDataList.getJSONObject(i).getDouble("low");

            yVals1.add(new CandleEntry(i, high, low, open, close));

            labels.add(chartDataList.getJSONObject(i).getString("time"));
        }

        CandleDataSet set1 = new CandleDataSet(yVals1, "Data Set");
        set1.setAxisDependency(YAxis.AxisDependency.LEFT);
//        set1.setDrawHighlightIndicators(true);

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
    protected LimitLineInfo calculateLimitLinesPosition(Calendar startUpLine, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<Integer> limitLineAt = new ArrayList<>();
        ArrayList<Calendar> limitLineCalender = new ArrayList<>();

        Calendar nextLineAt = startUpLine;

        int firstLine = 0;
//        limitLineAt.add(firstLine);
//        limitLineCalender.add(timeStringToCalendar(chartDataList.getJSONObject(firstLine).getString("time")));

        for (int i = 0; i < chartDataList.length(); i++) {
            Calendar calendar = timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));

            if (nextLineAt == null) {
                calendar.add(getGapLineUnit(), getGapLineUnitAddMount());
                nextLineAt = calendar;
            } else if (calendar.after(nextLineAt)) {

                while (calendar.after(nextLineAt)) {
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
        float density = chart.getResources().getDisplayMetrics().density;
        float totalWidth = chart.getWidth() / density;

        int candleWidthDP = 4;
        int candleSpaceDP = 2;
        float perScreenCandleCount = (totalWidth - 12 * 2) / (candleWidthDP + candleSpaceDP);

        perScreenCandleCount = (float) Math.ceil(perScreenCandleCount);
        if (perScreenCandleCount % 2 == 0) {
            perScreenCandleCount += 1;
        }
        _perScreenCandleCount = (int) perScreenCandleCount;

        int totalCandleCount = data.getXValCount();

        if (perScreenCandleCount < totalCandleCount) {
            chart.setVisibleXRangeMinimum(1 / perScreenCandleCount);
            float scale = (float) totalCandleCount / perScreenCandleCount;
            chart.zoom(scale, 1, totalCandleCount * scale, 0);
            chart.moveViewToX(totalCandleCount * scale);
        } else {
            chart.setVisibleXRangeMinimum(perScreenCandleCount);
        }

        resetChartInScreen(chart, true);


    }


}
