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
public class Candle5MinuteChartDrawer extends CandleChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.HOUR;
    }

    @Override
    public int getLabelsToSkip() {
       return 1;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return !stockInfoObject.getBoolean("isOpen");
    }

    @Override
    public int getGapLineUnitAddMount() {
        return 1;
    }
}
