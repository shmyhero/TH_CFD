package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.CandleChartDrawer;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class Candle1HourChartDrawer extends CandleChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.HOUR;
    }

    @Override
    public boolean needDrawEndLabel(JSONObject stockInfoObject) throws JSONException {
        return true;
    }

    @Override
    public int getGapLineUnitAddMount() {
        return 3;
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
            if (calendar.getTime().getMinutes() == 0){
                limitLineAt.add(i);
                limitLineCalender.add(calendar);
            }
        }

        LimitLineInfo limitLineInfo = new LimitLineInfo();
        limitLineInfo.limitLineAt = limitLineAt;
        limitLineInfo.limitLineCalender = limitLineCalender;
        return limitLineInfo;
    }
}
