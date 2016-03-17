package com.tradehero.th.module;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LogicData {

    private static LogicData mInstance;
    private JSONArray mMyList;


    public static LogicData getInstance() {
        if (mInstance == null) {
            mInstance = new LogicData();
        }

        return mInstance;
    }

    public void setData(String dataName, JSONArray data) {
        if (dataName.equals("myList")) {
            mMyList = data;
        }
    }

    public JSONArray getMyList() {
        return mMyList;
    }
}
