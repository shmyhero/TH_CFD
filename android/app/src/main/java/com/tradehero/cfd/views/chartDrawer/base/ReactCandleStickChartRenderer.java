package com.tradehero.cfd.views.chartDrawer.base;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Region;

import com.github.mikephil.charting.animation.ChartAnimator;
import com.github.mikephil.charting.data.CandleEntry;
import com.github.mikephil.charting.interfaces.dataprovider.CandleDataProvider;
import com.github.mikephil.charting.interfaces.datasets.ICandleDataSet;
import com.github.mikephil.charting.renderer.CandleStickChartRenderer;
import com.github.mikephil.charting.utils.ColorTemplate;
import com.github.mikephil.charting.utils.Transformer;
import com.github.mikephil.charting.utils.ViewPortHandler;

/**
 * Created by Neko on 2017/2/22.
 */

public class ReactCandleStickChartRenderer extends CandleStickChartRenderer {
    public ReactCandleStickChartRenderer(CandleDataProvider chart, ChartAnimator animator,
                                         ViewPortHandler viewPortHandler) {
        super(chart, animator, viewPortHandler);
    }

    @Override
    public void drawData(Canvas c) {
        c.clipRect(mViewPortHandler.getContentRect());
        super.drawData(c);
        c.clipRect(new RectF(0,0,c.getWidth(),c.getHeight()), Region.Op.UNION);
    }

}
