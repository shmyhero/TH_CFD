package com.tongdao.sdk.interfaces.ui;

import java.util.ArrayList;

import com.tongdao.sdk.beans.TdRewardBean;

public interface OnRewardUnlockedListener {

    public void onSuccess(ArrayList<TdRewardBean> rewards);

}
