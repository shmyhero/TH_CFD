package com.tradehero.cfd.module;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LogicData {

    public static final String MY_LIST = "myList";

    private static LogicData mInstance;
    private JSONArray mMyList;


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
        }
    }

    public JSONArray getMyList() {
        return mMyList;
    }
}
