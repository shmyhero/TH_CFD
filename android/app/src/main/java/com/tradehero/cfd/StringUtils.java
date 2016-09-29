package com.tradehero.cfd;

import java.text.DecimalFormat;

/**
 * Created by windy on 16/9/28.
 */

public class StringUtils {

    public static String formatNumber(float price) {
        DecimalFormat decimalFormat = new DecimalFormat("0.00");//构造方法的字符格式这里如果小数不足2位,会以0补足.
        String p = decimalFormat.format(price);//format 返回的是字符串
        return p;
    }

}
