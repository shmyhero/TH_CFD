package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.CandleChartDrawer;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class DayCandleChartDrawer extends CandleChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return true;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.WEEK_OF_MONTH;
    }

    @Override
    public SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("MM/dd");
    }

    @Override
    public Calendar getStartUpTimeLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException{
        Calendar nextLineAt = timeStringToCalendar(chartDataList.getJSONObject(0).getString("time"));

        nextLineAt.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        nextLineAt.set(Calendar.HOUR_OF_DAY, 8);
        nextLineAt.set(Calendar.MINUTE, 0);
        nextLineAt.set(Calendar.MILLISECOND, 0);

        nextLineAt.add(getGapLineUnit(), 1);
        return nextLineAt;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException{
        return true;
    }
}
