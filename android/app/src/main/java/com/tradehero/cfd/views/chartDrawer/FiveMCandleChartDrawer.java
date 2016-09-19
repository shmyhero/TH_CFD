package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.CandleChartDrawer;
import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class FiveMCandleChartDrawer extends CandleChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return true;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.MINUTE;
    }

    @Override
    public int getGapLineUnitAddMount() {
        return 2;
    }

    @Override
    public int getLablesToSkip(JSONArray chartDataList) {
       return ChartDrawerManager.TEN_MINUTE_POINT_NUMBER;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return !stockInfoObject.getBoolean("isOpen");
    }

    public void getLimitLine(JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException{
            Calendar firstDate = ChartDrawerManager.timeStringToCalendar(chartDataList.getJSONObject(0).getString("time"));
            Calendar lastDate = ChartDrawerManager.timeStringToCalendar(chartDataList.getJSONObject(chartDataList.length() - 1).getString("time"));
            long distance = (lastDate.getTimeInMillis() - firstDate.getTimeInMillis()) / 1000;

            if (distance > ChartDrawerManager.TEN_MINUTE_POINT_NUMBER) {
                firstDate.add(Calendar.MILLISECOND, (int)(1000 * (distance - ChartDrawerManager.TEN_MINUTE_POINT_NUMBER)));
            }

            int firstLine = 0;
            limitLineAt.add(firstLine);
            limitLineCalender.add(firstDate);

            nextLineAt = (Calendar) firstDate.clone();
            nextLineAt.add(getGapLineUnit(), getGapLineUnitAddMount());

            for(int i = 0; i < chartDataList.length(); i ++) {
                Calendar calendar = ChartDrawerManager.timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));

                if (nextLineAt == null) {
                    calendar.add(getGapLineUnit(), getGapLineUnitAddMount());
                    nextLineAt = calendar;
                } else if (calendar.after(nextLineAt)) {

                    while(calendar.after(nextLineAt)) {
                        nextLineAt.add(getGapLineUnit(), getGapLineUnitAddMount());
                    }

                    long distToStart = (calendar.getTimeInMillis() - firstDate.getTimeInMillis()) / 1000;

                    limitLineAt.add((int)distToStart);
                    limitLineCalender.add(calendar);
                }
            }
    }
}
