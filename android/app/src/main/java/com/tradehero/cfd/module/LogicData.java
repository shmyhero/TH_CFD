package com.tradehero.cfd.module;

import android.util.Log;

import com.tradehero.cfd.MainActivity;
import com.tradehero.cfd.R;

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
    public static final String GET_VERSION_CODE = "getVersionCode";
    public final static String GET_DEVICE_TOKEN = "getui";

    public static final String LIVE_NAME = "userName";
    public static final String LIVE_EMAIL = "userEmail";

    private static LogicData mInstance;
    private JSONArray mMyList;
    private JSONArray mMyAlertList;
    private String myLogo;
    private String mLiveName;
    private String mLiveEmail;

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
        }else if(dataName.equals(LIVE_NAME)){
            mLiveName = data;
        }else if(dataName.equals(LIVE_EMAIL)){
            mLiveEmail = data;
        }else if(dataName.equals(GET_VERSION_CODE)){
            getVersionCode();
        }else if(dataName.equals(GET_DEVICE_TOKEN)){
            sendDeviceTokenToRN();
        }
    }

    public String getLiveName(){
        return mLiveName;
    }

    public String getLiveEmail(){
        return mLiveEmail;
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

    public void getVersionCode(){
        if(MainActivity.mInstance != null) {
            MainActivity.mInstance.getVersionCode();
        }
    }

    private void sendDeviceTokenToRN(){
        if(MainActivity.mInstance != null) {
            MainActivity.mInstance.sendDeviceTokenToRN();
        }
    }
}
