package com.tradehero.cfd.module;

import com.tradehero.cfd.views.ReactStockEditFragmentNative;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LogicData {

    public static final String MY_LIST = "myList";
    public static final String MY_LOGO = "myLogo";
    public static final String MY_ALERT_LIST = "myAlertList";

    private static LogicData mInstance;
    private JSONArray mMyList;
    private JSONArray mMyAlertList;
    private String myLogo;


    public static LogicData getInstance() {
        if (mInstance == null) {
            mInstance = new LogicData();
        }

        return mInstance;
    }

    public void setData(String dataName, String data) {
        if (dataName.equals(MY_LIST)) {
            try {
                mMyList = new JSONArray(data);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }else if(dataName.equals(MY_ALERT_LIST)){
            try {
                mMyAlertList = new JSONArray(data);
//                if(ReactStockEditFragmentNative.instance !=null){
//                    ReactStockEditFragmentNative.instance.makeDataRefresh();
//                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }else if(dataName.equals(MY_LOGO)){
            myLogo = data;
        }
    }

    public JSONArray getMyList() {
        return mMyList;
    }

    public String getMyLogo(){
        return myLogo;
    }

    public JSONArray getMyAlertList(){
        return mMyAlertList;
    }

}
