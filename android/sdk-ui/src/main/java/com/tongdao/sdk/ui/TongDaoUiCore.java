package com.tongdao.sdk.ui;

import java.util.ArrayList;
import java.util.Currency;
import java.util.Date;
import java.util.HashMap;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.tongdao.sdk.TongDao;
import com.tongdao.sdk.beans.TdErrorBean;
import com.tongdao.sdk.beans.TdMessageBean;
import com.tongdao.sdk.beans.TdOrder;
import com.tongdao.sdk.beans.TdOrderLine;
import com.tongdao.sdk.beans.TdProduct;
import com.tongdao.sdk.beans.TdSource;
import com.tongdao.sdk.enums.TdGender;
import com.tongdao.sdk.interfaces.OnDownloadInAppMessageListener;
import com.tongdao.sdk.interfaces.OnErrorListener;
import com.tongdao.sdk.interfaces.ui.OnRewardUnlockedListener;

public class TongDaoUiCore {

    private static final String PAGE_ID = "pageId";
    private static final String MESSAGE = "td_message";
    private static OnRewardUnlockedListener rewardUnlockedListener;

    /**
     * 初始化同道服务,请在onCreate方法中调用
     *
     * @param appContext 应用程序的上下文
     * @param appKey     开发者从同道平台获得的AppKey
     * @return boolean 同道服务的初始化结果
     */
    public static boolean init(Context appContext, String appKey) {
        return TongDao.init(appContext, appKey);
    }

    /**
     * 初始化同道服务,请在onCreate方法中调用
     *
     * @param appContext 应用程序的上下文
     * @param appKey     开发者从同道平台获得的AppKey
     *
     * @return boolean 同道服务的初始化结果
     */
    public static boolean init(Context appContext, String appKey, String userId) {
        return TongDao.init(appContext, appKey, userId);
    }

    /**
     *
     *
     */

    public static void setUserId(Context appContext, String userId){
        TongDao.setUserId(appContext, userId);
    }

    /**
     * 使用同道SDK生成userId
     *
     * @param appContext 应用程序的上下文
     * @return String 生成userId
     */
    public static String generateUserId(Context appContext) {
        return TongDao.generateDeviceId(appContext);
    }

    /**
     * 注册获得奖品的回调接口
     *
     * @param onRewardUnlockedListener 奖品的回调接口
     */
    public static void registerOnRewardUnlockedListener(OnRewardUnlockedListener onRewardUnlockedListener) {
        rewardUnlockedListener = onRewardUnlockedListener;
    }

    /**
     * 同道内部调用,不建议使用
     */
    public static OnRewardUnlockedListener getRewardUnlockedListener() {
        return rewardUnlockedListener;
    }

    /**
     * 跟踪用户自定义事件
     *
     * @param eventName 用户自定义事件名称(不能以!打头)
     * @param values    跟踪事件附带的键值对(值支持字符串和数字)
     */
    public static void track(String eventName, HashMap<String, Object> values) {
        TongDao.track(eventName, values);
    }

    /**
     * 开始记录用户的使用时长
     *
     * @param activity 当前应用程序的Activity
     */
    public static void onSessionStart(Activity activity) {
        TongDao.onSessionStart(activity);
    }

    /**
     * 开始记录用户的使用时长
     *
     * @param pageName 用户定义的页面名称
     */
    public static void onSessionStart(String pageName) {
        TongDao.onSessionStart(pageName);
    }

    /**
     * 终止记录用户的使用时长
     *
     * @param activity 当前应用程序的Activity
     */
    public static void onSessionEnd(Activity activity) {
        TongDao.onSessionEnd(activity);
    }

    /**
     * 终止记录用户的使用时长
     *
     * @param pageName 用户定义的页面名称
     */
    public static void onSessionEnd(String pageName) {
        TongDao.onSessionEnd(pageName);
    }

    /**
     * 保存用户多个自定义属性
     *
     * @param values 用户的属性键值对(值支持字符串和数字)
     */
    public static void identify(HashMap<String, Object> values) {
        TongDao.identify(values);
    }

    /**
     * 保存用户单个自定义属性
     *
     * @param name  属性名
     * @param value 属性值(值支持字符串和数字)
     */
    public static void identify(String name, Object value) {
        TongDao.identify(name, value);
    }

