package com.tradehero.cfd.module;

import android.util.Log;

import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.R;
import com.tradehero.cfd.views.ReactStockEditFragmentNative;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LogicData {
    private static String isLive = "false";

    public static final String MY_LIST = "myList";
    public static final String MY_LOGO = "myLogo";
    public static final String MY_ALERT_LIST = "myAlertList";
    public static final String PLAY_SOUND = "playSound";
    public static final String IS_PRODUCT = "isProduct";
    public static final String ACCOUNT_STATE = "accountState";

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
                mMyList = new JSONArray( data);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }else if(dataName.equals(MY_ALERT_LIST)){
            try {
                mMyAlertList = new JSONArray((String)data);
//                if(ReactStockEditFragmentNative.instance !=null){
//                    ReactStockEditFragmentNative.instance.makeDataRefresh();
//                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }else if(dataName.equals(MY_LOGO)){
            myLogo =  data;
        }else if(dataName.equals(PLAY_SOUND)){
            playSound(0);
        }else if(dataName.equals(IS_PRODUCT)){
            checkIsProduct();
        }else if(dataName.equals(ACCOUNT_STATE)){
            isLive = data;
            Log.d("" , "isLive = " + isLive);

            setStatusBarColor();
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

    public boolean isLive(){
        return "true".equals(isLive);
    }

    public void setStatusBarColor(){
        if(MainActivity.mInstance!=null){
            if(isLive()){
                MainActivity.mInstance.setStatusBarColor(R.color.title_blue2);
            }else{
                MainActivity.mInstance.setStatusBarColor(R.color.title_blue);
            }
        }
    }
}
