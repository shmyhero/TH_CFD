package com.tradehero.cfd.module;

import com.tradehero.cfd.MainActivity;
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
    public static final String PLAY_SOUND = "playSound";
    public static final String IS_PRODUCT = "isProduct";

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
        }else if(dataName.equals(PLAY_SOUND)){
            playSound(0);
        }else if(dataName.equals(IS_PRODUCT)){
            checkIsProduct();
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

    public void playSound(int index){
        if(MainActivity.mInstance!=null){
            MainActivity.mInstance.playSound(index);
        }
    }

    public void checkIsProduct(){
        if(MainActivity.mInstance!=null){
            MainActivity.mInstance.passIsProductServerToRN();
        }
    }
}
