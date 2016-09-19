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

/**
 * Created by Neko on 16/9/19.
 */
public abstract class CandleChartDrawer extends BaseChartDrawer {

    @Override
    public void initializeChart(CombinedChart chart) {
        chart.setDragEnabled(true);
        chart.setTouchEnabled(true);
        chart.setFocusableInTouchMode(false);
        chart.fitScreen();
    }

    @Override
    public CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<CandleEntry> yVals1 = new ArrayList<>();

        ArrayList<String> labels = new ArrayList<>();

        for (int i = 0; i < chartDataList.length(); i++) {
            //TODO: use real data
            float val = (float)chartDataList.getJSONObject(i).getDouble("p");

            float open = val;
            float close = val + (float) (Math.random() * 100) - 50f;

            float high = (float)( Math.max(open, close) + 50 * Math.random());
            float low = (float)( Math.max(open, close) - 50 * Math.random());

            yVals1.add(new CandleEntry(i, high, low, open,
                    close));

            labels.add(chartDataList.getJSONObject(i).getString("time"));
        }

        CandleDataSet set1 = new CandleDataSet(yVals1, "Data Set");
        set1.setAxisDependency(YAxis.AxisDependency.LEFT);
        set1.setDrawHighlightIndicators(true);

        set1.setShadowColorSameAsCandle(true);
        //set1.setShadowColor(Color.DKGRAY);
        set1.setShadowWidth(1f);
        //set1.setBarSpace(3f);

        set1.setDecreasingColor(ChartDrawerManager.CANDEL_DECREASE);
        set1.setDecreasingPaintStyle(Paint.Style.FILL);
        set1.setIncreasingColor(ChartDrawerManager.CANDEL_INCREASE);
        set1.setIncreasingPaintStyle(Paint.Style.FILL);
        set1.setDrawValues(true);
        set1.setNeutralColor(ChartDrawerManager.CANDEL_NEUTRAL);
        set1.setHighlightLineWidth(2.5f);
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

    @Override
    public void calculateZoom(CombinedChart chart, CombinedData data) {
        int dpi = chart.getResources().getDisplayMetrics().densityDpi;
        int totalWidth = chart.getWidth();

        int candleWidthDP = 5;
        int candleSpaceDP = 3;
        int candleWidth = (int)(candleWidthDP * dpi / 160);
        int candleSpace = (int)(candleSpaceDP * dpi / 160);
        int candleCount = (int)totalWidth / (candleWidth + candleSpace);

        //Make sure each screen only show 60 candles.
        int count = data.getXValCount();
        float scale = (float)count / candleCount;
        chart.zoom(scale, 1, count * scale, 0);
    }
}
