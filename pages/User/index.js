import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Alert ,DeviceEventEmitter} from 'react-native';
import banner from './images/grzxbj.png'
import arrow from './images/grarrow.png'
import server_icon from './images/icon_server.png'
import dzs_icon from './images/dzs.png'
import default_avatar from './images/default.jpeg'
import xxzx_icon from './images/xxzx.png'
import wddd_icon from './images/wddd.png'


import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, Toast, Provider } from '@ant-design/react-native';

export default function User({ navigation }) {
    const [userInfo, setUserInfo] = useState({})

    const onNav = (url) => {
        navigation.navigate(url)
    }

    useEffect(() => {
        // Toast.success("agagaga")
        resetUserInfo()

    }, [])

    const resetUserInfo = () => {
        AsyncStorage.getItem("userInfo").then(res => {
            if (res) {
                const userInfo = JSON.parse(res)
                setUserInfo(userInfo)
            }
        })
    }

    const receiveUserinfo = (res) => {
        setUserInfo(res)
        DeviceEventEmitter.emit('refreshHome');
        DeviceEventEmitter.emit('refreshStrategyList');
    }

    const onLogout = () => {
        Alert.alert(
            "提示",
            "确定要退出登录吗？",
            [
                { text: "取消", onPress: () => console.log("cancel") },
                { text: "确定", onPress: () => confirmLogout() }
            ]
        );
    }
    const confirmLogout = () => {
        AsyncStorage.removeItem("userInfo").then(res => {
            setUserInfo({})
            DeviceEventEmitter.emit('refreshHome');
            DeviceEventEmitter.emit('refreshStrategyList');
            Toast.success("退出登录成功")
        })
    }

    return (

        <View style={styles.container}>
            <View>
                <Image
                    source={banner} style={styles.banner}
                />
                {userInfo.username ?
                    <View style={styles.avatarWrap}>
                        <Image
                            source={{ uri: userInfo.portrait }} style={styles.avatar}
                        />
                        <Text style={styles.login}>{userInfo.nickname}</Text>
                    </View>
                    :
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('login', { receiveUserinfo: receiveUserinfo })}>
                        <View style={styles.avatarWrap}>
                            <Image
                                source={default_avatar} style={styles.avatar}
                            />
                            <Text style={styles.login}>请登录</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }


                {/* <Image resizeMode="stretch" source={{uri:"https://img.spd9.com/admin/upload/lpb/zxkf_02.png"}} style={styles.banner}/> */}
                <View style={styles.listWrap}>
                    <TouchableOpacity onPress={() => {
                         AsyncStorage.getItem("userInfo").then(res => {
                            if (res) {
                                onNav('userMessage')
                            } else {
                                Alert.alert(
                                    "提示",
                                    "请先登录",
                                    [
                                        { text: "确定", onPress: () => { } }
                                    ]
                                );
                            }
                        })
                    }}>
                        <View style={styles.listItem}>
                            <View style={styles.listItemName}>
                                <Image source={xxzx_icon} style={styles.listItemIcon} />
                                <Text style={styles.listItemText}>消息通知</Text>
                            </View>
                            <Image source={arrow} style={styles.arrow} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        AsyncStorage.getItem("userInfo").then(res => {
                            if (res) {
                                onNav('userSubscribe')
                            } else {
                                Alert.alert(
                                    "提示",
                                    "请先登录",
                                    [
                                        { text: "确定", onPress: () => { } }
                                    ]
                                );
                            }
                        })
                    }}>
                        <View style={styles.listItem}>
                            <View style={styles.listItemName}>
                                <Image source={wddd_icon} style={styles.listItemIcon} />
                                <Text style={styles.listItemText}>我的订阅</Text>
                            </View>
                            <Image source={arrow} style={styles.arrow} />
                        </View>
                    </TouchableOpacity>
                   

                    {/* <TouchableOpacity onPress={() => onNav('classicList')}>
                        <View style={styles.listItem}>
                            <View style={styles.listItemName}>
                                <Image source={dzs_icon} style={styles.listItemIcon} />
                                <Text style={styles.listItemText}>经典战法大全</Text>
                            </View>
                            <Image source={arrow} style={styles.arrow} />
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => onNav('在线客服')}>
                        <View style={styles.listItem}>
                            <View style={styles.listItemName}>
                                <Image source={server_icon} style={styles.listItemIcon} />
                                <Text style={styles.listItemText}>在线客服</Text>
                            </View>
                            <Image source={arrow} style={styles.arrow} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {userInfo.username ?
                <TouchableWithoutFeedback onPress={() => onLogout()} >
                    <View style={styles.logout}>
                        <Text style={styles.listItemText}>退出登录</Text>
                    </View>
                </TouchableWithoutFeedback> : null
            }


        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        justifyContent: "space-between"
    },
    banner: {
        width: "100%",
        height: 180
    },
    login: {
        // textAlign: "center",
        marginTop: 10,
        color: "#fff",
        fontSize: 16
    },
    avatarWrap: {
        alignItems: "center",
        position: "absolute",
        left: 0,
        right: 0,
        top: 20
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    listWrap: {
        padding: 10
    },
    listItem: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: "#fff",
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    arrow: {
        width: 10,
        height: 20
    },
    listItemText: {
        fontSize: 16
    },
    listItemIcon: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    listItemName: {
        flexDirection: "row",
        alignItems: "center"
    },
    logout: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: "#fff",
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    }


});