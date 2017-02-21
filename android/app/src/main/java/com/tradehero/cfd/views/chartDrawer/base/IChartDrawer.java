package com.tradehero.cfd.views.chartDrawer.base;

import com.github.mikephil.charting.charts.BarLineChartBase;
import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.CandleData;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.DataSet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;

/**
 * Created by Neko on 16/9/18.
 */
public interface IChartDrawer {
    void setBorderColor(int color);
    void setTextColor(int color);

    void draw(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException;
}