    /**
     * 保存用户的推送Token到同道平台，同道将根据用户Token推送信息
     *
     * @param push_token 用户的推送Token
     *                   (百度:onBind返回的channelId,
     *                   JPUSH:JPushInterface.EXTRA_REGISTRATION_ID,
     *                   GETUI:bundle.getString("clientid"))
     */
    public static void identifyPushToken(String push_token) {
        TongDao.identifyPushToken(push_token);
    }

    /**
     * 跟踪用户自定义事件
     *
     * @param eventName 用户自定义事件名称(不能以!打头)
     */
    public static void track(String eventName) {
        TongDao.track(eventName);
    }

    /**
     * 保存用户名字属性
     *
     * @param firstName 名
     * @param lastName  姓
     */
    public static void identifyFullName(String firstName, String lastName) {
        TongDao.identifyFullName(firstName, lastName);
    }

    /**
     * 保存用户全名
     *
     * @param fullName 用户全名
     */
    public static void identifyFullName(String fullName) {
        TongDao.identifyFullName(fullName);
    }

    /**
     * 保存用户应用中的名字
     *
     * @param userName 用户应用中的名字
     */
    public static void identifyUserName(String userName) {
        TongDao.identifyUserName(userName);
    }

    /**
     * 保存用户邮件地址
     *
     * @param email 用户邮件地址
     */
    public static void identifyEmail(String email) {
        TongDao.identifyEmail(email);
    }

    /**
     * 保存用户电话号码
     *
     * @param phoneNumber 用户电话号码
     */
    public static void identifyPhone(String phoneNumber) {
        TongDao.identifyPhone(phoneNumber);
    }

    /**
     * 保存用户性别
     *
     * @param gender 用户性别(枚举类型)
     */
    public static void identifyGender(TdGender gender) {
        TongDao.identifyGender(gender);
    }

    /**
     * 保存用户年龄
     *
     * @param age 用户年龄
     */
    public static void identifyAge(int age) {
        TongDao.identifyAge(age);
    }

    /**
     * 保存用户头像链接地址
     *
     * @param url 用户头像链接地址
     */
    public static void identifyAvatar(String url) {
        TongDao.identifyAvatar(url);
    }

    /**
     * 保存用户联系地址
     *
     * @param address 用户联系地址
     */
    public static void identifyAddress(String address) {
        TongDao.identifyAddress(address);
    }

    /**
     * 保存用户出生日期
     *
     * @param date 用户出生日期
     */
    public static void identifyBirthday(Date date) {
        TongDao.identifyBirthday(date);
    }

    /**
     * 保存用户应用源信息
     *
     * @param source 用户应用源信息对象
     */
    public static void identifySource(TdSource source) {
        TongDao.identifySource(source);
    }

    /**
     * 跟踪应用注册日期(使用当前系统时间,无日期参数)
     */
    public static void trackRegistration() {
        TongDao.trackRegistration();
    }

    /**
     * 跟踪应用注册日期
     *
     * @param date 用户设置的日期对象
     */
    public static void trackRegistration(Date date) {
        TongDao.trackRegistration(date);
    }

    /**
     * 跟踪应用评分
     *
     * @param rating 应用评分
     */
    public static void identifyRating(int rating) {
        TongDao.identifyRating(rating);
    }

    /**
     * 跟踪浏览商品类别
     *
     * @param category 商品类别
     */
    public static void trackViewProductCategory(String category) {
        TongDao.trackViewProductCategory(category);
    }

    /**
     * 跟踪浏览商品信息
     *
     * @param product 商品信息
     */
    public static void trackViewProduct(TdProduct product) {
        TongDao.trackViewProduct(product);
    }

    /**
     * 跟踪添加多个订单到购物车
     *
     * @param orderLines 订单列表
     */
    public static void trackAddCart(ArrayList<TdOrderLine> orderLines) {
        TongDao.trackAddCart(orderLines);
    }

    /**
     * 跟踪添加单个订单到购物车
     *
     * @param orderLine 单个订单
     */
    public static void trackAddCart(TdOrderLine orderLine) {
        TongDao.trackAddCart(orderLine);
    }

