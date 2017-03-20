package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.utils.Utils;
import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.StringUtils;
import com.tradehero.cfd.views.ReactChart;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

/**
 * for plClose lineStickChart
 */
public abstract class LineStickPLChartDrawer extends BaseChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
        chart.setDragEnabled(false);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(!MainActivity.isLandscape());
    }

    protected Drawable getGradientDrawable(int[] colors){
        GradientDrawable gradient = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, colors);
        gradient.setShape(GradientDrawable.RECTANGLE);
        return gradient;
    }


    @Override
    protected boolean isDataAcceptable(JSONArray chartDataList){
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
            float val = (float) (chartDataList.getJSONObject(i).getDouble("pl"));
            if (val > maxVal) {
                maxVal = val;
            }
            if (val < minVal) {
                minVal = val;
            }
            yVals.add(new Entry(val, i));
        }

        minVal = Math.min(minVal, (float) 0);
        maxVal = Math.max(maxVal, (float) 0);

        minVal -= (maxVal - minVal) / 5;
        maxVal += (maxVal - minVal) / 5;


        int[] circleColors = {Color.TRANSPARENT};
//        if (yVals.size() > 0) {
//            circleColors = new int[yVals.size()];
//            for (int i = 0; i < yVals.size(); i++) {
//                circleColors[i] = Color.TRANSPARENT;
//            }
//            circleColors[yVals.size() - 1] = Color.WHITE;
//        }

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
        set1.setDrawFilled(false);

        LineData d = new LineData();
        d.addDataSet(set1);
                /*ArrayList<ILineDataSet> dataSets = new ArrayList<ILineDataSet>();
                dataSets.add(set1); // add the datasets

                // create a data object with the datasets
*/
        CombinedData data = new CombinedData(xVals);
        data.setData(d);
        return data;
    }

    @Override
    public String getLableBlank() {
        return "          ";
    }


    public boolean needDrawDescription(){
        return false;
    }

    @Override
    protected void drawLimitLine(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {


        // Set the yAxis lines with 1 hour in between.
        Calendar startUpLine = getStartUpTimeLine(stockInfoObject, chartDataList);

        if (chartDataList.length() > 0) {
            LimitLineInfo limitLineInfo = calculateLimitLinesPosition(startUpLine, stockInfoObject, chartDataList);

            boolean needSkipLabel = false;
            if (limitLineInfo.limitLineAt.size() >= 7) {
                needSkipLabel = getLabelsToSkip() > 0 ? true : false;
            }

            for (int i = 0; i < limitLineInfo.limitLineAt.size(); i++) {
                int index = limitLineInfo.limitLineAt.get(i);
                Calendar calendar = limitLineInfo.limitLineCalender.get(i);

                LimitLine gapLine = new LimitLine(index);
                gapLine.setLineColor(borderColor);
                gapLine.setLineWidth(ChartDrawerConstants.LINE_WIDTH);
                gapLine.enableDashedLine(10f, 0f, 0f);
                //gapLine.setTextSize(8);
                gapLine.setTextSize(Utils.convertPixelsToDp(chart.getXAxis().getTextSize())); //BUGBUG: Change the text size will cause the text not center align... Fix the bug later...
                //gapLine.setTextSize(chart.getXAxis().getTextSize());
                gapLine.setTextColor(textColor);
                gapLine.setXOffset(0);
                gapLine.setYOffset(Math.max((Utils.convertPixelsToDp(chart.getXAxis().getYOffset())), 0));
                //gapLine.setYOffset(Math.max((Utils.convertPixelsToDp(chart.getXAxis().getYOffset()-gapLine.getTextSize())), 0));
//                if (needSkipLabel && i < limitLineInfo.limitLineAt.size() - 1 && i % 2 == 1) {
                if(needSkipLabel && isNeedHide(i,limitLineInfo.limitLineAt.size())){
                    gapLine.setLabel("");
                } else {
                    String label = formatXAxisLabelText(calendar.getTime());
                    if (i == 0) {
                        label = getLableBlank() + label;
                    } else if (i == limitLineInfo.limitLineAt.size() - 1) {
                        label = label + getLableBlank();
                    }
                    gapLine.setLabel(label);
                }
                gapLine.setLabelPosition(LimitLine.LimitLabelPosition.BELOW_BOTTOM);

                chart.getXAxis().addLimitLine(gapLine);
            }
        }
    }

    @Override
    protected LimitLineInfo calculateLimitLinesPosition(Calendar startUpLine, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<Integer> limitLineAt = new ArrayList<>();
        ArrayList<Calendar> limitLineCalender = new ArrayList<>();

        Calendar nextLineAt = startUpLine;

        int firstLine = 0;
        limitLineAt.add(firstLine);
        limitLineCalender.add(timeStringToCalendar(chartDataList.getJSONObject(firstLine).getString("date")));

        for (int i = 0; i < chartDataList.length(); i++) {
            Calendar calendar = timeStringToCalendar(chartDataList.getJSONObject(i).getString("date"));

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
            limitLineCalender.add(timeStringToCalendar(chartDataList.getJSONObject(lastLine).getString("date")));
        }

        LimitLineInfo info = new LimitLineInfo();
        info.limitLineAt = limitLineAt;
        info.limitLineCalender = limitLineCalender;
        return info;
    }

    @Override
    protected String formatXAxisLabelText(Date date) {
//        if(date.getHours() == 0){
            return new SimpleDateFormat("M/d").format(date);
//        }else{
//            return new SimpleDateFormat("H").format(date);
//        }
    }

    @Override
    protected void calculateZoom(CombinedChart chart, CombinedData data) {
        chart.setVisibleXRangeMinimum(1);
//        if (preClose != 0) {
//            float maxPrice = data.getYMax();
//            float minPrice = data.getYMin();
//            float maxPercentage = (maxPrice - preClose) / preClose * 100;
//            float minPercentage = (minPrice - preClose) / preClose * 100;
//            setDescription(chart, StringUtils.formatNumber(maxPrice), StringUtils.formatNumber(minPrice), StringUtils.formatNumber(maxPercentage) + "%", StringUtils.formatNumber(minPercentage) + "%");
//        } else {
//            setDescription(chart, "", "", "", "");
//        }
//
//        if(!needDrawDescription()){
//            setDescription(chart, "", "", "", "");
//        }

    }
}
