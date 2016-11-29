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
    public static final String STATUS_BAR_COLOR = "statusBarColor";

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
        }else if(dataName.equals(ACCOUNT_STATE)){
            isLive = data;
            Log.d("" , "isLive = " + isLive);
            setStatusBarColor();
        }else if(dataName.equals(STATUS_BAR_COLOR)){
            setStatusBarColor(data);
        }else if(dataName.equals(LIVE_NAME)){
            mLiveName = data;
        }else if(dataName.equals(LIVE_EMAIL)){
            mLiveEmail = data;
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

    public boolean isLive(){
        return "true".equals(isLive);
    }

    public void setStatusBarColor(){
        if(MainActivity.mInstance!=null){
            int colorInt;
            if(isLive()){
                colorInt = MainActivity.mInstance.getResources().getColor(R.color.title_blue2);
//                colorInt = MainActivity.mInstance.getResources().getColor(R.color.title_blue2, null);
            }else{
                colorInt = MainActivity.mInstance.getResources().getColor(R.color.title_blue);
//                colorInt = MainActivity.mInstance.getResources().getColor(R.color.title_blue, null);
            }
            MainActivity.mInstance.setStatusBarColor(colorInt);
        }
    }

    public void setStatusBarColor(String colorString){
        if(MainActivity.mInstance!=null){
            if (colorString != null && colorString.startsWith("#")) {
                String actualColorString = colorString.substring(1);
                int colorInt = 0;
                if(actualColorString.length() == 6) {
                    colorInt = (int) Long.parseLong("FF" + actualColorString, 16);
                }else if(actualColorString.length() == 8){
                    colorInt = (int) Long.parseLong(actualColorString, 16);
                }
                MainActivity.mInstance.setStatusBarColor(colorInt);
            }else{
                setStatusBarColor();
            }
        }
    }

//    public void upgradeApp(){
//        if(MainActivity.mInstance!=null){
////            MainActivity.mInstance.upgradeApp();
//        }
//    }
}
