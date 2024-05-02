import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Hàm để mở URL trong trình duyệt Chrome
async function openInChrome(url: string, navigation: any) {
  try {
    if (await InAppBrowser.isAvailable()) {
      console.log('InAppBrowser is available!');
      const result = await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#453AA4',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: '#6200EE',
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        headers: {
          'my-custom-header': 'my custom header value',
        },
      });
      await sleep(800);
      if (result.type === 'cancel') {
        navigation.navigate('Sản phẩm');
      }
    } else {
      console.log('InAppBrowser is not available!');
      Linking.openURL(url);
    }
  } catch (error) {
    console.error(error);
  }
}
export default openInChrome;

// Sử dụng hàm openInChrome để mở URL trong trình duyệt Chrome
