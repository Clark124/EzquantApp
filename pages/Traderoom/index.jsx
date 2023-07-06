import { Button, View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Alert ,DeviceEventEmitter} from 'react-native';
import TabGraph from '../../components/stockChart/TabGraph'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { theme } from '../../utils/theme'
import { useEffect, useState, } from 'react';
import { getQuote, classicStrategyList, backtestOptimalSignal, subscribeSignalClassic, cancelSubSignalClassic } from '../../service/index'
import search_icon from '../../assets/ssuo.png'
import chiyou_icon from '../../assets/cyou.png'
import { Toast } from '@ant-design/react-native';

const window = Dimensions.get('window');

const option = {
    wrapperHeight: window.height * 0.54,
    mainChartHeight: window.height * 0.32,
    quoteChartHeight: window.height * 0.10,
    showControlBtn: true,
    controlBtnPosition: window.height * 0.28,
    endPoint: 0,
}

let kchartRef = ""

export default function Traderoom({ navigation }) {
    const [prodCode, setProdCode] = useState("000651.SZ")
    const [period, setPeriod] = useState(6)
    const [quote, setQuote] = useState({})
    const [strategyList, setStrategyList] = useState([])
    const [signalIndex, setSignalIndex] = useState(-1)

    const onRef = (kchart) => {
        kchartRef = kchart
        AsyncStorage.getItem("currentSymbol").then(res => {
            if (res) {
                kchartRef.refreshKline(res)
            } else {
                kchartRef.refreshKline(prodCode)
            }
        })

    }

    useEffect(() => {
        AsyncStorage.getItem("currentSymbol").then(res => {
            if (res) {
                setProdCode(res)
                onGetQuote(res)
                getClassicStrategyList(res)
            } else {
                onGetQuote(prodCode)
                getClassicStrategyList(prodCode)
            }
        })
        let listerer = DeviceEventEmitter.addListener("refreshStrategyList",()=>{
            getClassicStrategyList(prodCode)
        })
        return ()=>{
            listerer.remove();
        }

    }, [navigation])

    const hasGetData = (data) => {
        // const signal = [{type:1,time:20230606}]
        // kchartRef.setStrategyPoint(signal)
    }

    const onGetQuote = (prodCode = prodCode) => {
        getQuote({ prod_code: prodCode }).then(res => {
            let ret = {}
            if (res.data) {
                ret = res.data[0]
            } else if (res[0]) {
                ret = res[0]
            }
            setQuote(ret)
        })
    }

    const getClassicStrategyList = (prodCode) => {
        AsyncStorage.getItem("userInfo").then(res => {
            const data = {
                prodCode: prodCode, period: 6, page: 1, size: 50
            }
            if (res) {
                data.userId = JSON.parse(res).id
            }
            classicStrategyList(data).then(res => {
                setStrategyList(res.data.page_date)
            })
        })

    }

    const onShowSignal = (id, index) => {
        setSignalIndex(index)
        backtestOptimalSignal({ reportId: id }).then(res => {
            if (res.data.length && res.data.length > 0) {
                const signal = res.data.map(item => {
                    return {
                        type: item[2],
                        time: item[0]
                    }
                })
                kchartRef.setStrategyPoint(signal)
            }

        })
    }

    const onChangeCode = (code) => {
        setProdCode(code)
        onGetQuote(code)
        getClassicStrategyList(code)
        kchartRef.refreshKline(code)

    }

    const onSubscribeSignalClassic = (item) => {
        Alert.alert(
            "提示",
            "订阅后可在'我的'->'消息通知'中查看信号通知",
            [
                { text: "取消", onPress: () => console.log("cancel Pressed") },
                {
                    text: "确定", onPress: () => {
                        onSubscribeSignalClassicApi(item)
                    }
                }
            ]
        );
    }

    const onSubscribeSignalClassicApi = (item)=>{
        AsyncStorage.getItem("userInfo").then(res => {
            if (res) {
                const userInfo = JSON.parse(res)
                const data = {
                    userId: userInfo.id,
                    period: item.period,
                    prodCode: item.prodCode,
                    strategyId: item.strategyId,
                    notifyWay: 1
                }
                const loading = Toast.loading({
                    content: '订阅中…'
                })
                subscribeSignalClassic(data).then(res => {
                    Toast.remove(loading);
                    if (res.code === 200) {
                        Toast.success({
                            content: '订阅成功',
                        })
                        getClassicStrategyList(prodCode)

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
                                    subId: item.subId
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
                                        getClassicStrategyList(prodCode)
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
        <ScrollView style={styles.container}>
            <View style={styles.mainInfo}>
                <View style={styles.infoItem}>
                    <Text style={styles.prodName}>{quote.prod_name}</Text>
                    <Text style={styles.prodCode}>{quote.prod_code}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={[quote.px_change >= 0 ? styles.currentPrice : styles.currentPriceGreen, { fontSize: 16 }]}>{quote.last_px}</Text>
                    <View style={styles.changeRate}>
                        <Text style={[quote.px_change >= 0 ? styles.currentPrice : styles.currentPriceGreen, { marginRight: 15 }]}>{quote.px_change}</Text>
                        <Text style={quote.px_change >= 0 ? styles.currentPrice : styles.currentPriceGreen}>{quote.px_change_rate}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('search', { changeCode: onChangeCode })}>
                    <Image
                        source={search_icon}
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>

            </View>
            <TabGraph
                prodCode={prodCode}
                onRef={onRef}
                hideTabHeader={false}
                theme={theme}
                option={option}
                hasGetData={hasGetData}
            />
            <View style={styles.listHeader}>
                <Text style={[styles.listHeaderText, { flex: 1.3 }]}>策略名称</Text>
                <Text style={styles.listHeaderText}>年收益率</Text>
                <Text style={[styles.listHeaderText, { flex: 0.5 }]}>操作</Text>
            </View>
            <View style={styles.strategyList}>
                {strategyList.map((item, index) => {
                    return (
                        <TouchableWithoutFeedback onPress={() => onShowSignal(item.id, index)} key={index}>
                            <View style={styles.strategyItem}>
                                <View style={[styles.strategyItemText, { flex: 1.3 }]}>
                                    {item.pc === 1 ? <Image source={chiyou_icon} style={styles.chiyouIcon} /> : null}
                                    <Text style={signalIndex === index ? styles.strategyNameActive : styles.strategyName}>{item.strategyName}</Text>
                                </View>
                                <Text style={item.yield >= 0 ? styles.strategyItemTextRate : styles.strategyItemTextRateGreen}>{item.yield}%</Text>
                                {
                                    item.subscribeState === 1 ?
                                        <TouchableOpacity onPress={() => onCancelSub(item)} style={styles.hasSubBtn}>
                                            <Text style={styles.hasSubBtn}>已订阅</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => onSubscribeSignalClassic(item)} style={styles.subBtn}>
                                            <Text style={styles.subBtnText}>订阅</Text>
                                        </TouchableOpacity>
                                }


                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        overflow: "scroll"
    },
    mainInfo: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10
    },
    infoItem: {
        marginRight: 20
    },
    prodName: {
        fontSize: 18
    },
    prodCode: {
        color: '#999'
    },
    currentPrice: {
        color: 'red'
    },
    currentPriceGreen: {
        color: 'green'
    },
    changeRate: {
        flexDirection: "row"
    },
    searchIcon: {
        width: 25,
        height: 25,
        marginLeft: 30
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingVertical: 10,
        backgroundColor: "#eee",
        color: "#aaa",
        paddingHorizontal: 20
    },
    listHeaderText: {
        color: "#333",
        flex: 1,
        textAlign: 'center'
    },
    strategyList: {
        flex: 1
    },
    strategyItem: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingHorizontal: 20
    },
    strategyItemTextRate: {
        flex: 1,
        textAlign: 'center',
        color: "red"
    },
    strategyItemTextRateGreen: {
        flex: 1,
        textAlign: 'center',
        color: "green"
    },
    subBtn: {
        flex: 0.5,
        textAlign: "center",
        backgroundColor: "blue",
        color: "#fff",
        paddingVertical: 3
    },
    hasSubBtn: {
        flex: 0.5,
        textAlign: "center",
    },
    subBtnText: {
        textAlign: "center",
        color: "#fff",
    },
    strategyItemText: {
        flex: 1,
        alignItems: 'center',
        flexDirection: "row",
        alignItems: "center"
    },
    chiyouIcon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    strategyName: {
        textDecorationLine: "underline"
    },
    strategyNameActive: {
        textDecorationLine: "underline",
        color: "blue"
    }



});