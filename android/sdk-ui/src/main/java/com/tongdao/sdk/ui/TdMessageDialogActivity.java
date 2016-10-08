package com.tongdao.sdk.ui;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.tongdao.sdk.beans.TdMessageBean;
import com.tongdao.sdk.beans.TdMessageButtonBean;
import com.tongdao.sdk.imagetools.ui.TdDisplayUtil;
import com.tongdao.sdk.imagetools.ui.TdImageManager;
import com.tongdao.sdk.imagetools.ui.TdImageManager.ImageLoadListener;
import com.tongdao.sdk.imagetools.ui.TdUtils;
import com.tongdao.sdk.tools.ui.TdDisplayTool;

public class TdMessageDialogActivity extends Activity {

    private static final String MESSAGE = "td_message";
    private Handler displayHandler;
    private Runnable displayRunnable;
    private TranslateAnimation tempTranslateAnimation;
    private static final int DURATION = 500;
    private TdImageManager imageManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final TdMessageBean tempTdMessageBean = (TdMessageBean) this.getIntent().getSerializableExtra(MESSAGE);

        if (tempTdMessageBean.getLayout().equalsIgnoreCase("top")) {
            this.setContentView(R.layout.td_top_message);
            tempTranslateAnimation = new TranslateAnimation(Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, -1, Animation.RELATIVE_TO_SELF, 0);
        } else if (tempTdMessageBean.getLayout().equalsIgnoreCase("bottom")) {
            this.setContentView(R.layout.td_bottom_message);
            tempTranslateAnimation = new TranslateAnimation(Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, 1, Animation.RELATIVE_TO_SELF, 0);
        } else if (tempTdMessageBean.getLayout().equalsIgnoreCase("full")) {
            this.setContentView(R.layout.td_fullscreen_page);
            tempTranslateAnimation = new TranslateAnimation(Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, -1, Animation.RELATIVE_TO_SELF, 0);
        } else {
            tempTranslateAnimation = new TranslateAnimation(Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, 0, Animation.RELATIVE_TO_SELF, -1, Animation.RELATIVE_TO_SELF, 0);
        }

        tempTranslateAnimation.setDuration(DURATION);

