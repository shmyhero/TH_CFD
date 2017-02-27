package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;

import com.github.mikephil.charting.animation.ChartAnimator;
import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.renderer.BarChartRenderer;
import com.github.mikephil.charting.renderer.BubbleChartRenderer;
import com.github.mikephil.charting.renderer.CandleStickChartRenderer;
import com.github.mikephil.charting.renderer.CombinedChartRenderer;
import com.github.mikephil.charting.renderer.DataRenderer;
import com.github.mikephil.charting.renderer.LineChartRenderer;
import com.github.mikephil.charting.renderer.ScatterChartRenderer;
import com.github.mikephil.charting.utils.ViewPortHandler;

import java.util.ArrayList;

/**
 * Created by Neko on 2017/2/22.
 */

public class ReactCombinedChartRenderer
        extends CombinedChartRenderer {
    public ReactCombinedChartRenderer(CombinedChart chart, ChartAnimator animator, ViewPortHandler viewPortHandler) {
        super(chart, animator, viewPortHandler);
    }

    @Override
    protected void createRenderers(CombinedChart chart, ChartAnimator animator, ViewPortHandler viewPortHandler) {

        mRenderers = new ArrayList<DataRenderer>();

        CombinedChart.DrawOrder[] orders = chart.getDrawOrder();

        for (CombinedChart.DrawOrder order : orders) {

            switch (order) {
                case BAR:
                    if (chart.getBarData() != null)
                        mRenderers.add(new BarChartRenderer(chart, animator, viewPortHandler));
                    break;
                case BUBBLE:
                    if (chart.getBubbleData() != null)
                        mRenderers.add(new BubbleChartRenderer(chart, animator, viewPortHandler));
                    break;
                case LINE:
                    if (chart.getLineData() != null)
                        mRenderers.add(new LineChartRenderer(chart, animator, viewPortHandler));
                    break;
                case CANDLE:
                    if (chart.getCandleData() != null)
                        //Modified!
                        mRenderers.add(new ReactCandleStickChartRenderer(chart, animator, viewPortHandler));
                    break;
                case SCATTER:
                    if (chart.getScatterData() != null)
                        mRenderers.add(new ScatterChartRenderer(chart, animator, viewPortHandler));
                    break;
            }
        }
    }

    //    @Override
//    public void drawData(Canvas c) {
//        RectF rect = new RectF(mViewPortHandler.getContentRect().left, 0, mViewPortHandler.getContentRect().right, c.getHeight());
//        c.clipRect(rect);
//        //c.clipRect(mViewPortHandler.getContentRect());
//        super.drawData(c);
//        c.clipRect(new RectF(0,0,c.getWidth(),c.getHeight()));
//    }
}
