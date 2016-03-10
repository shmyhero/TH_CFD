package com.tradehero.th;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LandingFragment extends Fragment {

    private ReactInstanceManager mReactInstanceManager;

    @Bind(R.id.react_root_view)
    ReactRootView reactRootView;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.react_activity_container, container, false);
        ButterKnife.bind(this, view);

        mReactInstanceManager = RNManager.getInstanceManager(getActivity().getApplication());
        Bundle bundle = new Bundle();
        bundle.putString("initialPage", "landing");
        reactRootView.startReactApplication(mReactInstanceManager, "TH_CFD", null);

        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        ButterKnife.unbind(this);
    }

    @Override
    public void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    public void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(getActivity(), (MainActivity_old)getActivity());
        }
    }
}
