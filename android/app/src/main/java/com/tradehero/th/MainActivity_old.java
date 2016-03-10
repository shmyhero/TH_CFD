package com.tradehero.th;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v4.app.FragmentTabHost;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

import butterknife.Bind;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class MainActivity_old extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

    private int currentTab = -1;
    private static final int TAB_TRADE = 0;
    private static final int TAB_STOCKGOD = 1;
    private static final int TAB_DISCOVERY = 2;
    private static final int TAB_COMPETITION = 3;
    private static final int TAB_MINE = 4;

    private Class fragmentArray[] = {
            LandingFragment.class,
            EmptyFragment.class,
            EmptyFragment.class,
            CompeitionFragment.class,
            SettingsFragment.class
    };

    private int strTabArray[] = {
            R.string.tab_main_trade,
            R.string.tab_main_buy_what,
            R.string.tab_main_descovery,
            R.string.tab_main_competition,
            R.string.tab_main_me
    };

    @Bind(R.id.tabhost) FragmentTabHost frg_tabHost;

    @Bind(R.id.imgTabMenu0) ImageView imgTabMenu0;
    @Bind(R.id.imgTabMenu1) ImageView imgTabMenu1;
    @Bind(R.id.imgTabMenu2) ImageView imgTabMenu2;
    @Bind(R.id.imgTabMenu3) ImageView imgTabMenu3;
    @Bind(R.id.imgTabMenu4) ImageView imgTabMenu4;

    @Bind(R.id.tvTabMenu0) TextView tvTabMenu0;
    @Bind(R.id.tvTabMenu1) TextView tvTabMenu1;
    @Bind(R.id.tvTabMenu2) TextView tvTabMenu2;
    @Bind(R.id.tvTabMenu3) TextView tvTabMenu3;
    @Bind(R.id.tvTabMenu4) TextView tvTabMenu4;

    private ReactInstanceManager mReactInstanceManager;
    private boolean mDoRefresh = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences preferences =
                PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
//        preferences.edit().putString("debug_http_host", "fhmainstorage.blob.core.windows.net/fhres").apply();
        preferences.edit().putString("debug_http_host", "192.168.20.77:8081").apply();

        super.onCreate(savedInstanceState);

        mReactInstanceManager = RNManager.getInstanceManager(getApplication());
        setContentView(R.layout.main);
        ButterKnife.bind(this);
        initTabFragments();
        setTabCurrent(TAB_TRADE);
    }

    private void initTabFragments() {

        int count = strTabArray.length;
        frg_tabHost.setup(this, getSupportFragmentManager(), R.id.realtabcontent);

        for (int i = 0; i < count; i++) {
            TextView textView = new TextView(this);
            textView.setText(strTabArray[i]);
            //do not see the indicator text，it is a temp solution.
            textView.setTextSize(0);
            textView.setTextColor(0xFF0000FF);
            TabHost.TabSpec tabSpec = frg_tabHost.newTabSpec(getString(strTabArray[i])).setIndicator(textView);
            frg_tabHost.addTab(tabSpec, fragmentArray[i], null);
        }
    }

    public void setTabCurrent(int index) {
        if (index != currentTab) {
            currentTab = index;
            frg_tabHost.setCurrentTab(currentTab);

            imgTabMenu0.setBackgroundResource(currentTab == TAB_TRADE ? R.drawable.tab_menu0_active : R.drawable.tab_menu0_normal);
            imgTabMenu1.setBackgroundResource(currentTab == TAB_STOCKGOD ? R.drawable.tab_menu1_active : R.drawable.tab_menu1_normal);
            imgTabMenu2.setBackgroundResource(currentTab == TAB_DISCOVERY ? R.drawable.tab_menu2_active : R.drawable.tab_menu2_normal);
            imgTabMenu3.setBackgroundResource(currentTab == TAB_MINE ? R.drawable.tab_menu4_active : R.drawable.tab_menu4_normal);
            imgTabMenu4.setBackgroundResource(currentTab == TAB_COMPETITION ? R.drawable.tab_menu5_active : R.drawable.tab_menu5_normal);

            tvTabMenu0.setTextColor(currentTab == TAB_TRADE ? getResources().getColor(R.color.main_tab_text_color_active)
                    : getResources().getColor(R.color.main_tab_text_color_default));
            tvTabMenu1.setTextColor(currentTab == TAB_STOCKGOD ? getResources().getColor(R.color.main_tab_text_color_active)
                    : getResources().getColor(R.color.main_tab_text_color_default));
            tvTabMenu2.setTextColor(currentTab == TAB_DISCOVERY ? getResources().getColor(R.color.main_tab_text_color_active)
                    : getResources().getColor(R.color.main_tab_text_color_default));
            tvTabMenu3.setTextColor(currentTab == TAB_MINE ? getResources().getColor(R.color.main_tab_text_color_active)
                    : getResources().getColor(R.color.main_tab_text_color_default));
            tvTabMenu4.setTextColor(currentTab == TAB_COMPETITION ? getResources().getColor(R.color.main_tab_text_color_active)
                    : getResources().getColor(R.color.main_tab_text_color_default));
        }
    }

    @OnClick({R.id.llTabTrade, R.id.llTabStockGod, R.id.llTabDiscovery, R.id.llTabCompetition, R.id.llTabMine})
    public void OnClickTabMenu(View view) {
        int id = view.getId();
        switch (id) {
            case R.id.llTabTrade:
                setTabCurrent(TAB_TRADE);
                break;
            case R.id.llTabStockGod:
                setTabCurrent(TAB_STOCKGOD);
                break;
            case R.id.llTabDiscovery:
                setTabCurrent(TAB_DISCOVERY);
                break;
            case R.id.llTabMine:
                setTabCurrent(TAB_MINE);
                break;
            case R.id.llTabCompetition:
                setTabCurrent(TAB_COMPETITION);
                break;
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
}
