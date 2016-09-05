package com.tradehero.cfd;

import android.app.Application;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.igexin.sdk.PushConsts;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;

import org.json.JSONObject;

/**
 * Created by Rambo on 16/9/5.
 */
public class GeTuiBroadcastReceiver extends BroadcastReceiver{

    public final static String KEY_PUSH_DATA = "pushData";

    final static String TAG = "GeTuiBroadcastReceiver";
    final static int PUSH_NOTIFICATION_ID = 100;

    @Override
    public void onReceive(Context context, Intent intent) {

        CFDApplication application = (CFDApplication) context.getApplicationContext();

        Bundle bundle = intent.getExtras();
        Log.i("GetuiSdkDemo", "onReceive() action=" + bundle.getInt("action"));

        switch (bundle.getInt(PushConsts.CMD_ACTION)) {
            case PushConsts.GET_MSG_DATA:
                String taskid = bundle.getString("taskid");
                String messageid = bundle.getString("messageid");
                byte[] payload = bundle.getByteArray("payload");

                if (payload != null) {
                    String data = new String(payload);
                    Log.i(TAG, "payload=" + data);

                    if(application.IsAppFront()){
                        //Front most, send data to RN Push Dialog.
                        ReactContext rnContext = RNManager.getInstanceManager(application).getCurrentReactContext();
                        NativeDataModule.passDataToRN(rnContext, "GeTuiPushDialog", data);
                    }else{
                        createNotification(application, data);
                    }
                }
                break;
            default:
                break;
        }
    }

    private void createNotification(Application application, String data){
        try {
            JSONObject jsonObject = new JSONObject(data);

            String title =jsonObject.getString("title");
            String message =jsonObject.getString("msg");

            NotificationCompat.Builder mBuilder =
                    new NotificationCompat.Builder(application)
                            .setSmallIcon(R.drawable.push)
                            .setContentTitle(title)
                            .setContentText(message);

            Intent resultIntent = new Intent(application, MainActivity.class);
            //resultIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
            //        | Intent.FLAG_ACTIVITY_CLEAR_TASK);

            Bundle pushDataBundle = new Bundle();
            pushDataBundle.putString(KEY_PUSH_DATA, data);

            resultIntent.putExtras(pushDataBundle);

            // Creates the PendingIntent
            PendingIntent notifyPendingIntent =
                    PendingIntent.getActivity(
                            application,
                            0,
                            resultIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT
                    );

            mBuilder.setContentIntent(notifyPendingIntent);

            NotificationManager mNotificationManager =
                    (NotificationManager)application.getSystemService(Context.NOTIFICATION_SERVICE);
            mNotificationManager.notify(PUSH_NOTIFICATION_ID, mBuilder.build());
        }catch (Exception e){
            Log.e(TAG, e.getMessage());
        }
    }
}
