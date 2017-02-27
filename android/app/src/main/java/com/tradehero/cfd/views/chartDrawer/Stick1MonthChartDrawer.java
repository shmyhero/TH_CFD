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
public class Stick1MonthChartDrawer extends LineStickChartDrawer{
    @Override
    public int getGapLineUnit() {
        return Calendar.DAY_OF_MONTH;
    }

    @Override
    protected int getGapLineUnitAddMount() {
        return 7;   //1 week.
    }

    @Override
    public int getLabelsToSkip() {
        return 0;
    }

    @Override
    public SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("M/d");
    }

    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

//    @Override
//    public Calendar getStartUpTimeLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
//        Calendar lastOpen = timeStringToCalendar(stockInfoObject.getString("lastOpen"));
//        Calendar firstDataDate = timeStringToCalendar(chartDataList.getJSONObject(0).getString("time"));
//        Calendar nextLineAt = (Calendar) firstDataDate.clone();
//        nextLineAt.set(Calendar.HOUR_OF_DAY, lastOpen.get(Calendar.HOUR_OF_DAY));
//        nextLineAt.set(Calendar.MINUTE, lastOpen.get(Calendar.MINUTE));
//        nextLineAt.set(Calendar.MILLISECOND, lastOpen.get(Calendar.MILLISECOND));
//
//        nextLineAt.add(getGapLineUnit(), 1);
//        return nextLineAt;
//    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return !stockInfoObject.getBoolean("isOpen");
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
            if (lastCalendar != null) {
                int days = (int) (calendar.getTime().getTime() - lastCalendar.getTime().getTime()) / (1000 * 60 * 60 * 24);
                if(days < 7){
                    continue;
                }
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
