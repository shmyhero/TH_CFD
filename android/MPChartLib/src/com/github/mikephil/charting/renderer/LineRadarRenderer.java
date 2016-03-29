package com.github.mikephil.charting.renderer;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.drawable.Drawable;

import com.github.mikephil.charting.animation.ChartAnimator;
import com.github.mikephil.charting.utils.ViewPortHandler;

/**
 * Created by Philipp Jahoda on 25/01/16.
 */
public abstract class LineRadarRenderer extends LineScatterCandleRadarRenderer {

    public LineRadarRenderer(ChartAnimator animator, ViewPortHandler viewPortHandler) {
        super(animator, viewPortHandler);
    }

    /**
     * Draws the provided path in filled mode with the provided drawable.
     *
     * @param c
     * @param filledPath
     * @param drawable
     */
    protected void drawFilledPath(Canvas c, Path filledPath, Drawable drawable) {
        c.save();

        Bitmap tempBitmap = Bitmap.createBitmap((int)mViewPortHandler.getChartWidth(),
                (int)mViewPortHandler.getChartHeight(), Bitmap.Config.ARGB_8888);
        Canvas tempCanvas = new Canvas(tempBitmap);

        tempCanvas.clipPath(filledPath);
        drawable.setBounds((int) mViewPortHandler.contentLeft(),
                (int) mViewPortHandler.contentTop(),
                (int) mViewPortHandler.contentRight(),
                (int) mViewPortHandler.contentBottom());
        drawable.draw(tempCanvas);

        c.drawBitmap(tempBitmap, 0, 0, new Paint());

        c.restore();
    }

    /**
     * Draws the provided path in filled mode with the provided color and alpha.
     * Special thanks to Angelo Suzuki (https://github.com/tinsukE) for this.
     *
     * @param c
     * @param filledPath
     * @param fillColor
     * @param fillAlpha
     */
    protected void drawFilledPath(Canvas c, Path filledPath, int fillColor, int fillAlpha) {
        c.save();
        c.clipPath(filledPath);

        int color = (fillAlpha << 24) | (fillColor & 0xffffff);
        c.drawColor(color);
        c.restore();
    }
}