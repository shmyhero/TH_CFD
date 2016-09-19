package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.tradehero.cfd.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class LineStickChartDrawer extends BaseChartDrawer {

    @Override
    public void initializeChart(CombinedChart chart) {
        chart.setDragEnabled(false);
        chart.setTouchEnabled(false);
        chart.zoom(1 / chart.getScaleX(), 1, 0, 0);
    }

    @Override
    public CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<String> xVals = new ArrayList<String>();
        ArrayList<Entry> yVals = new ArrayList<Entry>();


        for (int i = 0; i < chartDataList.length(); i++) {
            xVals.add((i) + "");
        }
        for (int i = 0; i < chartDataList.length(); i++) {
            float val = (float) (chartDataList.getJSONObject(i).getDouble("p"));
            if (val > maxVal) {
                maxVal = val;
            }
            if (val < minVal) {
                minVal = val;
            }
            yVals.add(new Entry(val, i));
        }

        minVal = Math.min(minVal, (float)stockInfoObject.getDouble("preClose"));
        maxVal = Math.max(maxVal, (float)stockInfoObject.getDouble("preClose"));


        minVal -= (maxVal - minVal) / 5;
        maxVal += (maxVal - minVal) / 5;


        int[] circleColors = {Color.TRANSPARENT};
        if (yVals.size() > 0 && stockInfoObject.getBoolean("isOpen")) {
            circleColors = new int[yVals.size()];
            for (int i = 0; i < yVals.size(); i++) {
                circleColors[i] = Color.TRANSPARENT;
            }
            circleColors[yVals.size() - 1] = Color.WHITE;
        }

        // create a dataset and give it a type
        LineDataSet set1 = new LineDataSet(yVals, "DataSet 1");
        // set1.setFillAlpha(110);
        // set1.setFillColor(Color.RED);

        // set the line to be drawn like this "- - - - - -"
        set1.enableDashedLine(10f, 0f, 0f);
        set1.setColor(Color.WHITE);
        set1.setLineWidth(ChartDrawerManager.LINE_WIDTH_PRICE);
        set1.setDrawCircles(true);
        set1.setDrawCircleHole(false);
        set1.setCircleColors(circleColors);
        set1.setValueTextSize(0f);
        Drawable drawable = ContextCompat.getDrawable(chart.getContext(), R.drawable.stock_price_fill_color);
        set1.setFillDrawable(drawable);
        set1.setDrawFilled(true);

        LineData d = new LineData();
        d.addDataSet(set1);
                /*ArrayList<ILineDataSet> dataSets = new ArrayList<ILineDataSet>();
                dataSets.add(set1); // add the datasets

                // create a data object with the datasets
*/
        CombinedData data = new CombinedData(xVals);
        data.setData(d);
        return data;
        //LineData data = new LineData(xVals, dataSets);
    }
}
