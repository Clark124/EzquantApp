import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, View, Text, Image } from 'react-native';
import * as Font from 'expo-font';
import { Provider } from '@ant-design/react-native';



import homeIcon from './assets/sy.png'
import homeIconActive from './assets/sy_iconselected.png'
import signalIcon from './assets/jy.png'
import signalIconActive from './assets/mmxh_iconselected.png'
import wdIcon from './assets/wd.png'
import wdIconActive from './assets/wd_iconselected.png'
import classicIcon from './assets/jdzf_icon.png'
import classicIconActive from './assets/jdzf_iconselected.png'



import IndexScreen from './pages/Index'
import HomeScreen from './pages/HomeNew';
import StrategyScreen from './pages/Home'
import StrategyDetail from './pages/StrategyDetail'
import PrivacyPolicy from './pages/PrivacyPolicy';
import Agreement from './pages/Agreement'
import Traderoom from './pages/Traderoom';
import TraderoomNew from './pages/TraderoomNew';
import SearchSymbol from './pages/SearchCode';
import User from './pages/User'
import WebView from './pages/WebView';
import UserServer from './pages/UserServer'
import Login from './pages/Login';
import ClassicList from './pages/ClassicList'
// import ClassicDetail from './pages/ClassicDetail'
import UserMessage from './pages/UserMessage';
import UserSubscribe from './pages/UserSubscribe';
import HomeStatistics from './pages/HomeStatistics'
import ClassicRank from './pages/ClassicRank'
import ClassicSignalDetail from './pages/ClassicSignalDetail'

import { useEffect } from 'react';
// import UserClassicStrategy from './pages/UserClassicStrategy'


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === 'home') {
            return <Image source={focused ? homeIconActive : homeIcon} style={{ width: 30, height: 30 }} />
          } else if (route.name === '买卖信号') {
            return <Image source={focused ? signalIconActive : signalIcon} style={{ width: 30, height: 30 }} />
          } else if (route.name === 'user') {
            return <Image source={focused ? wdIconActive : wdIcon} style={{ width: 30, height: 30 }} />
          } else if (route.name === 'classicStrategy') {
            return <Image source={focused ? classicIconActive : classicIcon} style={{ width: 30, height: 30 }} />
          }
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 14 },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} options={{ title: '首页', }} />
      <Tab.Screen name="买卖信号" component={Traderoom} />
      <Tab.Screen name="classicStrategy" component={StrategyScreen} options={{ title: '经典战法', }}/>
      <Tab.Screen name="user" component={User} options={{ title: '我的', }} />

    </Tab.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    loadFont()
  }, [])

  const loadFont = async () => {
    await Font.loadAsync(
      'antoutline',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antoutline.ttf')
    );

    await Font.loadAsync(
      'antfill',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antfill.ttf')
    );
  }

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="contect"
        // screenOptions={{
        //   headerStyle: {
        //     backgroundColor: '#000',
        //   },

        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        //   headerBackTitle: "返回",
        //   headerBackVisible: true
        // }}
        >
          <Stack.Screen name="contect" component={IndexScreen} options={{ title: '' }}/>
          <Stack.Screen name="main" component={BottomTab} options={{ headerShown: false }} />
          <Stack.Screen name="战法详情" component={StrategyDetail} />
          <Stack.Screen name="隐私政策" component={PrivacyPolicy} />
          <Stack.Screen name="用户协议" component={Agreement} />
          <Stack.Screen name="search" component={SearchSymbol} options={{ title: '搜索' }}/>
          <Stack.Screen name="经典战法" component={WebView}
            options={{
              title: '经典战法',
            }}
          />
          <Stack.Screen name="在线客服" component={UserServer} />
          <Stack.Screen name="login" component={Login} options={{ title: '登录' }} />
          <Stack.Screen name="classicList" component={ClassicList} options={{ title: '经典战法大全' }} />
          {/* <Stack.Screen name="classicDetail" component={ClassicDetail} options={{ title: '经典战法详情' }} /> */}
          <Stack.Screen name="userMessage" component={UserMessage} options={{ title: '消息通知' }} />
          <Stack.Screen name="userSubscribe" component={UserSubscribe} options={{ title: '我的订阅' }} />
          <Stack.Screen name="homeStatistics" component={HomeStatistics} options={{ title: '每日统计' }} />
          <Stack.Screen name="traderoomNew" component={TraderoomNew} options={{ title: '买卖信号' }} />
          <Stack.Screen name="classicRank" component={ClassicRank} options={{ title: '买卖信号排行' }} />
          <Stack.Screen name="classicSignalDetail" component={ClassicSignalDetail} options={{ title: '买卖信号详情' }} />
          {/* <Stack.Screen name="经典战法大全" component={UserClassicStrategy} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


