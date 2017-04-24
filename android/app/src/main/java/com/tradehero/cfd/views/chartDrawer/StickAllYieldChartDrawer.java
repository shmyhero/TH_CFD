package com.tradehero.cfd.views.chartDrawer;

import android.graphics.Color;

import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;
import com.tradehero.cfd.views.chartDrawer.base.LineStickPLChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by Neko on 16/9/19.
 */
public class StickAllYieldChartDrawer extends LineStickPLChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.DAY_OF_MONTH;
    }

    @Override
    public int getGapLineUnitAddMount(int dataSize){
        return dataSize / 5;
    }

    @Override
    public int getMaxLimitLineCount(){
        return 5;
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
    protected String formatXAxisLabelText(Date date) {
        return new SimpleDateFormat("yy-MM-dd").format(date);
    }

    public int getGapLineColor() {
        return Color.TRANSPARENT;
    }

    @Override
    protected int getDataSetColor() {
        return ChartDrawerConstants.CHART_DATA_SET_COLOR2;
    }
}

