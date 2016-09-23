package com.tradehero.cfd;

import android.app.Application;
import android.app.Notification;
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

import java.util.Date;
import java.util.UUID;

/**
 * Created by Neko on 16/9/5.
 */
public class GeTuiBroadcastReceiver extends BroadcastReceiver{

    public final static String KEY_PUSH_DATA = "pushData";

    public final static String ACTION_PUSH_DIALOG = "PushShowDialog";
    public final static String ACTION_SHOW_DETAIL = "PushShowDetail";

    final static String TAG = "GeTuiBroadcastReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {

        CFDApplication application = (CFDApplication) context.getApplicationContext();

        Bundle bundle = intent.getExtras();
        Log.i(TAG, "onReceive() action=" + bundle.getInt("action"));

        switch (bundle.getInt(PushConsts.CMD_ACTION)) {
            case PushConsts.GET_MSG_DATA:
                //String taskid = bundle.getString("taskid");
                //String messageid = bundle.getString("messageid");
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
        ReactContext rnContext = ((CFDApplication)application).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        NativeDataModule.passDataToRN(rnContext, ACTION_PUSH_DIALOG, pushJsonString);
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
            Log.e(TAG, e.getMessage());
        }
    }
}
