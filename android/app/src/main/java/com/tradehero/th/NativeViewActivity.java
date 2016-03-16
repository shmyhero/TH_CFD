package com.tradehero.th;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;

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
    }
}
