package com.tradehero.cfd;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.ReactContext;
import com.mobeta.android.dslv.DragSortListView;
import com.tradehero.cfd.RNNativeModules.NativeActions;
import com.tradehero.cfd.RNNativeModules.NativeDataModule;
import com.tradehero.cfd.module.LogicData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class StockEditFragment extends Fragment {

    @Bind(R.id.stockList)
    DragSortListView list;
    @Bind(R.id.selectAll)
    TextView selectAll;
    @Bind(R.id.deleteSelected)
    TextView deleteSelected;

    private boolean selectAllPicked = false;

    private StockListAdapter adapter;
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

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.stock_edit, container, false);
        ButterKnife.bind(this, view);

        final JSONArray myListArray = LogicData.getInstance().getMyList();
        List<StockInfo> stockInfo = generateStockInfoList(myListArray);

        adapter = new StockListAdapter(getActivity(), R.layout.list_item_checkable, stockInfo);

        list.setAdapter(adapter);
        list.setDropListener(onDrop);

        selectAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (selectAllPicked) {
                    selectAllPicked = false;
                    adapter.markAllUnchecked();
                    selectAll.setText(R.string.select_all);
                } else {
                    adapter.markAllChecked();
                    selectAllPicked = true;
                    selectAll.setText(R.string.cancel);
                }

            }
        });

        deleteSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getActivity());
                alertDialogBuilder
                        .setTitle(R.string.dialog_title)
                        .setMessage(R.string.remove_hint_message)
                        .setCancelable(true)
                        .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton(R.string.confirm, new DialogInterface.OnClickListener() {
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

        final NativeViewActivity activity = (NativeViewActivity) getActivity();
        activity.setHeadLeftCallback(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                JSONArray result = new JSONArray();

                try {
                    for (int i = 0; i < adapter.getCount(); i ++) {
                        StockInfo info = adapter.getItem(i);

                        for (int j = 0; j < myListArray.length(); j ++) {
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

                ReactContext context = RNManager.getInstanceManager(getActivity().getApplication()).getCurrentReactContext();

                NativeDataModule.passDataToRN(context, NativeActions.ACTION_SEND_MY_LIST, result.toString());

                activity.finish();
            }
        });

        return view;
    }

    public List<StockInfo> generateStockInfoList(JSONArray myList) {
        List<StockInfo> result = new ArrayList<>();

        try {
            for (int i = 0; i < myList.length(); i++) {
                JSONObject oneItem = myList.getJSONObject(i);

                StockInfo info = new StockInfo(oneItem.getString("name"), oneItem.getString("symbol"));
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
            deleteSelected.setText(getResources().getText(R.string.delete) + "(" + checkNumber + ")");
        } else {
            deleteSelected.setEnabled(false);
            deleteSelected.setText(getResources().getText(R.string.delete));
        }
    }

    private void updateSelectAllButton() {
        if (selectAllPicked && adapter.getCheckedNum() == 0) {
            selectAllPicked = false;
            selectAll.setText(R.string.select_all);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        ButterKnife.unbind(this);
    }

    class StockInfo {
        boolean mChecked;
        String mName;
        String mSymbol;

        public StockInfo(String name, String symbol) {
            mName = name;
            mSymbol = symbol;
            mChecked = false;
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
            ViewGroup notificationSwitch = (ViewGroup) view.findViewById(R.id.notificationSwitch);

            checkBox.setChecked(mStockInfo.get(position).mChecked);
            name.setText(mStockInfo.get(position).mName);
            symbol.setText(mStockInfo.get(position).mSymbol);

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
                    Toast.makeText(getActivity(), R.string.pushed_to_top, Toast.LENGTH_SHORT).show();
                }
            });

            notificationSwitch.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //TODO
                }
            });

            return view;
        }

        public StockInfo remove(int index) {
            return mStockInfo.remove(index);
        }

        public void insert(StockInfo item, int to) {
            mStockInfo.add(to, item);
            notifyDataSetChanged();
        }

        public int getCheckedNum() {
            int result = 0;
            Iterator<StockInfo> iterator = mStockInfo.iterator();
            while (iterator.hasNext()) {
                if (iterator.next().mChecked) {
                    result ++;
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
            notifyDataSetChanged();
        }

        public void markAllUnchecked() {
            Iterator<StockInfo> iterator = mStockInfo.iterator();
            while (iterator.hasNext()) {
                StockInfo info = iterator.next();
                info.mChecked = false;
            }

            updateDeleteButton();
            notifyDataSetChanged();
        }

        public void deleteChecked() {
            for (int i = mStockInfo.size() - 1; i >= 0; i --) {
                if (mStockInfo.get(i).mChecked) {
                    mStockInfo.remove(i);
                }
            }

            notifyDataSetChanged();
        }
    }
}
