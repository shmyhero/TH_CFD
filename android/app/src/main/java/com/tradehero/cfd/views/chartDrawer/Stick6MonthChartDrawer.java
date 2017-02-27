package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.LineStickChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class Stick6MonthChartDrawer extends LineStickChartDrawer{
    @Override
    protected int getLabelsToSkip() {
        return 0;
    }

    @Override
    public SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("M月");
    }

    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    protected LimitLineInfo calculateLimitLinesPosition(Calendar startUpLine, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        ArrayList<Integer> limitLineAt = new ArrayList<>();
        ArrayList<Calendar> limitLineCalender = new ArrayList<>();

        //Only return the hour.
        Calendar lastCalendar = null;
        for(int i = 0; i < chartDataList.length(); i ++) {
            //TODO: use "time" if api returns it instead of Uppercase one.
            Calendar calendar = timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));
            if (lastCalendar != null && lastCalendar.getTime().getMonth() == calendar.getTime().getMonth()) {
                continue;
            }
            if (lastCalendar != null && lastCalendar.getTime().getDay() == calendar.getTime().getDay()) {
                continue;
            }
            limitLineAt.add(i);
            limitLineCalender.add(calendar);
            lastCalendar = calendar;
        }

        LimitLineInfo limitLineInfo = new LimitLineInfo();
        limitLineInfo.limitLineAt = limitLineAt;
        limitLineInfo.limitLineCalender = limitLineCalender;
        return limitLineInfo;
    }
}