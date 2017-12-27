package com.tradehero.cfd.views;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.SystemClock;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.mobeta.android.dslv.DragSortListView;
import com.tradehero.cfd.R;
import com.tradehero.cfd.RNNativeModules.NativeActions;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;
import com.tradehero.cfd.module.LogicData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class ReactStockEditFragmentNative extends RelativeLayout {

    private Context mContext;
    EventDispatcher mEventDispatcher;
    private boolean isLogin = false;
    private boolean isAcutal = false;
    private boolean isLanguageEn = false;
    public static ReactStockEditFragmentNative instance = null;

    public RelativeLayout rlTop;

    public ReactStockEditFragmentNative(Context context) {
        this(context, null);
    }

    public ReactStockEditFragmentNative(Context context, AttributeSet attrs) {
        super(context, attrs);

        this.mContext = context;
        LayoutInflater.from(context).inflate(R.layout.stock_edit_native_content, this, true);
        instance = this;
    }

    public void refresh() {
        adapter.notifyDataSetChanged();
        action(100);
    }

    public void setEventDispatcher(EventDispatcher eventDispatcher) {
        this.mEventDispatcher = eventDispatcher;
    }

    protected void action(int id) {
        mEventDispatcher.dispatchEvent(
                new NativeRefreshEvent(getId(), SystemClock.uptimeMillis(), id));
    }


    private DragSortListView list;
    private TextView selectAll;
    private TextView deleteSelected;
    private boolean selectAllPicked = false;
    private StockListAdapter adapter;
    private List<StockInfo> stockInfo;
    private JSONArray myListArray;
    private JSONArray myAlertListArray;
    private LinearLayout notificationSwitch;

    private TextView tvAllProduct;
    private TextView tvNotification;
    private TextView tvDrag;
    private TextView tvPushToTop;

    public void initView() {
        list = (DragSortListView) findViewById(R.id.stockList);
        selectAll = (TextView) findViewById(R.id.selectAll);
        deleteSelected = (TextView) findViewById(R.id.deleteSelected);
        notificationSwitch = (LinearLayout) findViewById(R.id.notificationSwitch);
        rlTop = (RelativeLayout) findViewById(R.id.rlTop);

        tvAllProduct = (TextView)findViewById(R.id.tvAllProduct);
        tvNotification= (TextView)findViewById(R.id.tvNotification);
        tvDrag= (TextView)findViewById(R.id.tvDrag);
        tvPushToTop= (TextView)findViewById(R.id.tvPushToTop);

        myListArray = LogicData.getInstance().getMyList();
        myAlertListArray = LogicData.getInstance().getMyAlertList();

        stockInfo = generateStockInfoList(myListArray, myAlertListArray);
        adapter = new StockListAdapter(mContext, R.layout.list_item_checkable, stockInfo);
        list.setAdapter(adapter);

        list.setDropListener(onDrop);

        selectAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (selectAllPicked) {
                    selectAllPicked = false;
                    adapter.markAllUnchecked();
                    selectAll.setText(isLanguageEn?R.string.select_all_en:R.string.select_all);
                } else {
                    adapter.markAllChecked();
                    selectAllPicked = true;
                    selectAll.setText(isLanguageEn?R.string.cancel_en:R.string.cancel);
                }

            }
        });

        deleteSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(mContext);
                alertDialogBuilder
                        .setTitle(isLanguageEn?R.string.dialog_title_en:R.string.dialog_title)
                        .setMessage(isLanguageEn?R.string.remove_hint_message_en:R.string.remove_hint_message)
                        .setCancelable(true)
                        .setNegativeButton(isLanguageEn?R.string.cancel_en:R.string.cancel, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton(isLanguageEn?R.string.confirm_en:R.string.confirm, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                adapter.deleteChecked();
                                updateDeleteButton();
                            }
                        });

                AlertDialog alertDialog = alertDialogBuilder.create();
                alertDialog.show();
                alertDialog.setCanceledOnTouchOutside(true);
            }
        });


    }


    private DragSortListView.DropListener onDrop =
            new DragSortListView.DropListener() {
                @Override
                public void drop(int from, int to) {
                    if (from != to) {
                        StockInfo item = adapter.remove(from);
                        adapter.insert(item, to);
                        list.moveCheckState(from, to);
                    }
                }
            };


    public List<StockInfo> generateStockInfoList(JSONArray myList, JSONArray myAlertList) {
        List<StockInfo> result = new ArrayList<>();

        try {
            for (int i = 0; i < myList.length(); i++) {
                JSONObject oneItem = myList.getJSONObject(i);
                boolean isAlert = false;

                if (myAlertList != null) {
                    for (int j = 0; j < myAlertList.length(); j++) {
                        JSONObject alertItem = myAlertList.getJSONObject(j);
                        if (oneItem.getInt("id") == alertItem.getInt("SecurityId")) {
                            if (alertItem.getBoolean("HighEnabled") || alertItem.getBoolean("LowEnabled")) {
                                isAlert = true;
                            }
                        }
                    }
                }

                StockInfo info = new StockInfo(oneItem.getString("name"), oneItem.getString("symbol"), oneItem.getInt("id"), isAlert);
                result.add(info);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return result;
    }

    private void updateDeleteButton() {
        int checkNumber = adapter.getCheckedNum();
        if (checkNumber > 0) {
            deleteSelected.setEnabled(true);
            deleteSelected.setText(getResources().getText(isLanguageEn?R.string.delete_en:R.string.delete) + "(" + checkNumber + ")");
        } else {
            deleteSelected.setEnabled(false);
            deleteSelected.setText(getResources().getText(isLanguageEn?R.string.delete_en:R.string.delete));
        }
    }

    private void updateSelectAllButton() {
        if (selectAllPicked && adapter.getCheckedNum() == 0) {
            selectAllPicked = false;
            selectAll.setText(isLanguageEn?R.string.select_all_en:R.string.select_all);
        }
    }

    public void makeDataRefresh() {
        myAlertListArray = LogicData.getInstance().getMyAlertList();
        if (stockInfo != null && myAlertListArray != null) {
            for (int i = 0; i < stockInfo.size(); i++) {
                for (int j = 0; j < myAlertListArray.length(); j++) {
                    try {

                        if (stockInfo.get(i).mId == myAlertListArray.getJSONObject(j).getInt("SecurityId")) {
                            JSONObject alertItem = myAlertListArray.getJSONObject(j);
                            boolean isAlert = false;
                            if (alertItem.getBoolean("HighEnabled") || alertItem.getBoolean("LowEnabled")) {
                                isAlert = true;
                            }
                            stockInfo.get(i).mIsAlert = isAlert;
                        }
                    } catch (Exception e) {
                        Log.e("makeDataRefresh  e ==> ", e.toString());
                    }
                }
            }
        }

        refresh();
    }


    class StockInfo {
        boolean mChecked;
        String mName;
        String mSymbol;
        boolean mIsAlert;
        int mId;

        public StockInfo(String name, String symbol, int id, boolean isAlert) {
            mName = name;
            mSymbol = symbol;
            mId = id;
            mChecked = false;
            mIsAlert = isAlert;
        }
    }

    class StockListAdapter extends BaseAdapter {

        private LayoutInflater mInflater;
        private int mResource;
        private List<StockInfo> mStockInfo;

        public StockListAdapter(Context context, int resource, List<StockInfo> stockInfo) {
            super();
            mInflater = LayoutInflater.from(context);
            mResource = resource;
            mStockInfo = stockInfo;
        }

        @Override
        public int getCount() {
            return mStockInfo.size();
        }

        @Override
        public StockInfo getItem(int position) {
            return mStockInfo.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(final int position, View convertView, ViewGroup parent) {
            View view = mInflater.inflate(mResource, parent, false);

            CheckBox checkBox = (CheckBox) view.findViewById(R.id.checkbox);
            TextView name = (TextView) view.findViewById(R.id.name);
            TextView symbol = (TextView) view.findViewById(R.id.symbol);
            ViewGroup pushToTop = (ViewGroup) view.findViewById(R.id.pushToTop);
            ImageView ImgToTop = (ImageView) view.findViewById(R.id.ImgToTop);
            ViewGroup notificationSwitch = (ViewGroup) view.findViewById(R.id.notificationSwitch);
            ImageView notifyIndicator = (ImageView) view.findViewById(R.id.notifyIndicator);

            checkBox.setChecked(mStockInfo.get(position).mChecked);
            checkBox.setBackground(isAcutal?getResources().getDrawable(R.drawable.stock_edit_checkbox_actual):getResources().getDrawable(R.drawable.stock_edit_checkbox));
//          checkBox.setBackgroundResource(isAcutal ? R.drawable.stock_edit_checkbox_actual : R.drawable.stock_edit_checkbox);
            name.setText(mStockInfo.get(position).mName);
            symbol.setText(mStockInfo.get(position).mSymbol);
            notifyIndicator.setBackgroundResource(mStockInfo.get(position).mIsAlert ? (isAcutal ? R.drawable.notification_on_actual : R.drawable.notification_on) : (isAcutal ? R.drawable.notification_off_actual : R.drawable.notification_off));
            ImgToTop.setBackgroundResource(isAcutal ? R.drawable.top_actual : R.drawable.top);

            checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    mStockInfo.get(position).mChecked = isChecked;
                    updateDeleteButton();
                    updateSelectAllButton();
                }
            });

            pushToTop.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    StockInfo info = remove(position);
                    insert(info, 0);
                    Toast.makeText(mContext, isLanguageEn?R.string.pushed_to_top_en:R.string.pushed_to_top, Toast.LENGTH_SHORT).show();
                }
            });

            if (isLogin) {
                notificationSwitch.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //TODO
                        setAlert(mStockInfo.get(position));
                    }
                });
            }

            if (!isLogin) {
                notificationSwitch.setVisibility(View.GONE);
            }

            return view;
        }

        public StockInfo remove(int index) {
            return mStockInfo.remove(index);
        }

        public void setAlert(StockInfo item) {
            mEventDispatcher.dispatchEvent(
                    new TapAlertEvent(getId(), SystemClock.uptimeMillis(), item.mId));
        }

        public void insert(StockInfo item, int to) {
            mStockInfo.add(to, item);
            refresh();
        }

        public int getCheckedNum() {
            int result = 0;
            Iterator<StockInfo> iterator = mStockInfo.iterator();
            while (iterator.hasNext()) {
                if (iterator.next().mChecked) {
                    result++;
                }
            }

            return result;
        }

        public void markAllChecked() {
            Iterator<StockInfo> iterator = mStockInfo.iterator();
            while (iterator.hasNext()) {
                StockInfo info = iterator.next();
                info.mChecked = true;
            }

            updateDeleteButton();
            refresh();
        }

        public void markAllUnchecked() {
            Iterator<StockInfo> iterator = mStockInfo.iterator();
            while (iterator.hasNext()) {
                StockInfo info = iterator.next();
                info.mChecked = false;
            }

            updateDeleteButton();
            refresh();
        }

        public void deleteChecked() {
            for (int i = mStockInfo.size() - 1; i >= 0; i--) {
                if (mStockInfo.get(i).mChecked) {
                    mStockInfo.remove(i);
                }
            }

            refresh();
        }
    }


    public static class NativeRefreshEvent extends Event<NativeRefreshEvent> {

        public static final String EVENT_NAME = "NativeRefreshEvent";

        private final int mValue;

        protected NativeRefreshEvent(int viewTag, long timestampMs, int value) {
            super(viewTag);
            mValue = value;
        }

        @Override
        public String getEventName() {
            return EVENT_NAME;
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
        }

        private WritableMap serializeEventData() {
            WritableMap eventData = Arguments.createMap();
            eventData.putInt("data", mValue);
            return eventData;
        }
    }

    public static class TapAlertEvent extends Event<TapAlertEvent> {

        public static final String EVENT_NAME = "TapAlertEvent";

        private final int mValue;//Stock id is int like 黄金 mValue is 34821

        protected TapAlertEvent(int viewTag, long timestampMs, int value) {
            super(viewTag);
            mValue = value;
        }

        @Override
        public String getEventName() {
            return EVENT_NAME;
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
        }

        private WritableMap serializeEventData() {
            WritableMap eventData = Arguments.createMap();
            eventData.putInt("data", mValue);
            return eventData;
        }
    }


    protected void saveStockData() {
        JSONArray result = new JSONArray();
        try {
            for (int i = 0; i < adapter.getCount(); i++) {
                StockInfo info = adapter.getItem(i);

                for (int j = 0; j < myListArray.length(); j++) {
                    JSONObject stockObject = myListArray.getJSONObject(j);

                    if (stockObject.getString("name").equals(info.mName)) {
                        result.put(stockObject);
                        break;
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        NativeDataModule.passDataToRN((ReactContext) mContext, NativeActions.ACTION_SEND_MY_LIST, result.toString());
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        saveStockData();
    }

    public void setIsLogin(boolean isLogin) {
        this.isLogin = isLogin;

        if (notificationSwitch != null && !isLogin) {
            notificationSwitch.setVisibility(View.GONE);
        }
    }

    public void setIsLanguageEn(boolean isEn){
        this.isLanguageEn = isEn;
        Log.d("setIsLanguageEn","==>"+isEn);
        updateDeleteButton();
        updateSelectAllButton();
        updateTopTextView();
    }

    public void updateTopTextView(){
        tvAllProduct.setText(isLanguageEn?R.string.all_product_en:R.string.all_product);
        tvDrag.setText(isLanguageEn?R.string.drag_en:R.string.drag);
        tvNotification.setText(isLanguageEn?R.string.notification_switch_en:R.string.notification_switch);
        tvPushToTop.setText(isLanguageEn?R.string.pushed_to_top_en:R.string.pushed_to_top);
        selectAll.setText(isLanguageEn?R.string.select_all_en:R.string.select_all);
        selectAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (selectAllPicked) {
                    selectAllPicked = false;
                    adapter.markAllUnchecked();
                    selectAll.setText(isLanguageEn?R.string.select_all_en:R.string.select_all);
                } else {
                    adapter.markAllChecked();
                    selectAllPicked = true;
                    selectAll.setText(isLanguageEn?R.string.cancel_en:R.string.cancel);
                }

            }
        });
    }

    public void setIsActual(boolean isActual) {
        this.isAcutal = isActual;
//        Toast.makeText(getContext(), "isActual = " + isActual, Toast.LENGTH_SHORT).show();
        if (isActual) {
            rlTop.setBackgroundResource(R.color.title_blue2);
            selectAll.setBackground(getResources().getDrawable(R.drawable.blue_button2));
        }
    }

    public void setAlertData(String alertData) {
        LogicData.getInstance().setData(LogicData.MY_ALERT_LIST, alertData);
        makeDataRefresh();
    }

}
