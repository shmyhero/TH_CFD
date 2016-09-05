package com.tradehero.cfd;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.igexin.sdk.PushManager;
import com.meiqia.core.callback.OnInitCallback;
import com.meiqia.meiqiasdk.util.MQConfig;
import com.tencent.bugly.crashreport.CrashReport;
import com.tendcloud.appcpa.TalkingDataAppCpa;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;
import com.tradehero.cfd.module.LogicData;
import com.tradehero.cfd.talkingdata.TalkingDataModule;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class MainActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

    @Bind(R.id.react_root_view)
    ReactRootView reactRootView;

    @Bind(R.id.tvVersion)
    TextView tvVersion;

    private ReactInstanceManager mReactInstanceManager;
    private boolean mDoRefresh = false;
    public static String mClientIDTeTui = "";


    private static final int REQUEST_PERMISSION = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

        preferences.edit().putString("debug_http_host", "192.168.20.112:8081").apply();

        super.onCreate(null);

        CrashReport.initCrashReport(getApplicationContext());
        TalkingDataModule.register(getApplicationContext(), null, null, true);
        TalkingDataAppCpa.init(this.getApplicationContext(), "d505985d4e8e494fbd59aab89d4b8b96", null);

        initMeiQia();
        initGeTui();

        mReactInstanceManager = RNManager.getInstanceManager(getApplication());
        setContentView(R.layout.react_activity_container);
        ButterKnife.bind(this);

        reactRootView.startReactApplication(mReactInstanceManager, "TH_CFD", null);

        try {
            String pkName = this.getPackageName();
            String versionName = this.getPackageManager().getPackageInfo(
                    pkName, 0).versionName;
            tvVersion.setText("V"+versionName+" 版本");
        } catch (Exception e) {
        }


        handler.sendEmptyMessageDelayed(0,1000);

        if(getIntent() != null && getIntent().getExtras()!= null)
        {
            String data = getIntent().getExtras().getString(GeTuiBroadcastReceiver.KEY_PUSH_DATA);
            AlertDialog dialog = new AlertDialog.Builder(this)
                    .setMessage(data)
                    .create();
            dialog.show();
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
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
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

    public void onActivityResult(int requestCode, int resultCode, Intent data){
        super.onActivityResult(requestCode, resultCode, data);
        mReactInstanceManager.onActivityResult(requestCode, resultCode, data);
    }

    public void initMeiQia(){
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


    Handler handler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            initDeviceToken();
        }
    };

    public void initDeviceToken(){

        new Thread(new Runnable() {
            @Override
            public void run() {
                try{
//                    String ANDOIRD_ID = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
//                    Log.d("CFD LOG","Android ID : "+ ANDOIRD_ID);
//                    ReactContext context = mReactInstanceManager.getCurrentReactContext();
//                    Log.d("","initDeviceToken : " + ANDOIRD_ID);

                    ReactContext context = mReactInstanceManager.getCurrentReactContext();
                    if(mClientIDTeTui!=null){
                        NativeDataModule.passDataToRN(context, "deviceToken", mClientIDTeTui);
                        Log.d("GeTui","NativeDataModule deviceToken : " + mClientIDTeTui);
                    }


                }catch (Exception e){
                    Log.d("","initDeviceToken : error");
                }
            }
        }).start();

    }

    public void initGeTui(){


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
        if(mClientIDTeTui!=null){
            Log.d("GeTui",""+mClientIDTeTui);
        }

    }

    private void requestPermission() {
        ActivityCompat.requestPermissions(this, new String[] {android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.READ_PHONE_STATE},
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
}
