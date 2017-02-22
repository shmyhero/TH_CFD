package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.LineStickChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class Stick3MonthChartDrawer extends LineStickChartDrawer{
    @Override
    public int getGapLineUnit() {
        return Calendar.DAY_OF_MONTH;
    }

    @Override
    public SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("MM/dd");
    }

    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    public Calendar getStartUpTimeLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        Calendar lastOpen = timeStringToCalendar(stockInfoObject.getString("lastOpen"));
        Calendar firstDataDate = timeStringToCalendar(chartDataList.getJSONObject(0).getString("time"));
        Calendar nextLineAt = (Calendar) firstDataDate.clone();
        nextLineAt.set(Calendar.HOUR_OF_DAY, lastOpen.get(Calendar.HOUR_OF_DAY));
        nextLineAt.set(Calendar.MINUTE, lastOpen.get(Calendar.MINUTE));
        nextLineAt.set(Calendar.MILLISECOND, lastOpen.get(Calendar.MILLISECOND));

        nextLineAt.add(getGapLineUnit(), 1);
        return nextLineAt;
    }

    @Override
    protected boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return true;
    }
}
