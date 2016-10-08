package com.tongdao.sdk.ui;

import java.util.ArrayList;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.tongdao.sdk.TongDao;
import com.tongdao.sdk.adapter.ui.TdFragmentPagerAdapter;
import com.tongdao.sdk.beans.TdErrorBean;
import com.tongdao.sdk.beans.TdPageBean;
import com.tongdao.sdk.fragment.ui.TdPageFragment;
import com.tongdao.sdk.imagetools.ui.TdImageManager;
import com.tongdao.sdk.imagetools.ui.TdUtils;
import com.tongdao.sdk.interfaces.OnDownloadLandingPageListener;
import com.tongdao.sdk.interfaces.OnErrorListener;
import com.tongdao.sdk.tools.ui.TdDisplayTool;

public class TdDialogActivity extends FragmentActivity {

    private RelativeLayout promotionProgressBar;
    private TdImageManager imageManager;
    private ViewPager promotionViewPager;
    private static final String PAGE_ID = "pageId";
    private String pageId;
    private int display_out_w;
    private int display_in_w;
    private int close_wh;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.td_promotion);
        this.getWindow().setLayout(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        this.promotionViewPager = (ViewPager) findViewById(R.id.lq_promotion_viewpager);
        this.promotionProgressBar = (RelativeLayout) this.findViewById(R.id.lq_promotion_progress);
        this.imageManager = new TdImageManager(this.getApplicationContext(), TdUtils.HTTP_CACHE_DIR);
        displayByIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        displayByIntent(intent);
    }

    private void displayByIntent(Intent intent) {
        this.pageId = intent.getStringExtra(PAGE_ID);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                refreshScreen();
            }
        }, 150);
    }

    private boolean isPortrait() {
        int requestedOrientation = getRequestedOrientation();
        if (requestedOrientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
            return true;
        }
        return false;
    }

    private void refreshScreen() {
        int[] configDatas = TdDisplayTool.configDisplay(this.getApplicationContext(), isPortrait(), this.promotionViewPager.getWidth(), this.promotionViewPager.getHeight());
        this.display_out_w = configDatas[0];
        this.display_in_w = configDatas[1];
        this.close_wh = configDatas[2];
        if (pageId != null) {
            displayPromotionLandingPage();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        closeImageManager();
        hideProgress();
    }

    private void displayPromotionLandingPage() {
        displayProgress();
        TongDao.downloadLandingPage(pageId, new OnDownloadLandingPageListener() {
            @Override
            public void onSuccess(final TdPageBean pageBean) {
                runOnUiThread(new Runnable() {
                    public void run() {
                        if (!TdDialogActivity.this.isFinishing()) {
                            makePromotionLandingViewPager(pageBean);
                            if (pageBean != null && pageBean.getRewardList() != null && TongDaoUiCore.getRewardUnlockedListener() != null) {
                                TongDaoUiCore.getRewardUnlockedListener().onSuccess(pageBean.getRewardList());
                            }

                            hideProgress();
                        }
                    }
                });
            }
        }, new OnErrorListener() {
            @Override
            public void onError(final TdErrorBean errorBean) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (!TdDialogActivity.this.isFinishing()) {
                            Toast.makeText(getApplicationContext(), "" + errorBean.getErrorCode() + ":" + errorBean.getErrorMsg(), Toast.LENGTH_SHORT).show();
                            TdDialogActivity.this.finish();
                        }
                    }
                });
            }
        });
    }

    private void makePromotionLandingViewPager(TdPageBean pageBean) {
        ArrayList<Fragment> fragmentList = new ArrayList<Fragment>();
        if (pageBean != null) {
            fragmentList.add(new TdPageFragment(this.display_out_w, this.display_in_w, this.close_wh, pageBean, imageManager));
        }

        promotionViewPager.setAdapter(new TdFragmentPagerAdapter(getSupportFragmentManager(), fragmentList));
    }

    private void closeImageManager() {
        if (imageManager != null) {
            imageManager.setExitTasksEarly(true);
            imageManager.closeCache();
        }
    }

    public void displayProgress() {
        if (!this.isFinishing() && promotionProgressBar != null) {
            promotionProgressBar.setVisibility(View.VISIBLE);
        }
    }

    public void hideProgress() {
        if (!this.isFinishing() && promotionProgressBar != null) {
            promotionProgressBar.setVisibility(View.GONE);
        }
    }
}
