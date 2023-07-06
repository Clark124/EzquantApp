import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, SafeAreaView, Alert ,DeviceEventEmitter} from 'react-native';
import { subscribeSignalClassicList, cancelSubSignalClassic } from '../../service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';
import { Toast } from '@ant-design/react-native';


export default function UserSubscribe() {

    const [dataList, setDataList] = useState([])

    useEffect(() => {
        onGetSub()


    }, [])

    const onGetSub = () => {
        AsyncStorage.getItem("userInfo").then(res => {
            if (res) {
                const userInfo = JSON.parse(res)
                let data = {
                    userId: userInfo.id,
                }
                subscribeSignalClassicList(data).then(res => {
                    const result = res.data
                    setDataList(result)

                })
            }
        })
    }

    const onCancelSub = (item) => {
        Alert.alert(
            "确定要取消订阅吗",
            "取消订阅将无法收到信号推送消息",
            [
                { text: "取消", onPress: () => console.log("cancel Pressed") },
                {
                    text: "确定", onPress: () => {
                        AsyncStorage.getItem("userInfo").then(res => {
                            if (res) {
                                const data = {
                                    subId: item.id
                                }
                                const loading = Toast.loading({
                                    content: '取消订阅中…'
                                })
                                cancelSubSignalClassic(data).then(res => {
                                    Toast.remove(loading);
                                    if (res.code === 200) {
                                        Toast.success({
                                            content: '取消订阅成功',
                                        })
                                        DeviceEventEmitter.emit('refreshStrategyList');
                                        onGetSub()

                                    } else {
                                        Toast.fail({
                                            content: res.message,
                                        })
                                    }
                                }).catch(err => {
                                    Toast.remove(loading);
                                })

                            } else {
                                Alert.alert(
                                    "提示",
                                    "请先登录",
                                    [
                                        { text: "确定", onPress: () => console.log("OK Pressed") }
                                    ]
                                );
                            }
                        })
                    }
                }
            ]
        );

    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.dataHeader}>
                    <Text style={[styles.dataHeaderText,]}>策略名称</Text>
                    <Text style={styles.dataHeaderText}>股票名称</Text>
                    <Text style={styles.dataHeaderText}>收益率</Text>
                    <Text style={styles.dataHeaderText}>操作</Text>
                </View>

                {dataList.map((item, index) => {
                    return (
                        <View style={styles.dataItem} key={index}>
                            <Text style={[styles.dataText,]}>{item.strategyName}</Text>
                            <Text style={styles.dataText}>{item.prodName}</Text>
                            <Text style={styles.dataText}>{item.yield}%</Text>
                            <View style={styles.dataText}>
                                <TouchableWithoutFeedback onPress={() => onCancelSub(item)}>
                                    <Text style={styles.cancelBtn}>取消订阅</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    )
                })}

            </ScrollView>
        </SafeAreaView>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 15

    },
    dataHeader: {
        flexDirection: "row",
        paddingVertical: 10,
    },
    dataHeaderText: {
        flex: 1,
        textAlign: "center",
        color: "#999"
    },
    dataItem: {
        flexDirection: "row",
        alignItems:"center",
        paddingVertical: 10,

        marginBottom: 15,
        paddingHorizontal: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1

    },
    dataText: {
        flex: 1,
        textAlign: "center"
    },
    cancelBtn: {
        textAlign: "center",
        color: "blue"
    }

});