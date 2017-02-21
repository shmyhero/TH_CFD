package com.tradehero.cfd.views.chartDrawer;

import com.tradehero.cfd.views.chartDrawer.base.ChartDrawerConstants;
import com.tradehero.cfd.views.chartDrawer.base.IChartDrawer;

/**
 * Created by Neko on 16/9/19.
 */
public class ChartDrawerBuilder {
    public static IChartDrawer createDrawer(ChartDrawerConstants.CHART_TYPE type){
        switch (type){
            case today:
                return new StickTodayChartDrawer();
            case tenM:
                return new Stick10MinuteChartDrawer();
            case twoH:
                return new Stick2HourChartDrawer();
            case week:
                return new StickWeekChartDrawer();
            case month:
                return new Stick1MonthChartDrawer();
            case day:
                return new Candle1DayChartDrawer();
            case fiveM:
                return new Candle5MinuteChartDrawer();
            case hour:
                return new Candle1HourChartDrawer();
            case oneM:
                return new Candle1MinuteChartDrawer();
            case fifteenM:
                return new Candle15MinuteChartDrawer();
            case threeMonth:
                return new Stick3MonthChartDrawer();
            case sixMonth:
                return new Stick6MonthChartDrawer();
            case todayK:
                return new CandleTodayChartDrawer();
            default:
                return null;
        }
    }
}
