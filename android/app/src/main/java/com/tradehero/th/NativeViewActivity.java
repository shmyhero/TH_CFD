package com.tradehero.th;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.widget.TextView;

import butterknife.ButterKnife;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class NativeViewActivity extends AppCompatActivity {

    public static final String START_FRAGMENT_NAME = "fragmentName";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.native_activity_container);

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
    }

    private void setupToolbar(Toolbar toolbar, String title, String leftText) {
        TextView tvHeadLeft = (TextView) toolbar.findViewById(R.id.tvHeadLeft);
        TextView tvHeadMiddleMain = (TextView) toolbar.findViewById(R.id.tvHeadMiddleMain);

        tvHeadLeft.setText(leftText);
        tvHeadMiddleMain.setText(title);
    }
}
