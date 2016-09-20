package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.LineStickChartDrawer;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class TwoHChartDrawer extends LineStickChartDrawer {
    @Override
    public int getGapLineUnit() {
        return Calendar.MINUTE;
    }

    @Override
    public int getGapLineUnitAddMount() {
        return 30;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException{
        return true;
    }
}
