package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Color;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.formatter.XAxisValueFormatter;
import com.github.mikephil.charting.formatter.YAxisValueFormatter;
import com.github.mikephil.charting.utils.Utils;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.views.ReactChart;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class BaseChartDrawer implements IChartDrawer {
    protected float minVal = Float.MAX_VALUE;
    protected float maxVal = Float.MIN_VALUE;
    protected JSONArray mChartDataList;
    protected float preClose;

    protected int borderColor = 0;
    protected int preCloseColor = 0;
    protected int textColor = 0;
    protected int gapLineColor = 0;

    @Override
    public void setBorderColor(int color) {
        borderColor = color;
    }

    @Override
    public void setPreCloseColor(int color) {
        preCloseColor = color;
    }

    @Override
    public void setTextColor(int color) {
        textColor = color;
    }

    public int getGapLineColor(){
       return borderColor;
    }

    @Override
    public void draw(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {

        if (chartDataList == null || chartDataList.length() == 0) {
            return;
        }

        if(!isDataAcceptable(chartDataList)){
            return;
        }

        minVal = Float.MAX_VALUE;
        maxVal = Float.MIN_VALUE;

        formatRightAxisText(chart, maxVal, minVal);

        try{
            preClose = (float) stockInfoObject.getDouble("preClose");
        }catch (Exception e){

        }

        resetChart(chart);

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
     *
     * @param chart
     */
    protected void resetChart(CombinedChart chart) {
        chart.clear();
        chart.getXAxis().removeAllLimitLines();
        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
        chart.resetTracking();
        chart.fitScreen();
        if (chart.getScaleX() != 1 && chart.getScaleX() > 0) {
            chart.zoom(1 / chart.getScaleX(), 1, 0, 0);
        }
    }

    /**
     * Override the methods to check data is acceptable
     *
     * @param chartDataList
     */
    abstract boolean isDataAcceptable(JSONArray chartDataList);

    /**
     * Override the methods to generate data for chart
     *
     * @param chart
     * @param stockInfoObject
     * @param chartDataList
     */
    abstract CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException;

    /**
     * Returns the calender indicates the first gap line. Returns null so that the base drawer will calculate the line by its rule.
     *
     * @param stockInfoObject
     * @param chartDataList
     * @throws JSONException
     */
    protected Calendar getStartUpTimeLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        return null;
    }

    /**
     * Override the methods to draw the start up gap line. If not, there'll be no start up gap line.
     *
     * @param stockInfoObject
     * @throws JSONException
     */
    protected boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return false;
    }

    public class LimitLineInfo {
        public ArrayList<Integer> limitLineAt;
        public ArrayList<Calendar> limitLineCalender;
    }

    /**
     * Set limit line for x-Axis.
     * Override this method to set limit lines with your rules.
     *
     * @param stockInfoObject
     * @param chartDataList
     * @throws JSONException
     */
    protected LimitLineInfo calculateLimitLinesPosition(Calendar startUpLine, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<Integer> limitLineAt = new ArrayList<>();
        ArrayList<Calendar> limitLineCalender = new ArrayList<>();

        Calendar nextLineAt = startUpLine;

        int firstLine = 0;
        limitLineAt.add(firstLine);
        limitLineCalender.add(timeStringToCalendar(chartDataList.getJSONObject(firstLine).getString("time")));

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

    protected void formatRightAxisText(CombinedChart chart, final float maxVal, final float minVal){

        chart.getAxisRight().setValueFormatter(new YAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, YAxis yAxis) {
                float offset = Math.abs(maxVal - minVal);
                if(offset > 1){
                    return String.format("%.1f", value);
                }else{
                    String text = Double.toString(offset);
                    int integerPlaces = text.indexOf('.');
                    String afterDecimal = text.substring(integerPlaces+1);
                    String[] decimals = afterDecimal.split("0");
                    int noneZeroIndex = 0;
                    for(int i = 0; i < decimals.length; i++){
                       if(!decimals[i].equals("")) {
                           noneZeroIndex = i + 1;
                           break;
                       }
                    }

                    noneZeroIndex += 1;
                    return String.format("%." + noneZeroIndex + "f", value);
                }
            }
        });
    }

    /**
     * Return true if the chart need to draw a horizontal pre-close line. Else false.
     *
     * @return
     */
    protected boolean needDrawPreCloseLine() {
        return false;
    }

    /**
     * Return the gap line unit for the chart. Default is hour.
     *
     * @return
     */
    protected int getGapLineUnit() {
        return Calendar.HOUR_OF_DAY;
    }

    /**
     * Returns the count of the gap line which will be skip. Default is 1.
     *
     * @return
     */
    protected int getGapLineUnitAddMount() {
        return 1;
    }

    /**
     * Returns the gap line text format. Override this if you want to customize for your chart.
     *
     * @return
     */
    protected SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("HH:mm");
    }

    /**
     * Returns the labels count which should be skip on x axis. Override to define the skip labels count the chart needs.
     *
     * @return
     */
    protected int getLabelsToSkip() {
        return 1;
    }

    /**
     * Zoom if necessary
     *
     * @param chart
     * @param data
     */
    protected void calculateZoom(CombinedChart chart, CombinedData data) {
        //Do nothing
    }
    //endregion


    /**
     * Draw the pre close gap line. This method won't be changed.
     *
     * @param chart
     * @param stockInfoObject
     * @throws JSONException
     */
    private void drawPreCloseLine(CombinedChart chart, JSONObject stockInfoObject) throws JSONException {
        LimitLine line = new LimitLine((float) stockInfoObject.getDouble("preClose"));
//      line.setLineColor(ChartDrawerConstants.CHART_LINE_COLOR);
        line.setLineColor(preCloseColor);
//        line.setLineColor(mDesColorType==0?ChartDrawerConstants.CHART_LINE_COLOR:ChartDrawerConstants.CHART_LINE_COLOR2);

        line.setLineWidth(ChartDrawerConstants.LINE_WIDTH * 2);
        line.enableDashedLine(10f, 10f, 0f);
        line.setTextSize(0f);

        chart.getAxisLeft().addLimitLine(line);
    }

    private void calculateAxis(CombinedChart chart, JSONArray chartDataList, CombinedData data) {
        chart.getXAxis().setLabelsToSkip(getLabelsToSkip());

        chart.getXAxis().setValueFormatter(new XAxisValueFormatter() {
            @Override
            public String getXValue(String original, int index, ViewPortHandler viewPortHandler) {
                return "";// getGapLineFormat().format(new Date(original));
            }
        });
        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
//        chart.getAxisLeft().setAxisMinValue(minVal);
//        chart.getAxisLeft().setAxisMaxValue(maxVal);
    }

    protected interface OnLimitLinesPositionCalculatedHandler {
        void OnLimitLinesPositionCalculated();
    }

    protected void drawLimitLine(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        if (needDrawPreCloseLine()) {
            drawPreCloseLine(chart, stockInfoObject);
        }

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

    protected String formatXAxisLabelText(Date date){
        SimpleDateFormat format = getGapLineFormat();
        return format.format(date);
    }

    public boolean isNeedHide(int index,int count){
        int skipStep = getLabelsToSkip() + 1;

        if(skipStep == 2) {

            if (count % 2 == 0) {//偶数
                if (index == 0 || index == (count - 1) || index % 2 == 1) {
                    return false;
                }
            } else {//奇数
                if (index == 0 || index == (count - 1) || index % 2 == 0) {
                    return false;
                }
            }
        }else{
            if (index == 0 || index == (count - 1) || (count - index) % skipStep == 1) {
                return false;
            }
        }
        return true;
    }

    public String getLableBlank() {
        return "";
    }

    public Calendar timeStringToCalendar(String timeStr) {
        Calendar calendar = GregorianCalendar.getInstance();
        String s = timeStr.replace("Z", "+00:00");
        try {
            int lastColonPos = s.lastIndexOf(":");
            s = s.substring(0, lastColonPos) + s.substring(lastColonPos + 1);
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

            if (s.indexOf(".") > 0) {
                format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
            }

            Date date = format.parse(s);
            calendar.setTime(date);

        } catch (IndexOutOfBoundsException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return calendar;
    }

    //设置 左上左下右上右下 文本描述
    public void setDescription(CombinedChart chart, String lt, String lb, String rt, String rb) {
        if(MainActivity.isLandscape()){
            chart.setDescription("", "", "", "");
        }else{
            chart.setDescription(lt, lb, rt, rb);
        }
    }
}
