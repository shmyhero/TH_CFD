package com.tradehero.cfd;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnativecomponent.swiperefreshlayout.RCTSwipeRefreshLayoutPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.tradehero.cfd.RNNativeModules.RNNativePackage;
import com.tradehero.cfd.qrcodeReader.RCTQRCodeLocalImagePackage;
import com.tradehero.cfd.talkingdata.TalkingDataPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import io.realm.react.RealmReactPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
//import com.remobile.qrcodeLocalImage.RCTQRCodeLocalImagePackage;

import java.util.Arrays;
import java.util.List;

import cn.reactnative.modules.update.UpdateContext;
import cn.reactnative.modules.update.UpdatePackage;
import cn.reactnative.modules.wx.WeChatPackage;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class RNManager {

    private static ReactInstanceManager gReactInstanceManager;

    public static List<ReactPackage> getRNPackages(){
        List<ReactPackage> packages = Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new WeChatPackage(),
                new RNNativePackage(),
                new ReactNativeWheelPickerPackage(),
                new LinearGradientPackage(),
                new UpdatePackage(),
                new RNFSPackage(),
                new ImagePickerPackage(),
                new TalkingDataPackage(),
                new RCTSwipeRefreshLayoutPackage(),
                new PickerViewPackage(),
                new CookieManagerPackage(),
                new RealmReactPackage(),
                new RNViewShotPackage(),
                new RCTQRCodeLocalImagePackage()
        );
        return packages;
    }

    public synchronized static ReactInstanceManager getInstanceManager(Application application) {
        if (gReactInstanceManager == null) {
            ReactInstanceManager.Builder builder = ReactInstanceManager.builder()
                    .setApplication(application)
                    .setJSMainModuleName("index.android")
                    .setUseDeveloperSupport(BuildConfig.DEBUG)
                    .setInitialLifecycleState(LifecycleState.BEFORE_RESUME);

            List<ReactPackage> packages = getRNPackages();

            for (ReactPackage reactPackage : packages) {
                builder.addPackage(reactPackage);
            }

            String jsBundleFile = UpdateContext.getBundleUrl(application);

            if (jsBundleFile != null) {
                builder.setJSBundleFile(UpdateContext.getBundleUrl(application));
            } else {
                builder.setBundleAssetName("index.android.bundle");
            }

            gReactInstanceManager = builder.build();
        }

        return gReactInstanceManager;
    }

    public synchronized static void destroyInstance() {
        gReactInstanceManager = null;
    }
}
