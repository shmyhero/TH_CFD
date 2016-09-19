package com.tradehero.cfd.views.chartDrawer.base;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.formatter.XAxisValueFormatter;
import com.github.mikephil.charting.utils.ViewPortHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class BaseChartDrawer implements IChartDrawer{
    protected float minVal = Float.MAX_VALUE;
    protected float maxVal = Float.MIN_VALUE;

    protected ArrayList<Integer> limitLineAt = new ArrayList<>();
    protected ArrayList<Calendar> limitLineCalender = new ArrayList<>();
    protected Calendar nextLineAt = null;

    @Override
    public void draw(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException{

        initializeChart(chart);
        CombinedData data = generateData(chart, stockInfoObject, chartDataList);
        calculateAxis(chart, chartDataList, data);

        chart.setData(data);
        drawLimitLine(chart, stockInfoObject, chartDataList);
        calculateZoom(chart, data);

        chart.notifyDataSetChanged();
    }

    //region detail draw methods which may override by child class
    /**
     * Override the methods if you want to do something before draw chart.
     * @param chart
     */
    abstract void initializeChart(CombinedChart chart);

    /**
     * Override the methods to generate data for chart
     * @param chart
     * @param stockInfoObject
     * @param chartDataList
     */
    abstract CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException;

    /**
     * Override the methods to draw the start up gap line. If not, there'll be no start up gap line.
     * @param stockInfoObject
     * @param chartDataList
     * @throws JSONException
     */
    protected void drawStartUpGapLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException{ }

    /**
     * Override the methods to draw the start up gap line. If not, there'll be no start up gap line.
     * @param stockInfoObject
     * @throws JSONException
     */
    protected boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException{
        return false;
    }

    /**
     * Set limit line for x-Axis.
     * Override this method to set limit lines with your rules.
     * @param stockInfoObject
     * @param chartDataList
     * @throws JSONException
     */
    protected void getLimitLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException{
        limitLineAt = new ArrayList<>();
        limitLineCalender = new ArrayList<>();

        int firstLine = 0;
        limitLineAt.add(firstLine);
        limitLineCalender.add(ChartDrawerManager.timeStringToCalendar(chartDataList.getJSONObject(firstLine).getString("time")));

        for(int i = 0; i < chartDataList.length(); i ++) {
            Calendar calendar = ChartDrawerManager.timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));

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
            limitLineCalender.add(ChartDrawerManager.timeStringToCalendar(chartDataList.getJSONObject(lastLine).getString("time")));
        }
    }

    /**
     * Return true if the chart need to draw a horizontal pre-close line. Else false.
     * @return
     */
    protected boolean needDrawPreCloseLine() {
        return false;
    }

    /**
     * Return the gap line unit for the chart.
     * @return
     */
    protected int getGapLineUnit() {
        return Calendar.HOUR_OF_DAY;
    }

    /**
     * Returns the gap line unit add mount.
     * @return
     */
    protected int getGapLineUnitAddMount() {
        return 1;
    }

    /**
     * Returns the gap line text format. Override this if you want to customize for your chart.
     * @return
     */
    protected SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("HH:mm");
    }

    /**
     * Returns the labels count which should be skip on x axis. Override to define the skip labels count the chart needs.
     * @return
     */
    protected int getLablesToSkip(JSONArray chartDataList){
        return chartDataList.length();
    }

    /**
     * Zoom if necessary
     * @param chart
     * @param data
     */
    public void calculateZoom(CombinedChart chart, CombinedData data) {
        //Do nothing
    }
    //endregion


    /**
     * Draw the pre close gap line. This method won't be changed.
     * @param chart
     * @param stockInfoObject
     * @throws JSONException
     */
    protected void drawPreCloseLine(CombinedChart chart, JSONObject stockInfoObject) throws JSONException{
        LimitLine line = new LimitLine((float) stockInfoObject.getDouble("preClose"));
        line.setLineColor(ChartDrawerManager.CHART_LINE_COLOR);
        line.setLineWidth(ChartDrawerManager.LINE_WIDTH);
        line.enableDashedLine(10f, 10f, 0f);
        line.setTextSize(0f);

        chart.getAxisLeft().addLimitLine(line);
    }

    protected void calculateAxis(CombinedChart chart, JSONArray chartDataList, CombinedData data) {
        chart.getXAxis().setLabelsToSkip(getLablesToSkip(chartDataList));

        chart.getXAxis().setValueFormatter(new XAxisValueFormatter() {
            @Override
            public String getXValue(String original, int index, ViewPortHandler viewPortHandler) {
                return "";
            }
        });
        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
        chart.getAxisLeft().setAxisMinValue(minVal);
        chart.getAxisLeft().setAxisMaxValue(maxVal);
    }

    protected void drawLimitLine(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        if (needDrawPreCloseLine()){
            drawPreCloseLine(chart, stockInfoObject);
        }

        // Set the yAxis lines with 1 hour in between.
        int gapLineUnit = getGapLineUnit();
        int gapLineUnitAddMount = getGapLineUnitAddMount();

        nextLineAt = null;

        drawStartUpGapLine(stockInfoObject, chartDataList);


        if (chartDataList.length() > 0) {
            getLimitLine(stockInfoObject, chartDataList);

            boolean needSkipLabel = false;
            if (limitLineAt.size() > 10) {
                needSkipLabel = true;
            }

            SimpleDateFormat format = getGapLineFormat();

            for (int i = 0; i < limitLineAt.size(); i++) {
                int index = limitLineAt.get(i);
                Calendar calendar = limitLineCalender.get(i);

                LimitLine gapLine = new LimitLine(index);
                gapLine.setLineColor(ChartDrawerManager.CHART_LINE_COLOR);
                gapLine.setLineWidth(ChartDrawerManager.LINE_WIDTH);
                gapLine.enableDashedLine(10f, 0f, 0f);
                gapLine.setTextSize(8f);
                gapLine.setTextColor(ChartDrawerManager.CHART_TEXT_COLOR);
                if (needSkipLabel && i < limitLineAt.size() - 1 && i % 2 == 1) {
                    gapLine.setLabel("");
                } else {
                    gapLine.setLabel(format.format(calendar.getTime()));
                }
                gapLine.setLabelPosition(LimitLine.LimitLabelPosition.BELOW_BOTTOM);

                chart.getXAxis().addLimitLine(gapLine);
            }
        }
    }
}
