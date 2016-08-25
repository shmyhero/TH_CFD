package com.tradehero.cfd.module;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LogicData {

    public static final String MY_LIST = "myList";
    public static final String MY_LOGO = "myLogo";

    private static LogicData mInstance;
    private JSONArray mMyList;
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

}
