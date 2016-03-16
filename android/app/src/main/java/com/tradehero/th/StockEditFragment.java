package com.tradehero.th;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

import com.mobeta.android.dslv.DragSortListView;

import java.util.ArrayList;
import java.util.Arrays;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class StockEditFragment extends Fragment {

    @Bind(R.id.stockList)
    DragSortListView list;

    private ArrayAdapter<String> adapter;
    private DragSortListView.DropListener onDrop =
            new DragSortListView.DropListener() {
                @Override
                public void drop(int from, int to) {
                    if (from != to) {
                        String item = adapter.getItem(from);
                        adapter.remove(item);
                        adapter.insert(item, to);
                        list.moveCheckState(from, to);
                    }
                }
            };

    private DragSortListView.RemoveListener onRemove =
            new DragSortListView.RemoveListener() {
                @Override
                public void remove(int which) {
                    String item = adapter.getItem(which);
                    adapter.remove(item);
                    list.removeCheckState(which);
                }
            };

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.stock_edit, container, false);
        ButterKnife.bind(this, view);

        String[] array = getResources().getStringArray(R.array.jazz_artist_names);
        ArrayList<String> arrayList = new ArrayList<String>(Arrays.asList(array));

        adapter = new ArrayAdapter<String>(getActivity(), R.layout.list_item_checkable, R.id.text, arrayList);

        list.setAdapter(adapter);
        list.setDropListener(onDrop);
        list.setRemoveListener(onRemove);

        return view;
    }
}
