package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.ShapeDrawable;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.MotionEvent;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.R;
import com.tradehero.cfd.StringUtils;
import com.tradehero.cfd.module.LogicData;
import com.tradehero.cfd.views.ReactChart;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class LineStickChartDrawer extends BaseChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
        chart.setDragEnabled(false);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(!((ReactChart)chart).isLandspace());
//        chart.setTouchEnabled(!MainActivity.isLandscape());
    }

    protected Drawable getGradientDrawable(int[] colors){
        GradientDrawable gradient = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, colors);
        gradient.setShape(GradientDrawable.RECTANGLE);
        //gradient.setShape(GradientDrawable.RECTANGLE);
        //gradient.setCornerRadius(0);
        return gradient;
    }


    @Override
    protected boolean isDataAcceptable(JSONArray chartDataList){
        try {
            for (int i = 0; i < chartDataList.length(); i++) {
                if(chartDataList.getJSONObject(i).has("p")) {
                    return true;
                }
                else{
                    return false;
                }
            }
        }catch (Exception e){
            return false;
        }
        return true;
    }

    protected int getDataSetColor(){
        return ChartDrawerConstants.CHART_DATA_SET_COLOR;
    }

    @Override
    protected CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
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

        if(needDrawPreCloseLine()) {
            minVal = Math.min(minVal, (float) stockInfoObject.getDouble("preClose"));
            maxVal = Math.max(maxVal, (float) stockInfoObject.getDouble("preClose"));
        }

        minVal -= (maxVal - minVal) / 5;
        maxVal += (maxVal - minVal) / 5;

        formatRightAxisText(chart, maxVal, minVal);

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
        set1.setColor(getDataSetColor());
        set1.setLineWidth(ChartDrawerConstants.LINE_WIDTH_PRICE);
        set1.setDrawCircles(true);
        set1.setDrawCircleHole(false);
        set1.setCircleColors(circleColors);
        set1.setValueTextSize(0f);
//        boolean isActual = false;
//        try {
//            isActual = ((ReactChart) chart).isAcutal;
//        } catch (Exception e) {
//            Log.e("", e.toString());
//        }

        Drawable drawable = getGradientDrawable(((ReactChart)chart).getGradientColors());
        //Drawable drawable = ContextCompat.getDrawable(chart.getContext(), isActual ? R.drawable.stock_price_fill_color_actual : R.drawable.stock_price_fill_color);

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

    @Override
    public String getLableBlank() {
        return "          ";
    }


    public boolean needDrawDescription(CombinedChart chart){
        if(((ReactChart)chart).isLandspace())return false;
        return true;
    }

    @Override
    protected void calculateZoom(CombinedChart chart, CombinedData data) {
        chart.setVisibleXRangeMinimum(1);
        if (needDrawDescription(chart) && preClose != 0) {
            float maxPrice = data.getYMax();
            float minPrice = data.getYMin();
            float maxPercentage = (maxPrice - preClose) / preClose * 100;
            float minPercentage = (minPrice - preClose) / preClose * 100;
            setDescription(chart, StringUtils.formatNumber(maxPrice), StringUtils.formatNumber(minPrice), StringUtils.formatNumber(maxPercentage) + "%", StringUtils.formatNumber(minPercentage) + "%");
        } else {
            setDescription(chart, "", "", "", "");
        }

        if(!needDrawDescription(chart)){
            setDescription(chart, "", "", "", "");
        }

    }
}
