package com.tongdao.sdk.fragment.ui;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.tongdao.sdk.beans.TdPageBean;
import com.tongdao.sdk.customer.ui.TdTopCropImageView;
import com.tongdao.sdk.imagetools.ui.TdImageManager;
import com.tongdao.sdk.ui.R;

public class TdPageFragment extends Fragment {
    private TdPageBean pageBean;
    private TdImageManager imageManager;
    private TdTopCropImageView coverImageView;
    private RelativeLayout lq_page_out_container;
    private ImageView lq_page_close_iv;
    private int display_out_w;
    private int display_in_w;
    private int close_wh;

    public TdPageFragment(int display_out_w, int display_in_w, int close_wh, TdPageBean pageBean, TdImageManager imageManager) {
        this.display_out_w = display_out_w;
        this.display_in_w = display_in_w;
        this.close_wh = close_wh;
        this.pageBean = pageBean;
        this.imageManager = imageManager;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.td_promotion_landing_page, container, false);
        initMainComponent(rootView);
        return rootView;
    }

    private void initMainComponent(View rootView) {
        //for download the cover img
        lq_page_out_container = (RelativeLayout) rootView.findViewById(R.id.lq_page_out_container);
        coverImageView = (TdTopCropImageView) rootView.findViewById(R.id.lq_promotion_item_iv);
        lq_page_close_iv = (ImageView) rootView.findViewById(R.id.lq_page_close_iv);

        //for out container
        RelativeLayout.LayoutParams outPara = (RelativeLayout.LayoutParams) lq_page_out_container.getLayoutParams();
        outPara.width = this.display_out_w;
        outPara.height = this.display_out_w;
        lq_page_out_container.setLayoutParams(outPara);

        //for image view
        RelativeLayout.LayoutParams inImgPara = (RelativeLayout.LayoutParams) coverImageView.getLayoutParams();
        inImgPara.width = this.display_in_w;
        inImgPara.height = this.display_in_w;
        coverImageView.setLayoutParams(inImgPara);

        //for close image view
        RelativeLayout.LayoutParams closeImgPara = (RelativeLayout.LayoutParams) lq_page_close_iv.getLayoutParams();
        closeImgPara.width = this.close_wh;
        closeImgPara.height = this.close_wh;
        lq_page_close_iv.setLayoutParams(closeImgPara);

        lq_page_close_iv.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                TdPageFragment.this.getActivity().finish();
            }
        });

        if (this.pageBean != null) {
            String imageUrl = this.pageBean.getImage();
            if (imageUrl != null && !imageUrl.trim().equals("")) {
                this.imageManager.loadImage(imageUrl, coverImageView, false, 1, null, null);
            }
        }
    }

}