        if (tempTdMessageBean.getLayout().equalsIgnoreCase("top") || tempTdMessageBean.getLayout().equalsIgnoreCase("bottom")) {
            ImageView tempImageArrow = (ImageView) this.findViewById(R.id.td_message_arrow);
            //click target
            final String type = tempTdMessageBean.getActionType();
            final String value = tempTdMessageBean.getActionValue();
            if (type != null && value != null) {
                tempImageArrow.setVisibility(View.VISIBLE);
                this.findViewById(R.id.td_message_root).setOnClickListener(new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //跟踪打开InAppMessage
                        TongDaoUiCore.trackOpenInAppMessage(tempTdMessageBean);
                        openPage(type, value);
                    }
                });
            } else {
                tempImageArrow.setVisibility(View.GONE);
            }

            //show message
            TextView tempTextView = (TextView) this.findViewById(R.id.td_message_tv);
            tempTextView.setText(tempTdMessageBean.getMessage() == null ? "" : tempTdMessageBean.getMessage());

            //show img or not
            ImageView tempImageView = (ImageView) this.findViewById(R.id.td_message_iv);
            String imageUrl = tempTdMessageBean.getImageUrl();
            if (imageUrl != null && !imageUrl.trim().equals("")) {
                tempImageView.setVisibility(View.VISIBLE);
                this.imageManager = new TdImageManager(this.getApplicationContext(), TdUtils.HTTP_CACHE_DIR);
                this.imageManager.loadImage(imageUrl, tempImageView, false, 1, null, null);
            } else {
                tempImageView.setVisibility(View.GONE);
            }

        } else if (tempTdMessageBean.getLayout().equalsIgnoreCase("full")) {
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    initFullScreen(tempTdMessageBean);
                }
            }, 150);
        }

        //auto close
        long displayTime = tempTdMessageBean.getDisplayTime();
        if (displayTime > 0) {
            displayHandler = new Handler();
            displayRunnable = new Runnable() {
                @Override
                public void run() {
                    if (!TdMessageDialogActivity.this.isFinishing()) {
                        TdMessageDialogActivity.this.finish();
                    }
                }
            };
            displayHandler.postDelayed(displayRunnable, displayTime * 1000);
        }

        if (tempTdMessageBean.getLayout().equalsIgnoreCase("top") || tempTdMessageBean.getLayout().equalsIgnoreCase("bottom") || tempTdMessageBean.getLayout().equalsIgnoreCase("full")) {
            this.findViewById(R.id.td_message_root).startAnimation(tempTranslateAnimation);
        } else {
            //ToDo
        }

        TongDaoUiCore.trackReceivedInAppMessage(tempTdMessageBean);
    }


    @SuppressWarnings("deprecation")
    private void initFullScreen(TdMessageBean tempTdMessageBean) {
        //just for testing
        int cutDp = TdDisplayUtil.getRawPixel(this.getApplicationContext(), 10);
        int width = this.findViewById(R.id.td_root_container).getWidth();
        int height = this.findViewById(R.id.td_root_container).getHeight();

        int[] datas = TdDisplayTool.configDisplayForFullScreen(getApplicationContext(), width, height, tempTdMessageBean.isPortrait());

        RelativeLayout lq_page_out_container = (RelativeLayout) this.findViewById(R.id.td_message_root);
        ImageView coverImageView = (ImageView) this.findViewById(R.id.lq_full_iv);
        FrameLayout lq_btn_container = (FrameLayout) this.findViewById(R.id.lq_btn_container);

        final ImageView lq_page_close_iv = (ImageView) this.findViewById(R.id.lq_page_close_iv);

        //for out container
        RelativeLayout.LayoutParams outPara = (RelativeLayout.LayoutParams) lq_page_out_container.getLayoutParams();
        outPara.width = datas[0];
        outPara.height = datas[1];
        lq_page_out_container.setLayoutParams(outPara);
        lq_page_out_container.setPadding(cutDp, cutDp, cutDp, cutDp);

        //for image view
        RelativeLayout.LayoutParams inImgPara = (RelativeLayout.LayoutParams) coverImageView.getLayoutParams();
        inImgPara.width = datas[0] - 2 * cutDp;
        inImgPara.height = datas[1] - 2 * cutDp;
        coverImageView.setLayoutParams(inImgPara);
        coverImageView.setPadding(datas[2] / 2, datas[2] / 2, datas[2] / 2, datas[2] / 2);

        RelativeLayout.LayoutParams framePara = (RelativeLayout.LayoutParams) lq_btn_container.getLayoutParams();
        framePara.width = datas[0] - 2 * cutDp;
        framePara.height = datas[1] - 2 * cutDp;
        lq_btn_container.setLayoutParams(framePara);
        lq_btn_container.setPadding(datas[2] / 2, datas[2] / 2, datas[2] / 2, datas[2] / 2);

        int realW = this.findViewById(R.id.lq_fake_view).getWidth() - 2 * cutDp - datas[2];
        int realH = this.findViewById(R.id.lq_fake_view).getHeight() - 2 * cutDp - datas[2];

        //for buttons
        initButtons(tempTdMessageBean, realW, realH);

        //for close image view
        RelativeLayout.LayoutParams closeImgPara = (RelativeLayout.LayoutParams) lq_page_close_iv.getLayoutParams();
        closeImgPara.width = datas[2];
        closeImgPara.height = datas[2];
        lq_page_close_iv.setLayoutParams(closeImgPara);
        lq_page_close_iv.setVisibility(View.VISIBLE);

        lq_page_close_iv.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                TdMessageDialogActivity.this.finish();
            }
        });

        String imageUrl = tempTdMessageBean.getImageUrl();
        if (imageUrl != null && !imageUrl.trim().equals("")) {
            this.imageManager = new TdImageManager(this.getApplicationContext(), TdUtils.HTTP_CACHE_DIR);
            this.imageManager.loadImage(imageUrl, coverImageView, false, 1, null, null);
        }


        String closeImageUrl = tempTdMessageBean.getCloseBtn();
        if (closeImageUrl != null && !closeImageUrl.trim().equals("")) {
            if (this.imageManager == null) {
                this.imageManager = new TdImageManager(this.getApplicationContext(), TdUtils.HTTP_CACHE_DIR);
            }
            this.imageManager.loadImage(closeImageUrl, lq_page_close_iv, false, 1, null, null, new ImageLoadListener() {

                @Override
                public void onLoadComplete() {
                    // TODO Auto-generated method stub
                }

                @Override
                public void onCancelled() {
                    if (!TdMessageDialogActivity.this.isFinishing()) {
                        lq_page_close_iv.setBackgroundDrawable(TdMessageDialogActivity.this.getResources().getDrawable(R.drawable.td_page_close));
                    }
                }
            });
        } else {
            lq_page_close_iv.setBackgroundDrawable(this.getResources().getDrawable(R.drawable.td_page_close));
        }

    }


    private void initButtons(final TdMessageBean tempTdMessageBean, int realW, int realH/*,int marginTopGap,int marginLeftGap*/) {
        for (int i = 0; i < tempTdMessageBean.getButtons().size(); i++) {
            final TdMessageButtonBean eachButton = tempTdMessageBean.getButtons().get(i);
            double rateX = eachButton.getRateX();
            double rateY = eachButton.getRateY();
            double rateW = eachButton.getRateW();
            double rateH = eachButton.getRateH();

            Button btn = null;
            if (i == 0) {
                btn = (Button) this.findViewById(R.id.td_btn1);
            } else if (i == 1) {
                btn = (Button) this.findViewById(R.id.td_btn2);
            }

            if (btn != null) {
                FrameLayout.LayoutParams btnPara = (FrameLayout.LayoutParams) btn.getLayoutParams();
                btnPara.width = (int) (rateW * realW);
                btnPara.height = (int) (rateH * realH);
                btnPara.setMargins((int) (rateX * realW), (int) (rateY * realH), 0, 0);
                btn.setLayoutParams(btnPara);
                btn.setBackgroundColor(Color.TRANSPARENT);
                btn.setVisibility(View.VISIBLE);

                btn.setOnClickListener(new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //跟踪打开InAppMessage
                        TongDaoUiCore.trackOpenInAppMessage(tempTdMessageBean);
                        openPage(eachButton.getActionType(), eachButton.getActionValue());
                    }
                });
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (this.tempTranslateAnimation != null) {
            this.tempTranslateAnimation.cancel();
        }

        closeImageManager();
        cancelHandler();
    }

    private void closeImageManager() {
        if (imageManager != null) {
            imageManager.setExitTasksEarly(true);
            imageManager.closeCache();
        }
    }

    private void cancelHandler() {
        if (displayHandler != null && displayRunnable != null) {
            displayHandler.removeCallbacks(displayRunnable);
        }
    }


    private void openPage(String type, String value) {
        if (type == null || value == null) {
            return;
        }

        if (type.equals("") || value.equals("")) {
            return;
        }

        if (type.equalsIgnoreCase("deeplink")) {
            Intent deepLinkIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(value));
            if (isIntentCallable(deepLinkIntent)) {
                this.startActivity(deepLinkIntent);
            }
        } else if (type.equalsIgnoreCase("url")) {
            Intent viewIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(value));
            this.startActivity(viewIntent);
        }
    }

    private boolean isIntentCallable(Intent intent) {
        return this.getApplicationContext().getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY).size() > 0;
    }

}
