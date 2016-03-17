package com.tradehero.th;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.common.api.GoogleApiClient;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class NativeViewActivity extends AppCompatActivity {

    public static final String START_FRAGMENT_NAME = "fragmentName";
    @Bind(R.id.tvHeadLeft)
    TextView tvHeadLeft;
    @Bind(R.id.tvHeadLeftContainer)
    LinearLayout tvHeadLeftContainer;
    @Bind(R.id.tvHeadMiddleMain)
    TextView tvHeadMiddleMain;
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.native_activity_container);
        ButterKnife.bind(this);

        String fragmentClassName = getIntent().getExtras().getString(START_FRAGMENT_NAME);
        try {
            Class<?> cls = Class.forName(fragmentClassName);
            getSupportFragmentManager().beginTransaction().add(R.id.native_root_view, (Fragment) cls.newInstance()).commit();

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        Toolbar toolbar = (Toolbar) findViewById(R.id.th_toolbar);
        this.setSupportActionBar(toolbar);
        setupToolbar(toolbar, "我的自选", "完成");
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
    }

    public void setHeadLeftCallback(View.OnClickListener listener) {
        tvHeadLeftContainer.setOnClickListener(listener);
    }

    private void setupToolbar(Toolbar toolbar, String title, String leftText) {
        tvHeadLeft = (TextView) toolbar.findViewById(R.id.tvHeadLeft);
        tvHeadMiddleMain = (TextView) toolbar.findViewById(R.id.tvHeadMiddleMain);

        tvHeadLeft.setText(leftText);
        tvHeadMiddleMain.setText(title);
    }

    @Override
    public void onStart() {
        super.onStart();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client.connect();
        Action viewAction = Action.newAction(
                Action.TYPE_VIEW, // TODO: choose an action type.
                "NativeView Page", // TODO: Define a title for the content shown.
                // TODO: If you have web page content that matches this app activity's content,
                // make sure this auto-generated web page URL is correct.
                // Otherwise, set the URL to null.
                Uri.parse("http://host/path"),
                // TODO: Make sure this auto-generated app deep link URI is correct.
                Uri.parse("android-app://com.tradehero.th/http/host/path")
        );
        AppIndex.AppIndexApi.start(client, viewAction);
    }

    @Override
    public void onStop() {
        super.onStop();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        Action viewAction = Action.newAction(
                Action.TYPE_VIEW, // TODO: choose an action type.
                "NativeView Page", // TODO: Define a title for the content shown.
                // TODO: If you have web page content that matches this app activity's content,
                // make sure this auto-generated web page URL is correct.
                // Otherwise, set the URL to null.
                Uri.parse("http://host/path"),
                // TODO: Make sure this auto-generated app deep link URI is correct.
                Uri.parse("android-app://com.tradehero.th/http/host/path")
        );
        AppIndex.AppIndexApi.end(client, viewAction);
        client.disconnect();
    }
}
