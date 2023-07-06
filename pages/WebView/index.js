import { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Button, Platform ,BackHandler} from 'react-native'
import { WebView, } from 'react-native-webview';

let backButtonEnabled = false

export default function Web({ navigation }) {
    
    const webViewRef = useRef(null)
    const onNavigationStateChange = navState => {
        backButtonEnabled = navState.canGoBack
    };

    useEffect(() => {
        addBackAndroidListener()
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => _goBackPage()}
                    title="返回"
                    color="#000"
                />
            ),
            // goBackPage: _goBackPage
        });
    }, [])



    const _goBackPage = () => {
        //  官网中描述:backButtonEnabled: false,表示webView中没有返回事件，为true则表示该webView有回退事件
        if (backButtonEnabled) {
            webViewRef.current.goBack();
        } else {//否则返回到上一个页面
            navigation.goBack();
        }
    }


    // 监听原生返回键事件
    const addBackAndroidListener = (navigator) => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
        }
    }

    const onBackAndroid = () => {
        if (backButtonEnabled) {
            webViewRef.current.goBack();
            return true;
        } else {
            return false;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                source={{ uri: 'https://m.ezquant.cn' }}
                style={{ flex: 1 }}
                onNavigationStateChange={onNavigationStateChange}
                ref={webViewRef}
            />
        </SafeAreaView>
    )


}