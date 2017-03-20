package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;
import com.tradehero.cfd.views.chartDrawer.base.LineStickChartDrawer;
import com.tradehero.cfd.views.chartDrawer.base.LineStickPLChartDrawer;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class Stick2WeekYieldChartDrawer extends LineStickPLChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.DAY_OF_MONTH;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return false;
    }

    @Override
    public boolean needDrawDescription() {
        return false;
    }

    @Override
    protected int getDataSetColor() {
        return ChartDrawerConstants.CHART_DATA_SET_COLOR2;
    }
}

