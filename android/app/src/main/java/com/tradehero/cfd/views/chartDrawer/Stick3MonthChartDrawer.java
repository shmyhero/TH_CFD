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
    protected int getGapLineUnitAddMount() {
        return 14; //2 weeks
    }

    @Override
    public SimpleDateFormat getGapLineFormat() {
        return new SimpleDateFormat("M/d");
    }

    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    protected boolean needDrawEndLabel(JSONObject stockInfoObject) throws JSONException {
        return false;
    }
}
