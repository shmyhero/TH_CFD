package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.LineStickChartDrawer;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class StickTodayChartDrawer extends LineStickChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return true;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.HOUR_OF_DAY;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException{
        return true;
    }
}