    /**
     * 跟踪从购物车删除多个订单
     *
     * @param orderLines 订单列表
     */
    public static void trackRemoveCart(ArrayList<TdOrderLine> orderLines) {
        TongDao.trackRemoveCart(orderLines);
    }

    /**
     * 跟踪从购物车删除单个订单
     *
     * @param orderLine 单个订单
     */
    public static void trackRemoveCart(TdOrderLine orderLine) {
        TongDao.trackRemoveCart(orderLine);
    }

    /**
     * 跟踪提交的交易信息
     *
     * @param order 交易信息
     */
    public static void trackPlaceOrder(TdOrder order) {
        TongDao.trackPlaceOrder(order);
    }

    /**
     * 跟踪提交的交易信息
     *
     * @param name     产品名称
     * @param price    产品单价
     * @param currency 产品货币
     * @param quantity 产品个数
     */
    public static void trackPlaceOrder(String name, float price, Currency currency, int quantity) {
        TongDao.trackPlaceOrder(name, price, currency, quantity);
    }

    /**
     * 跟踪提交的交易信息，产品个数默认为1
     *
     * @param name     产品名称
     * @param price    产品单价
     * @param currency 产品货币
     */
    public static void trackPlaceOrder(String name, float price, Currency currency) {
        TongDao.trackPlaceOrder(name, price, currency, 1);
    }

    /**
     * 显示广告(Intent含有附加信息：广告页面id,可直接显示广告信息)
     * 该方法建议在设置了Deeplink的Activity的onCreate方法下调用
     *
     * @param activity 设置了Deeplink的Activity
     */
    public static void displayAdvertisement(Activity activity) {
        String pageId = TongDao.getPageId(activity.getIntent());
        if (pageId != null) {
            Intent startIntent = new Intent(activity, TdDialogActivity.class);
            startIntent.putExtra(PAGE_ID, pageId);
            activity.startActivity(startIntent);
        }
    }

    /**
     * 显示应用最新的In App Message页面信息
     *
     * @param activity 需要显示In App Message页面信息的Activity
     */
    public static void displayInAppMessage(final Activity activity) {
        TongDao.downloadInAppMessages(new OnDownloadInAppMessageListener() {
            @Override
            public void onSuccess(final ArrayList<TdMessageBean> tdMessageBeanList) {
                if (tdMessageBeanList.size() > 0 && activity != null && !activity.isFinishing()) {
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Intent startIntent = new Intent(activity, TdMessageDialogActivity.class);
                            startIntent.putExtra(MESSAGE, tdMessageBeanList.get(0));
                            activity.startActivity(startIntent);
                        }
                    });
                }
            }
        }, new OnErrorListener() {
            @Override
            public void onError(final TdErrorBean errorBean) {
                if (activity != null && !activity.isFinishing()) {
                    activity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(activity.getApplicationContext(), "" + errorBean.getErrorCode() + ":" + errorBean.getErrorMsg(), Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            }
        });
    }

    /**
     * 跟踪用户打开了推送消息(已过时，请使用trackOpenPushMessage)
     *
     * @param extraData 推送消息的附加信息
     */
    public static void trackOpenMessage(String extraData) {
        TongDao.trackOpenMessage(extraData);
    }

    /**
     * 跟踪用户打开了推送消息
     *
     * @param extraData 推送消息的附加信息
     */
    public static void trackOpenPushMessage(String extraData) {
        TongDao.trackOpenPushMessage(extraData);
    }

    /**
     * 使用推送消息的附加信息打开应用，链接或网页
     *
     * @param extraData 推送消息的附加信息
     */
    public static void openPage(Context appcontext, String extraData) {
        TongDao.openPage(appcontext, extraData);
    }

    /**
     * 跟踪用户点击了应用内消息
     *
     * @param tdMessageBean 同道返回的TdMessageBean
     */
    public static void trackOpenInAppMessage(TdMessageBean tdMessageBean) {
        TongDao.trackOpenInAppMessage(tdMessageBean);
    }

    /**
     * 跟踪用户收到了应用内消息
     *
     * @param tdMessageBean 同道返回的TdMessageBean
     */
    public static void trackReceivedInAppMessage(TdMessageBean tdMessageBean) {
        TongDao.trackReceivedInAppMessage(tdMessageBean);
    }
}
