package com.tradehero.cfd;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.media.SoundPool;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.EditText;
import android.widget.TextView;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.igexin.sdk.PushManager;
import com.meiqia.core.callback.OnInitCallback;
import com.meiqia.meiqiasdk.util.MQConfig;
import com.tencent.bugly.crashreport.CrashReport;
import com.tendcloud.appcpa.TalkingDataAppCpa;
import com.tradehero.cfd.RNNativeModules.NativeActions;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;
import com.tradehero.cfd.talkingdata.TalkingDataModule;

import java.util.HashMap;

import butterknife.Bind;
import butterknife.ButterKnife;
import com.tongdao.sdk.ui.TongDaoUiCore;
import com.tradehero.cfd.tongdao.TongDaoModule;

import static android.content.pm.PackageManager.GET_META_DATA;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
//BUGBUG: how to use the 0.33 way ReactActivity with a splash screen?
public class MainActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler,
        ReactInstanceManager.ReactInstanceEventListener {

    @Bind(R.id.react_root_view)
    ReactRootView reactRootView;

    @Bind(R.id.tvVersion)
    TextView tvVersion;


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    /*@Override
    protected String getMainComponentName() {
        return "TH_CFD";
    }*/

    private ReactInstanceManager mReactInstanceManager;
    private boolean mDoRefresh = false;
    public static String mClientIDTeTui = "";
    final static String TAG = "MainActivity";

    private static final int REQUEST_PERMISSION = 0;
    public static MainActivity mInstance;
    public static float SCREEN_W;
    public static float SCREEN_H;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mInstance = this;
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        preferences.edit().putString("debug_http_host", "192.168.20.130:8081").apply();

        super.onCreate(null);

        CrashReport.initCrashReport(getApplicationContext());
        TalkingDataModule.register(getApplicationContext(), null, null, true);
        TalkingDataAppCpa.init(this.getApplicationContext(), "d505985d4e8e494fbd59aab89d4b8b96", null);

        initMeiQia();
        initTongDao();
        initGeTui();
        initSound();

        mReactInstanceManager = ((CFDApplication)getApplication()).getReactNativeHost().getReactInstanceManager();
        setContentView(R.layout.react_activity_container);
        ButterKnife.bind(this);

        reactRootView.startReactApplication(mReactInstanceManager, "TH_CFD", null);

        mReactInstanceManager.addReactInstanceEventListener(this);

        try {
            String pkName = this.getPackageName();
            String versionName = this.getPackageManager().getPackageInfo(
                    pkName, 0).versionName;
            tvVersion.setText("V" + versionName + " 版本");
        } catch (Exception e) {
        }

        getScreenWH();
    }

    @Override
    public void onReactContextInitialized(ReactContext context) {
        //Send GeTui Client ID to RN
        initDeviceToken();

        if(getIntent() != null){
            if (getIntent().getExtras() != null) {
                final String data = getIntent().getExtras().getString(GeTuiBroadcastReceiver.KEY_PUSH_DATA);
                if (data != null) {
                    sendPushDetailMessageWhenAvailable(data);
                    mReactInstanceManager.removeReactInstanceEventListener(this);
                }
            }
            handlePossilbeDeepLink(getIntent());
        }
    }

    String pushData = null;

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        if(intent != null ) {
            if (intent.getExtras() != null) {
                String data = intent.getExtras().getString(GeTuiBroadcastReceiver.KEY_PUSH_DATA);
                if (data != null) {
                    sendPushDetailMessageWhenAvailable(data);
                }
            }
            handlePossilbeDeepLink(intent);
        }
    }

    private void handlePossilbeDeepLink(Intent intent){
        Uri uri = intent.getData();
        if(uri!=null && uri.getScheme().equalsIgnoreCase("cfd")) {
            String url = uri.toString();
            NativeDataModule.passDataToRN(mReactInstanceManager.getCurrentReactContext(), NativeActions.ACTION_OPEN_URL, url);
        }
    }

    private void sendPushDetailMessageWhenAvailable(String data) {
        if (mReactInstanceManager.getLifecycleState() != LifecycleState.RESUMED) {
            Log.i(TAG, "send data to RN. RN is paused so let's wait.");
            //RN instance is paused or not started.
            //So store the data for now and wait until onResume, otherwise the RN instance is still paused.
            pushData = data;
        } else {
            Log.i(TAG, "send data to RN immediately.");
            showPushDetail(data);
        }
    }

    private void showPushDetail(final String pushJsonString) {
        try {
            ReactContext context = mReactInstanceManager.getCurrentReactContext();
            if (context != null) {
                NativeDataModule.passDataToRN(context, NativeActions.ACTION_SHOW_DETAIL, pushJsonString);
            }
        } catch (Exception e) {
            Log.e(TAG, "passDataToRN : error", e);
        }
    }

    @Override
    public void finish() {
        super.finish();
        RNManager.destroyInstance();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        ButterKnife.unbind(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        TongDaoUiCore.onSessionEnd(this);
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        TongDaoUiCore.onSessionStart(this);
        TongDaoUiCore.displayInAppMessage(this);
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);

            if (pushData != null) {
                showPushDetail(pushData);
                pushData = null;
            }
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (mReactInstanceManager != null &&
                mReactInstanceManager.getDevSupportManager().getDevSupportEnabled()) {
            if (keyCode == KeyEvent.KEYCODE_MENU) {
                mReactInstanceManager.showDevOptionsDialog();
                return true;
            }
            if (keyCode == KeyEvent.KEYCODE_R && !(getCurrentFocus() instanceof EditText)) {
                // Enable double-tap-R-to-reload
                if (mDoRefresh) {
                    mReactInstanceManager.getDevSupportManager().handleReloadJS();
                    mDoRefresh = false;
                } else {
                    mDoRefresh = true;
                    new Handler().postDelayed(
                            new Runnable() {
                                @Override
                                public void run() {
                                    mDoRefresh = false;
                                }
                            },
                            200);
                }
            }
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
    }

    public void initMeiQia() {
        MQConfig.init(this, "2a59beff6f1875815ea399fdad79a46e", new OnInitCallback() {
            @Override
            public void onSuccess(String clientId) {
//                Toast.makeText(MainActivity.this, "init success", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(int code, String message) {
//                Toast.makeText(MainActivity.this, "int failure", Toast.LENGTH_SHORT).show();
            }
        });

        MQConfig.isShowClientAvatar = true;

    }

    public void initDeviceToken() {
        try {
//                    String ANDOIRD_ID = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
//                    Log.d("CFD LOG","Android ID : "+ ANDOIRD_ID);
//                    ReactContext context = mReactInstanceManager.getCurrentReactContext();
//                    Log.d("","initDeviceToken : " + ANDOIRD_ID);

            ReactContext context = mReactInstanceManager.getCurrentReactContext();
            if (mClientIDTeTui != null) {
                NativeDataModule.passDataToRN(context, NativeActions.ACTION_DEVICE_TOKEN, mClientIDTeTui);
                Log.d("GeTui", "NativeDataModule deviceToken : " + mClientIDTeTui);
            }


        } catch (Exception e) {
            Log.d("", "initDeviceToken : error");
        }
    }

    public void initGeTui() {
        // SDK初始化，第三方程序启动时，都要进行SDK初始化工作
        Log.d("GetuiSdk", "initializing sdk...");
        PackageManager pkgManager = getPackageManager();
        // 读写 sd card 权限非常重要, android6.0默认禁止的, 建议初始化之前就弹窗让用户赋予该权限
        boolean sdCardWritePermission =
                pkgManager.checkPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, getPackageName()) == PackageManager.PERMISSION_GRANTED;


        // read phone state用于获取 imei 设备信息
        boolean phoneSatePermission =
                pkgManager.checkPermission(android.Manifest.permission.READ_PHONE_STATE, getPackageName()) == PackageManager.PERMISSION_GRANTED;

        if (Build.VERSION.SDK_INT >= 23 && !sdCardWritePermission || !phoneSatePermission) {
            requestPermission();
        } else {
            // SDK初始化，第三方程序启动时，都要进行SDK初始化工作
            PushManager.getInstance().initialize(this.getApplicationContext());
        }

        mClientIDTeTui = PushManager.getInstance().getClientid(this);
        if (mClientIDTeTui != null) {
            Log.d("GeTui", "" + mClientIDTeTui);

            TongDaoModule.setPushToken(mClientIDTeTui);
        }
    }

    public void initTongDao(){
         String appKey = null;
        try {
            ApplicationInfo applicationInfo = getPackageManager().getApplicationInfo(getPackageName(), GET_META_DATA);
            if(applicationInfo != null && applicationInfo.metaData != null) {
                appKey = applicationInfo.metaData.getString("TONGDAO_APP_KEY");
                if(appKey != null) {
                    appKey = appKey.trim();
                }
            }
        } catch (Exception err) {
            Log.e("Initialize TongDao|", err.toString());
        }

        TongDaoUiCore.init(this, appKey);
    }

    private void requestPermission() {
        ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.READ_PHONE_STATE},
                REQUEST_PERMISSION);

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == REQUEST_PERMISSION) {
            if ((grantResults.length == 2 && grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED)) {
                PushManager.getInstance().initialize(this.getApplicationContext());
            } else {
                Log.e("GetuiSdkDemo",
                        "we highly recommend that you need to grant the special permissions before initializing the SDK, otherwise some "
                                + "functions will not work");
                PushManager.getInstance().initialize(this.getApplicationContext());
            }
        } else {
            onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    //播放声音index
    public void playSound(int index) {
        try {
            int loop = 1;
            AudioManager am = (AudioManager) this
                    .getSystemService(mInstance.AUDIO_SERVICE);
            float audioMaxVolumn = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
            float volumnCurrent = am.getStreamVolume(AudioManager.STREAM_MUSIC);
            float volumnRatio = volumnCurrent / audioMaxVolumn;

            sp.play(spMap.get(index), volumnRatio, volumnRatio, 1, loop, 1f);
        } catch (Exception e) {
            Log.e("", "play sound error " + e.toString());
        }

    }


    SoundPool sp;
    HashMap<Integer, Integer> spMap;

    public void initSound() {
        sp = new SoundPool(1, AudioManager.STREAM_MUSIC, 0);
        spMap = new HashMap<Integer, Integer>();
        spMap.put(0, sp.load(this, R.raw.coin, 1));
//        spMap.put(2, sp.load(this, R.raw.hit, 1));

    }

    public void passIsProductServerToRN() {
        ReactContext context = mReactInstanceManager.getCurrentReactContext();
        if (context != null) {
            Boolean isProductEnvironment = BuildConfig.IS_PRODUCT_ENVIRONMENT;
            NativeDataModule.passDataToRN(context, NativeActions.ACTION_SET_IS_PRODUCT_SERVER, isProductEnvironment.toString());
        }
    }


    public void getScreenWH() {

        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);
        SCREEN_W = dm.widthPixels/dm.density;
        SCREEN_H = dm.heightPixels/dm.density;

        Log.d("MainActivity", "SrceenW:" + SCREEN_W + " ScreenH:" + SCREEN_H);

    }
}
