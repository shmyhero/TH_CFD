package com.tradehero.th;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Region;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class MainActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

    @Bind(R.id.react_root_view)
    ReactRootView reactRootView;

    private ReactInstanceManager mReactInstanceManager;
    private boolean mDoRefresh = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        preferences.edit().putString("debug_http_host", "192.168.6.17:8081").apply();

        super.onCreate(savedInstanceState);

        mReactInstanceManager = RNManager.getInstanceManager(getApplication());
        setContentView(R.layout.react_activity_container);
        ButterKnife.bind(this);

        reactRootView.startReactApplication(mReactInstanceManager, "TH_CFD", null);
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
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
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

    private static class SampleView extends View {

        // CONSTRUCTOR
        public SampleView(Context context) {
            super(context);
            setFocusable(true);
        }

        @Override
        protected void onDraw(Canvas canvas) {
            Path path = new Path();
            path.addCircle(150, 150, 50, Path.Direction.CCW);
            canvas.clipPath(path);

            Paint paint = new Paint();
            paint.setColor(Color.YELLOW);
            canvas.drawCircle(150, 150, 50, paint);

            Drawable drawable = ContextCompat.getDrawable(getContext(), R.drawable.fade_red);
            drawable.setBounds(100, 100, 300, 300);
            drawable.draw(canvas);
        }

        private void oldPaint(Canvas canvas) {
            canvas.drawColor(Color.YELLOW);

            Bitmap b = Bitmap.createBitmap(400, 400,
                    Bitmap.Config.ARGB_8888);

            Paint paint = new Paint();

            // you need to insert a image flower_blue into res/drawable folder

            paint.setFilterBitmap(true);
            Bitmap bitmapOrg = BitmapFactory.decodeResource(getResources(),
                    R.drawable.what_to_buy_default_banner);
            canvas.drawBitmap(bitmapOrg, 10, 10, paint);

            Canvas c = new Canvas(b);
            paint.setAlpha(255); //0x80
            c.translate(0, 30);
            c.drawBitmap(bitmapOrg, new Matrix(), paint);
            paint.setColor(Color.BLUE);
            Path mPath = new Path();
            mPath.addCircle(50, 50, 50, Path.Direction.CCW);
            //c.clipPath(mPath, Region.Op.UNION);
            c.clipPath(mPath, Region.Op.DIFFERENCE);
            //c.clipPath(mPath, Region.Op.INTERSECT);
            //c.clipPath(mPath, Region.Op.REPLACE);
            //c.clipPath(mPath, Region.Op.XOR);
            paint.setColor(Color.GREEN);
            paint.setAntiAlias(true);
            c.drawCircle(30, 20, 30, paint);

            int h = bitmapOrg.getHeight();
            //canvas.drawBitmap(bitmapOrg, 10, 10, paint);
            canvas.drawBitmap(b, 10, 10 + h + 10, paint);
        }

    }
}
