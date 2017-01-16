package com.tradehero.cfd.views.chartDrawer.base;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by Neko on 16/9/19.
 */
public class ChartDrawerConstants {
    public static int CHART_BORDER_COLOR = 0xff497bce;
    public static int CHART_LINE_COLOR = 0Xff759de2;
    public static int CHART_LINE_COLOR2 = 0Xff1d4fa2;
    public static int CHART_TEXT_COLOR = 0Xff70a5ff;

    public static int FIVE_MINUTE_POINT_NUMBER = 300;//30s*10
    public static int TEN_MINUTE_POINT_NUMBER = 600;//60s*10
    public static float LINE_WIDTH = 0.5f; //竖线 分割 ｜分时｜10分钟｜2小时｜5日｜1月｜
    public static float LINE_WIDTH_PRICE = 1.5f; //行情走势曲线线粗

    public static int CANDEL_NEUTRAL = 0xff30c296;//平绿
    public static int CANDEL_DECREASE = 0xff30c296;//跌绿
    public static int CANDEL_INCREASE = 0xffe34b4f;//涨红

    public enum CHART_TYPE {
        today("today"),
        tenM("10m"),
        twoH("2h"),
        week("week"),
        month("month"),
        day("day"),
        fiveM("5m");

        private String name;

        public String getName(){
            return name;
        }

        CHART_TYPE(String name) {
            this.name = name;
        }
    }
}
