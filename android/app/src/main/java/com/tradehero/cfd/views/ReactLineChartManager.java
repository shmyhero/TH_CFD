package com.tradehero.cfd.views;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.tradehero.cfd.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactLineChartManager extends SimpleViewManager<ReactLineChart> {

    private static final String REACT_CLASS = "LineChart";
    private static int CHART_BORDER_COLOR = 0xff497bce;
    private static int CHART_LINE_COLOR = 0Xff759de2;

    @Override
    protected ReactLineChart createViewInstance(ThemedReactContext reactContext) {
        ReactLineChart chart = new ReactLineChart(reactContext);

        chart.setDrawGridBackground(false);
        chart.setDragEnabled(false);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(false);
        chart.getLegend().setEnabled(false);
        chart.setExtraLeftOffset(8);
        chart.setExtraRightOffset(8);

        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
        chart.getXAxis().removeAllLimitLines();
        chart.getAxisLeft().setDrawLimitLinesBehindData(false);
        chart.getAxisRight().setDrawLimitLinesBehindData(false);
        chart.getXAxis().setDrawLimitLinesBehindData(false);
        chart.getAxisLeft().setDrawGridLines(false);
        chart.getAxisRight().setDrawGridLines(false);
        chart.getXAxis().setDrawGridLines(false);
        chart.getAxisLeft().setAxisLineColor(CHART_BORDER_COLOR);
        chart.getAxisRight().setAxisLineColor(CHART_BORDER_COLOR);
        chart.getXAxis().setAxisLineColor(CHART_BORDER_COLOR);
        chart.getAxisLeft().setSpaceTop(20);
        chart.getAxisLeft().setSpaceBottom(20);
        chart.getAxisRight().setSpaceTop(20);
        chart.getAxisRight().setSpaceBottom(20);

        return chart;
    }

    @ReactProp(name = "data")
    public void setData(ReactLineChart chart, String stockInfoData) {
        if (chart != null && stockInfoData != null && stockInfoData.length() > 0) {

            try {
                JSONObject stockInfoObject = new JSONObject(stockInfoData);
                if (!stockInfoObject.has("priceData")) {
                    return;
                }

                JSONArray chartDataList = stockInfoObject.getJSONArray("priceData");

                ArrayList<String> xVals = new ArrayList<String>();
                for (int i = 0; i < chartDataList.length(); i++) {
                    xVals.add((i) + "");
                }

                ArrayList<Entry> yVals = new ArrayList<Entry>();
                float minVal = Float.MAX_VALUE;
                float maxVal = Float.MIN_VALUE;

                for (int i = 0; i < chartDataList.length(); i++) {
                    float val = (float) (chartDataList.getJSONObject(i).getDouble("p"));
                    if (val > maxVal) {
                        maxVal = val;
                    }
                    if (val < minVal) {
                        minVal = val;
                    }
                    yVals.add(new Entry(val, i));
                }
                minVal = Math.min(minVal, (float)stockInfoObject.getDouble("preClose"));
                maxVal = Math.max(maxVal, (float) stockInfoObject.getDouble("preClose"));
                minVal -= (maxVal - minVal) / 5;
                maxVal += (maxVal - minVal) / 5;

                int[] circleColors = {Color.TRANSPARENT};
                if (chartDataList.length() > 0 && stockInfoObject.getBoolean("isOpen")) {
                    circleColors = new int[chartDataList.length()];
                    for (int i = 0; i < chartDataList.length(); i++) {
                        circleColors[i] = Color.TRANSPARENT;
                    }
                    circleColors[circleColors.length - 1] = Color.WHITE;
                }

                // create a dataset and give it a type
                LineDataSet set1 = new LineDataSet(yVals, "DataSet 1");
                // set1.setFillAlpha(110);
                // set1.setFillColor(Color.RED);

                // set the line to be drawn like this "- - - - - -"
                set1.enableDashedLine(10f, 0f, 0f);
                set1.setColor(Color.WHITE);
                set1.setLineWidth(1f);
                set1.setDrawCircles(true);
                set1.setDrawCircleHole(false);
                set1.setCircleColors(circleColors);
                set1.setValueTextSize(0f);
                Drawable drawable = ContextCompat.getDrawable(chart.getContext(), R.drawable.stock_price_fill_color);
                set1.setFillDrawable(drawable);
                set1.setDrawFilled(true);

                ArrayList<ILineDataSet> dataSets = new ArrayList<ILineDataSet>();
                dataSets.add(set1); // add the datasets

                // create a data object with the datasets
                LineData data = new LineData(xVals, dataSets);

                // set data
                chart.clear();
                chart.getXAxis().removeAllLimitLines();
                chart.getAxisLeft().removeAllLimitLines();
                chart.getAxisRight().removeAllLimitLines();
                chart.getAxisLeft().setAxisMinValue(minVal);
                chart.getAxisLeft().setAxisMaxValue(maxVal);
                chart.setData(data);

                // Set the xAxis with the prev close price line
                LimitLine line = new LimitLine((float) stockInfoObject.getDouble("preClose"));
                line.setLineColor(CHART_LINE_COLOR);
                line.setLineWidth(0.5f);
                line.enableDashedLine(10f, 0f, 0f);
                line.setTextSize(0f);

                chart.getAxisLeft().addLimitLine(line);

                // Set the yAxis lines with 1 hour in between.
                Calendar nextLineAt = null;
                for (int i = 0; i < chartDataList.length(); i++) {
                    Calendar calendar = timeStringToCalendar(chartDataList.getJSONObject(i).getString("time"));

                    if (nextLineAt == null) {
                        calendar.add(Calendar.HOUR_OF_DAY, 1);
                        nextLineAt = calendar;
                    } else if (calendar.after(nextLineAt)) {
                        calendar.add(Calendar.HOUR_OF_DAY, 1);
                        nextLineAt = calendar;

                        LimitLine hourLine = new LimitLine(i);
                        hourLine.setLineColor(CHART_LINE_COLOR);
                        hourLine.setLineWidth(0.5f);
                        hourLine.enableDashedLine(10f, 0f, 0f);
                        hourLine.setTextSize(0f);

                        chart.getXAxis().addLimitLine(hourLine);
                    }
                }

                chart.invalidate();

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @ReactProp(name = "colorType")
    public void setColorType(ReactLineChart chart, int type) {
        if (type == 1) {
            CHART_BORDER_COLOR = Color.WHITE;
            CHART_LINE_COLOR = Color.WHITE;
        }
    }

    @ReactProp(name = "description")
    public void setDescription(ReactLineChart chart, String description) {
        if (chart != null) {
            chart.setDescription(description);
        }
    }

    @ReactProp(name = "noDataText")
    public void setNoDataText(ReactLineChart chart, String text) {
        if (chart != null) {
            chart.setNoDataText(text);
        }
    }

    @ReactProp(name = "noDataTextDescription")
    public void setNoDataTextDescription(ReactLineChart chart, String description) {
        if (chart != null) {
            if (description != null) {
                chart.setNoDataTextDescription(description);
            }
        }
    }

    @ReactProp(name = "padding", defaultFloat = 0.0f)
    public void setPadding(ReactLineChart chart, float padding) {
        if (chart != null) {
            chart.setMinOffset(padding);
        }
    }

    @ReactProp(name = "xAxisPosition")
    public void setXAxisPosition(ReactLineChart chart, String position) {
        if (chart != null) {
            chart.getXAxis().setPosition(XAxis.XAxisPosition.valueOf(position));
        }
    }

    @ReactProp(name = "xAxisStep", defaultInt = 1)
    public void setXAxisStep(ReactLineChart chart, int step) {
        if (chart != null) {
            chart.getXAxis().setLabelsToSkip(step - 1);
        }
    }

    @ReactProp(name = "xAxisTextSize", defaultFloat = 10.0f)
    public void setXAxisTextSize(ReactLineChart chart, float size) {
        if (chart != null) {
            chart.getXAxis().setTextSize(size);
        }
    }

    @ReactProp(name = "xAxisDrawLabel")
    public void setXAxisDrawLabel(ReactLineChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getXAxis().setDrawLabels(drawEnabled);
        }
    }

    @ReactProp(name = "leftAxisEnabled", defaultBoolean = true)
    public void setLeftAxisEnabled(ReactLineChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisLeft().setEnabled(enabled);
        }
    }

    @ReactProp(name = "leftAxisMaxValue")
    public void setLeftAxisMaxValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisLeft().setAxisMaxValue(value);
        }
    }

    @ReactProp(name = "leftAxisMinValue")
    public void setLeftAxisMinValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisLeft().setAxisMinValue(value);
        }
    }

    @ReactProp(name = "leftAxisPosition")
    public void setLeftAxisPosition(ReactLineChart chart, String position) {
        if (chart != null) {
            chart.getAxisLeft().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
        }
    }

    @ReactProp(name = "leftAxisLabelCount")
    public void setLeftAxisLabelCount(ReactLineChart chart, int num) {
        if (chart != null) {
            chart.getAxisLeft().setLabelCount(num, true);
        }
    }

    @ReactProp(name = "leftAxisTextSize", defaultFloat = 10.0f)
    public void setLeftAxisTextSize(ReactLineChart chart, float size) {
        if (chart != null) {
            chart.getAxisLeft().setTextSize(size);
        }
    }

    @ReactProp(name = "leftAxisDrawLabel")
    public void setLeftAxisDrawLabel(ReactLineChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getAxisLeft().setDrawLabels(drawEnabled);
        }
    }

    @ReactProp(name = "leftAxisLimitLines")
    public void setLeftAxisLimitLines(ReactLineChart chart, ReadableArray lines) {
        if (chart != null) {
            for (int i = 0; i < lines.size(); i ++) {
                LimitLine line = new LimitLine(lines.getInt(i));
                line.setLineColor(Color.GRAY);
                line.setLineWidth(0.5f);
                line.enableDashedLine(10f, 0f, 0f);
                line.setTextSize(0f);

                chart.getAxisLeft().addLimitLine(line);
            }
        }
    }

    @ReactProp(name = "rightAxisEnabled", defaultBoolean = true)
    public void setRightAxisEnabled(ReactLineChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisRight().setEnabled(enabled);
        }
    }

    @ReactProp(name = "rightAxisMaxValue")
    public void setRightAxisMaxValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisRight().setAxisMaxValue(value);
        }
    }

    @ReactProp(name = "rightAxisMinValue")
    public void setRightAxisMinValue(ReactLineChart chart, float value) {
        if (chart != null) {
            chart.getAxisRight().setAxisMinValue(value);
        }
    }

    @ReactProp(name = "rightAxisPosition")
    public void setRightAxisPosition(ReactLineChart chart, String position) {
        if (chart != null) {
            chart.getAxisRight().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
        }
    }

    @ReactProp(name = "rightAxisLabelCount")
    public void setRightAxisLabelCount(ReactLineChart chart, int num) {
        if (chart != null) {
            chart.getAxisRight().setLabelCount(num, true);
        }
    }

    @ReactProp(name = "rightAxisTextSize", defaultFloat = 10.0f)
    public void setRightAxisTextSize(ReactLineChart chart, float size) {
        if (chart != null) {
            chart.getAxisRight().setTextSize(size);
        }
    }

    @ReactProp(name = "rightAxisDrawLabel")
    public void setRightAxisDrawLabel(ReactLineChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getAxisRight().setDrawLabels(drawEnabled);
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    private Calendar timeStringToCalendar(String timeStr) {
        Calendar calendar = GregorianCalendar.getInstance();
        String s = timeStr.replace("Z", "+00:00");
        try {
            s = s.substring(0, 22) + s.substring(23);  // to get rid of the ":"
            Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").parse(s);
            calendar.setTime(date);

        } catch (IndexOutOfBoundsException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return calendar;
    }
}
