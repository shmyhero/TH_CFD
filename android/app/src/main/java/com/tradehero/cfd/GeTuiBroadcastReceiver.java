package com.tradehero.cfd;

import android.app.Application;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.igexin.sdk.PushConsts;
//import com.tongdao.sdk.ui.TongDaoUiCore;
import com.tradehero.cfd.RNNativeModules.NativeActions;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

/**
 * Created by Neko on 16/9/5.
 */
public class GeTuiBroadcastReceiver extends BroadcastReceiver{

    public final static String KEY_PUSH_DATA = "pushData";

    final static String TAG = "GeTuiBroadcastReceiver";

    public final static int PUSH_TYPE_DIALOG = 0;
    public final static int PUSH_TYPE_DEEP_LINK = 1;

    public final static String DEEP_LINK_KEY = "deepLink";

    //public final static String TONGDAO_TYPE_KEY = "tongrd_type";
    //public final static String TONGDAO_VALUE_KEY = "tongrd_value";

    @Override
    public void onReceive(Context context, Intent intent) {

        MainApplication application = (MainApplication) context.getApplicationContext();

        Bundle bundle = intent.getExtras();
        Log.i(TAG, "onReceive() action=" + bundle.getInt("action"));

        switch (bundle.getInt(PushConsts.CMD_ACTION)) {
            case PushConsts.GET_CLIENTID:
                String cid = bundle.getString("clientid");
                if (cid != null) {
                    Log.i(TAG, "receive client id: " + cid);
                    if(MainActivity.mInstance != null) {
                        MainActivity.mInstance.setGetuiClientID(cid);
                    }
                }
                break;
            case PushConsts.GET_MSG_DATA:
                byte[] payload = bundle.getByteArray("payload");

                if (payload != null) {
                    String data = new String(payload);
                    Log.i(TAG, "receive push data: " + data);

                    // Check if it is TongDao's push data. If it is, the Tongdao sdk will show the
                    // notification. But the deep link has some issue wo we need to handle it in
                    // our app.
//                    if(parseTongDaoData(context, data)){
//                        break;
//                    }

                    //So it is a Getui push.
                    if(application.IsAppFront()){
                        showPushDialog(application, data);
                    }else{
                        createNotification(application, data);
                    }
                }
                break;
            default:
                break;
        }
    }

    /*
    private boolean parseTongDaoData(Context context, String data){
        try{
            byte[] base64Payload = Base64.decode(data, Base64.DEFAULT);
            data = new String(base64Payload, "UTF-8");



            JSONObject jsonObject = new JSONObject(data);

            if(jsonObject.has(TONGDAO_TYPE_KEY) && jsonObject.has(TONGDAO_VALUE_KEY)){
                Intent resultIntent = new Intent(context, MainActivity.class);

                Bundle pushDataBundle = new Bundle();
                pushDataBundle.putString(KEY_PUSH_DATA, data);

                resultIntent.putExtras(pushDataBundle);
                resultIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(resultIntent);
                return true;
            }
        }catch (Exception e){
            Log.e(TAG, "parseTongDaoData exception: ", e);
            //Ignore the action?
        }

        return false;
    }
    */

    private void showPushDialog(Application application, String pushJsonString){
        int type = PUSH_TYPE_DIALOG;
        String data = pushJsonString;
        /*try{
            JSONObject jsonObject = new JSONObject(pushJsonString);
            if(jsonObject.has(DEEP_LINK_KEY)){
                type = PUSH_TYPE_DEEP_LINK;
                data = jsonObject.getString(DEEP_LINK_KEY);
            }
        }catch (Exception e){
            Log.e(TAG, "showPushDialog exception: ", e);
            //Ignore the action?
        }

        ReactContext rnContext = ((CFDApplication) application).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        if(type == PUSH_TYPE_DEEP_LINK) {
            NativeDataModule.passDataToRN(rnContext, NativeActions.ACTION_OPEN_URL, data);
        }else {
            NativeDataModule.passDataToRN(rnContext, NativeActions.ACTION_PUSH_DIALOG, data);
        }
        */

        ReactContext rnContext = ((MainApplication) application).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        NativeDataModule.passDataToRN(rnContext, NativeActions.ACTION_PUSH_DIALOG, data);
    }

    private void createNotification(Application application, String data){
        try {
            JSONObject jsonObject = new JSONObject(data);

            String title =jsonObject.getString("title");
            String message =jsonObject.getString("message");

            NotificationCompat.Builder mBuilder =
                    new NotificationCompat.Builder(application)
                            .setSmallIcon(R.drawable.push)
                            .setContentTitle(title)
                            .setContentText(message);

            //Create the intent

            //Do not handle deep link here.
            /*if(jsonObject.has(DEEP_LINK_KEY)){
                String deepLinkUrl = jsonObject.getString(DEEP_LINK_KEY);
                Uri uri = Uri.parse(deepLinkUrl);
                resultIntent = new Intent(Intent.ACTION_VIEW);
                resultIntent.addCategory(Intent.CATEGORY_BROWSABLE);
                resultIntent.setData(uri);
            }*/

            Intent resultIntent = new Intent(application, MainActivity.class);

            Bundle pushDataBundle = new Bundle();
            pushDataBundle.putString(KEY_PUSH_DATA, data);

            resultIntent.putExtras(pushDataBundle);

            PendingIntent notifyPendingIntent =
                    PendingIntent.getActivity(
                            application,
                            0,
                            resultIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT);

            mBuilder.setContentIntent(notifyPendingIntent);

            NotificationManager mNotificationManager =
                    (NotificationManager)application.getSystemService(Context.NOTIFICATION_SERVICE);

            Notification notification = mBuilder.build();
            notification.flags = Notification.DEFAULT_LIGHTS | Notification.FLAG_AUTO_CANCEL;

            //Unique id for every notification.
            int id = UUID.randomUUID().hashCode();
            mNotificationManager.notify(id, notification);
        }catch (Exception e){
            Log.e(TAG, e.getMessage(), e);
        }
    }
}
