package com.tradehero.cfd.views.chartDrawer;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.tradehero.cfd.R;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;
import com.tradehero.cfd.views.chartDrawer.base.LineStickChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class TenMChartDrawer extends LineStickChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return true;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.MINUTE;
    }

    @Override
    public int getGapLineUnitAddMount() {
        return 2;
    }

    @Override
    public int getLablesToSkip(JSONArray chartDataList) {
        return ChartDrawerConstants.TEN_MINUTE_POINT_NUMBER;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return !stockInfoObject.getBoolean("isOpen");
    }

    @Override
    protected LimitLineInfo calculateLimitLinesPosition(Calendar startUpLine, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<Integer> limitLineAt = new ArrayList<>();
        ArrayList<Calendar> limitLineCalender = new ArrayList<>();

        Calendar firstDate = timeStringToCalendar(chartDataList.getJSONObject(0).getString("time"));
        Calendar lastDate = timeStringToCalendar(chartDataList.getJSONObject(chartDataList.length() - 1).getString("time"));
        long distance = (lastDate.getTimeInMillis() - firstDate.getTimeInMillis()) / 1000;

        if (distance > ChartDrawerConstants.TEN_MINUTE_POINT_NUMBER) {
            firstDate.add(Calendar.MILLISECOND, (int)(1000 * (distance - ChartDrawerConstants.TEN_MINUTE_POINT_NUMBER)));
        }

        int firstLine = 0;
        limitLineAt.add(firstLine);
        limitLineCalender.add(firstDate);

        Calendar nextLineAt = (Calendar) firstDate.clone();
        nextLineAt.add(getGapLineUnit(), getGapLineUnitAddMount());

        for(int i = 0; i < chartDataList.length(); i ++) {
            Calendar calendar = timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));

            if (nextLineAt == null) {
                calendar.add(getGapLineUnit(), getGapLineUnitAddMount());
                nextLineAt = calendar;
            } else if (calendar.after(nextLineAt)) {

                while(calendar.after(nextLineAt)) {
                    nextLineAt.add(getGapLineUnit(), getGapLineUnitAddMount());
                }

                long distToStart = (calendar.getTimeInMillis() - firstDate.getTimeInMillis()) / 1000;

                limitLineAt.add((int)distToStart);
                limitLineCalender.add(calendar);
            }
        }

        LimitLineInfo limitLineInfo = new LimitLineInfo();
        limitLineInfo.limitLineAt = limitLineAt;
        limitLineInfo.limitLineCalender = limitLineCalender;
        return limitLineInfo;
    }

    @Override
    public CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<String> xVals = new ArrayList<String>();
        ArrayList<Entry> yVals = new ArrayList<Entry>();

        Calendar firstDate = timeStringToCalendar(chartDataList.getJSONObject(0).getString("time"));
        Calendar lastDate = timeStringToCalendar(chartDataList.getJSONObject(chartDataList.length() - 1).getString("time"));
        long distance = (lastDate.getTimeInMillis() - firstDate.getTimeInMillis()) / 1000;

        if (distance > ChartDrawerConstants.TEN_MINUTE_POINT_NUMBER) {
            firstDate.add(Calendar.MILLISECOND, (int)(1000 * (distance - ChartDrawerConstants.TEN_MINUTE_POINT_NUMBER)));
            distance = ChartDrawerConstants.TEN_MINUTE_POINT_NUMBER;
        }

        for (int i = 0; i <= distance + 1; i ++) {
            xVals.add((i) + "");
        }

        for (int i = 0; i < chartDataList.length(); i++) {
            Calendar date = timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));

            long distToStart = (date.getTimeInMillis() - firstDate.getTimeInMillis()) / 1000;

            if (distToStart >= 0) {

                float val = (float) (chartDataList.getJSONObject(i).getDouble("p"));
                if (val > maxVal) {
                    maxVal = val;
                }
                if (val < minVal) {
                    minVal = val;
                }

                if (yVals.size() == 0) {
                    yVals.add(new Entry(val, 0));
                } else {
                    yVals.add(new Entry(val, (int)distToStart));
                }
            }
        }

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
        set1.setLineWidth(ChartDrawerConstants.LINE_WIDTH_PRICE);
        set1.setDrawCircles(true);
        set1.setDrawCircleHole(false);
        set1.setCircleColors(circleColors);
        set1.setValueTextSize(0f);
        Drawable drawable = ContextCompat.getDrawable(chart.getContext(), R.drawable.stock_price_fill_color);
        set1.setFillDrawable(drawable);
        set1.setDrawFilled(true);

        LineData d = new LineData();
        d.addDataSet(set1);

        CombinedData data = new CombinedData(xVals);
        data.setData(d);
        return data;
        //LineData data = new LineData(xVals, dataSets);
    }
}
