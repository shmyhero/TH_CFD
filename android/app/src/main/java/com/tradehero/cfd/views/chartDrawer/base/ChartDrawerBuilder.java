package com.tradehero.cfd.views.chartDrawer.base;

import com.tradehero.cfd.views.chartDrawer.DayCandleChartDrawer;
import com.tradehero.cfd.views.chartDrawer.FiveMCandleChartDrawer;
import com.tradehero.cfd.views.chartDrawer.TenMChartDrawer;
import com.tradehero.cfd.views.chartDrawer.TodayChartDrawer;
import com.tradehero.cfd.views.chartDrawer.TwoHChartDrawer;
import com.tradehero.cfd.views.chartDrawer.WeekChartDrawer;

/**
 * Created by Neko on 16/9/19.
 */
public class ChartDrawerBuilder {
    public static IChartDrawer createDrawer(ChartDrawerConstants.CHART_TYPE type){
        switch (type){
            case today:
                return new TodayChartDrawer();
            case tenM:
                return new TenMChartDrawer();
            case twoH:
                return new TwoHChartDrawer();
            case week:
                return new WeekChartDrawer();
            case month:
                return new DayCandleChartDrawer();
            case fiveM:
                return new FiveMCandleChartDrawer();
            default:
                return null;
        }
    }
}
