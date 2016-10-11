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
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.igexin.sdk.PushConsts;
import com.tradehero.cfd.RNNativeModules.NativeActions;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;

import org.json.JSONObject;

import java.util.Date;
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

    @Override
    public void onReceive(Context context, Intent intent) {

        CFDApplication application = (CFDApplication) context.getApplicationContext();

        Bundle bundle = intent.getExtras();
        Log.i(TAG, "onReceive() action=" + bundle.getInt("action"));

        switch (bundle.getInt(PushConsts.CMD_ACTION)) {
            case PushConsts.GET_MSG_DATA:
                byte[] payload = bundle.getByteArray("payload");

                if (payload != null) {
                    String data = new String(payload);
                    Log.i(TAG, "receive push data: " + data);

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

    private void showPushDialog(Application application, String pushJsonString){
        int type = PUSH_TYPE_DIALOG;
        try{
            JSONObject jsonObject = new JSONObject(pushJsonString);
            if(jsonObject.has(DEEP_LINK_KEY)){
                type = PUSH_TYPE_DEEP_LINK;
            }
        }catch (Exception e){
            //Ignore the action?
        }

        ReactContext rnContext = ((CFDApplication) application).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        if(type == PUSH_TYPE_DEEP_LINK) {
            NativeDataModule.passDataToRN(rnContext, NativeActions.ACTION_OPEN_URL, pushJsonString);
        }else {
            NativeDataModule.passDataToRN(rnContext, NativeActions.ACTION_PUSH_DIALOG, pushJsonString);
        }
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
            Intent resultIntent = null;
            if(jsonObject.has(DEEP_LINK_KEY)){
                String deepLinkUrl = jsonObject.getString(DEEP_LINK_KEY);
                Uri uri = Uri.parse(deepLinkUrl);
                resultIntent = new Intent(Intent.ACTION_VIEW);
                resultIntent.addCategory(Intent.CATEGORY_BROWSABLE);
                resultIntent.setData(uri);
            }else{
                resultIntent = new Intent(application, MainActivity.class);

                Bundle pushDataBundle = new Bundle();
                pushDataBundle.putString(KEY_PUSH_DATA, data);

                resultIntent.putExtras(pushDataBundle);
            }

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
