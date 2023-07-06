import { StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView ,Alert} from 'react-native';
import { startegyDetail ,subscribeSignalClassic} from '../../service/index'
import { useEffect, useState } from 'react';
import TabGraph from '../../components/stockChart/TabGraph'
import moment from 'moment';
import { Toast, Button } from '@ant-design/react-native';
import { theme } from '../../utils/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'

let kchartRef = ""

const window = Dimensions.get('window');

const option = {
    wrapperHeight: window.height * 0.54,
    mainChartHeight: window.height * 0.32,
    quoteChartHeight: window.height * 0.10,
    showControlBtn: true,
    controlBtnPosition: window.height * 0.28,
    endPoint: 0,
}


export default function ClassicSignalDetail({ navigation, route }) {
    const [isLogin, setIsLogin] = useState(false)
    const [hasSub, setHasSub] = useState(false)
    const [startDateStr, setstartDateStr] = useState("")
    const [endDateStr, setendDateStr] = useState("")
    const [period, setPeriod] = useState("")
    const [backtestParameter, setbacktestParameter] = useState({})
    const [orders, setOrders] = useState([])
    const [signals, setSignals] = useState([])
    const [userInfo, setUserInfo] = useState({})


    useEffect(() => {
        AsyncStorage.getItem("userInfo").then(res => {
            if (res) {
                const userInfo = JSON.parse(res)
                setUserInfo(userInfo)
                setIsLogin(true)
            }
        })

        const reportId = route.params.id
        onGetClassicDetail(reportId)

    }, [])

    const onGetClassicDetail = (id) => {
        AsyncStorage.getItem("userInfo").then(res => {
            let data = {
                reportId: id,
            }
            if (res) {
                const userInfo = JSON.parse(res)
                data.userId = userInfo.id
            }
            
            const loading = Toast.loading({
                content: '加载中…'
            })
            startegyDetail(data).then(res => {
                Toast.remove(loading);
                if (res.code === 200) {
                    let { pair, report, signals, subscribeState, yieldGraphs } = res.data
                    console.log(subscribeState)
                    kchartRef.refreshKline(report.prodCode)
                    if (!report) {
                        Toast.fail({
                            content: "还没产生报告"
                        })
                        return
                    }
                    pair = JSON.parse(pair)
                    signals = JSON.parse(signals)
                    yieldGraphs = JSON.parse(yieldGraphs)
                    if (subscribeState === 1) {
                        setHasSub(true)
                    }
                    setstartDateStr(report.startTime)
                    setendDateStr(report.endTime)
                    let period
                    if (report.period) {
                        if (report.period === 1) {
                            period = '分时'
                        } else if (report.period === 2) {
                            period = '5分钟'
                        } else if (report.period === 3) {
                            period = '15分钟'
                        } else if (report.period === 4) {
                            period = '30分钟'
                        } else if (report.period === 5) {
                            period = '60分钟'
                        } else if (report.period === 6) {
                            period = '日K'
                        }
                    }
                    setPeriod(period)
                    setbacktestParameter(report)
                    setOrders(pair)
                    setSignals(signals)
                    let startDate, endDate
                    if (report.period < 6) {
                        startDate = moment(report.startTime, 'YYYY-MM-DD HH:mm').format('YYYYMMDDHHmm')
                        endDate = moment(report.endTime, 'YYYY-MM-DD HH:mm').format('YYYYMMDDHHmm')
                    } else {
                        startDate = moment(report.startTime, 'YYYY-MM-DD').format('YYYYMMDD')
                        endDate = moment(report.endTime, 'YYYY-MM-DD').format('YYYYMMDD')
                    }
    
                    // props.onGetNewKlineByDate(report.prodCode, report.period, startDate, endDate, (stockDate) => {
                    //     initKline(stockDate, report.period, signals)
                    // })
    
                    // let dateList = []
                    // let valueList = []
                    // yieldGraphs.sort((a, b) => {
                    //     return Number(a[0]) - Number(b[0])
                    // })
    
                    // yieldGraphs.forEach(item => {
                    //     dateList.push(moment(item[0], report.period < 6 ? 'YYYYMMDDHHmm' : 'YYYYMMDD').format(report.period < 6 ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'))
                    //     valueList.push(item[1])
                    // })
                    // lineOption.xAxis.data = dateList
                    // lineOption.series[0].data = valueList
                    // const yieldChart = echarts.init(lineRef.current)
                    // yieldChart.setOption(lineOption)
                }
            }).catch(err => {
                Toast.remove(loading);
            })
        })
       


    }

    const onRef = (kchart) => {
        kchartRef = kchart
        // kchartRef.refreshKline(route.params.code)
    }

    const hasGetData = (data) => {
        // const signal = [{type:1,time:20230606}]
        // kchartRef.setStrategyPoint(signal)
        // console.log(signals)
        const signal = signals.map(item => {
            return {
                type: item[0],
                time: item[2]
            }
        })
        kchartRef.setStrategyPoint(signal)
    }

    //订阅经典
    const onSubscribe = () => {
        Alert.alert(
            "提示",
            "订阅后可在'我的'->'消息通知'中查看信号通知",
            [
                { text: "取消", onPress: () => console.log("cancel Pressed") },
                {
                    text: "确定", onPress: () => {
                        onSubscribeSignalClassic()
                    }
                }
            ]
        );

       
    }

    const onSubscribeSignalClassic = (item) => {

        const data = {
            userId: userInfo.id,
            period: backtestParameter.period,
            prodCode: backtestParameter.prodCode,
            strategyId: backtestParameter.strategyId,
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
                setHasSub(true)

            } else {
                Toast.fail({
                    content: res.message,
                })
            }
        }).catch(err => {
            Toast.remove(loading);
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
                <View style={styles.paramsWrap}>
                    <Text style={styles.subTitle}>策略运行参数</Text>
                    <View style={styles.paramsList}>
                        <View style={styles.paramsItem}>
                            <Text style={styles.paramsItemTitle}>策略名称</Text>
                            <Text style={styles.paramsItemInfo}>{backtestParameter.strategyName}</Text>
                        </View>
                        <View style={styles.paramsItem}>
                            <Text style={styles.paramsItemTitle}>股票名称</Text>
                            <Text style={styles.paramsItemInfo}>{backtestParameter.prodName}</Text>
                        </View>
                        <View style={styles.paramsItem}>
                            <Text style={styles.paramsItemTitle}>K先频率</Text>
                            <Text style={styles.paramsItemInfo}>{period}</Text>
                        </View>
                        <View style={styles.paramsItem}>
                            <Text style={styles.paramsItemTitle}>开始时间</Text>
                            <Text style={styles.paramsItemInfo}>{startDateStr}</Text>
                        </View>
                        <View style={styles.paramsItem}>
                            <Text style={styles.paramsItemTitle}>结束时间</Text>
                            <Text style={styles.paramsItemInfo}>{endDateStr}</Text>
                        </View>
                        <View style={styles.paramsItem}>
                            <Text style={styles.paramsItemTitle}>初始资金</Text>
                            <Text style={styles.paramsItemInfo}>{backtestParameter.initFund}</Text>
                        </View>
                    </View>
                </View>

                {/* 基本统计 */}
                <View style={styles.paramsWrap}>
                    <Text style={styles.subTitle}>基本统计</Text>
                    <View style={styles.infoList}>
                        <View style={styles.listHead}>
                            <Text style={styles.listHeadText}>年收益率</Text>
                            <Text style={styles.listHeadText}>最大资产规模</Text>
                            <Text style={styles.listHeadText}>最小资产规模</Text>

                        </View>
                        <View style={styles.listData}>
                            <Text style={styles.listDataValue}>{backtestParameter.yield}%</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.maxFund}</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.minFund}</Text>
                        </View>
                    </View>
                    <View style={styles.infoList}>
                        <View style={styles.listHead}>
                            <Text style={styles.listHeadText}>胜率</Text>
                            <Text style={styles.listHeadText}>盈利次数</Text>
                            <Text style={styles.listHeadText}>亏损次数</Text>
                        </View>
                        <View style={styles.listData}>
                            <Text style={styles.listDataValue}>{backtestParameter.winRate}%</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.winNum}</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.lossNum}</Text>
                        </View>
                    </View>
                    <View style={styles.infoList}>
                        <View style={styles.listHead}>
                            <Text style={styles.listHeadText}>盈亏比</Text>
                            <Text style={styles.listHeadText}>平均盈利</Text>
                            <Text style={styles.listHeadText}>平均亏损</Text>

                        </View>
                        <View style={styles.listData}>
                            <Text style={styles.listDataValue}>{backtestParameter.winFactor}</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.avgProfit}</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.avgLoss}</Text>
                        </View>
                    </View>
                    <View style={styles.infoList}>
                        <View style={styles.listHead}>
                            <Text style={styles.listHeadText}>择时收益率</Text>
                            <Text style={styles.listHeadText}>连胜次数</Text>
                            <Text style={styles.listHeadText}>连亏次数</Text>
                        </View>
                        <View style={styles.listData}>
                            <Text style={styles.listDataValue}>{backtestParameter.timeYield}%</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.serialWin}</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.serialLossNum}</Text>
                        </View>
                    </View>
                    <View style={styles.infoList}>
                        <View style={styles.listHead}>
                            <Text style={styles.listHeadText}>收益风险比</Text>
                            <Text style={styles.listHeadText}>年化收益率</Text>
                            <Text style={styles.listHeadText}>最大回撤</Text>
                        </View>
                        <View style={styles.listData}>
                            <Text style={styles.listDataValue}>{backtestParameter.yieldRiskRate}</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.yearYield}%</Text>
                            <Text style={styles.listDataValue}>{backtestParameter.maxDrawdown}%</Text>
                        </View>
                    </View>

                </View>

                {/* 买卖信号 */}
                <View style={styles.klineWrap}>
                    <Text style={[styles.subTitle, { padding: 15 }]}>买卖信号</Text>

                    <TabGraph
                        prodCode={backtestParameter.prodCode}
                        onRef={onRef}
                        hideTabHeader={false}
                        theme={theme}
                        option={option}
                        hasGetData={hasGetData}
                    />
                </View>


                {/* 交易明细 */}
                <View style={styles.paramsWrap}>
                    <Text style={styles.subTitle}>交易明细</Text>
                    <View style={styles.holdPositionHead}>
                        <Text style={styles.holdPositionHeadText}>时间</Text>
                        <Text style={styles.holdPositionHeadText}>买卖</Text>
                        <Text style={styles.holdPositionHeadText}>价格</Text>
                        <Text style={styles.holdPositionHeadText}>盈亏</Text>
                    </View>
                    {orders.map((item, index) => {
                        let startDate, endDate
                        if (backtestParameter.period < 6) {
                            startDate = moment(item[1], 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')
                            if (item[5] === -1) {
                                endDate = moment().format('YYYY-MM-DD HH:mm')
                            } else {
                                endDate = moment(item[5], 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')
                            }
                        } else {
                            startDate = moment(item[1], 'YYYYMMDD').format('YYYY-MM-DD')
                            if (item[5] === -1) {
                                endDate = moment().format('YYYY-MM-DD')
                            } else {
                                endDate = moment(item[5], 'YYYYMMDD').format('YYYY-MM-DD')
                            }
                        }

                        return (
                            <View key={index} style={styles.holdDataListWrap}>
                                <View style={styles.holdDataList}>
                                    <Text style={[styles.holdDataItem, { fontSize: 12 }]}>{startDate}</Text>
                                    <Text style={[styles.holdDataItem, { color: "red" }]}>{'买入'}</Text>
                                    <Text style={styles.holdDataItem}>{item[0]}</Text>
                                    <Text style={item[2] >= 0 ? [styles.holdDataItem, { color: 'red' }] : [styles.holdDataItem, { color: 'green' }]}>{item[2]}</Text>
                                </View>
                                <View style={styles.holdDataList}>
                                    <Text style={[styles.holdDataItem, { fontSize: 12 }]}>{endDate}</Text>
                                    <Text style={item[5] === -1 ? [styles.holdDataItem, { color: "#222" }] : [styles.holdDataItem, { color: "green" }]}>{item[5] === -1 ? '持仓' : '卖出'}</Text>
                                    <Text style={styles.holdDataItem}>{item[4] ? item[4] : '--'}</Text>
                                    <Text style={item[3] >= 0 ? [styles.holdDataItem, { color: 'red' }] : [styles.holdDataItem, { color: 'green' }]}>{item[3]}%</Text>
                                </View>

                            </View>
                        )
                    })}
                </View>

                <View style={styles.tipWrap}>
                    <Text style={styles.tipText}>风险提示：历史和实时计算数据仅供参考，不构成投资建议。股市有风险，投资需谨慎。</Text>
                </View>


            </ScrollView>
            {isLogin ?
                hasSub ? <Button disabled>已订阅</Button> : <Button type='primary' onPress={onSubscribe}>订阅</Button>
                : null
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    paramsWrap: {
        padding: 15,
        borderBottomWidth: 10,
        borderBottomColor: "#eee"
    },
    klineWrap: {
        borderBottomWidth: 10,
        borderBottomColor: "#eee"
    },
    subTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10
    },
    paramsList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"

    },
    paramsItem: {
        width: "32%",
        backgroundColor: "#e7effc",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        height: 90,
        marginBottom: 10
    },
    paramsItemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#415087",
        marginBottom: 5
    },
    paramsItemInfo: {
        textAlign: "center",
        fontSize: 15
    },
    infoList: {

    },
    listHead: {
        flexDirection: "row"
    },
    listHeadText: {
        flex: 1,
        textAlign: "center",
        backgroundColor: "#e7effc",
        paddingVertical: 5
    },
    listData: {
        flexDirection: "row"
    },
    listDataValue: {
        flex: 1,
        textAlign: "center",
        paddingVertical: 5,
        fontSize: 15,
        fontWeight: "bold"
    },
    holdPositionHead: {
        flexDirection: "row",
    },
    holdPositionHeadText: {
        flex: 1,
        textAlign: "center"
    },
    holdDataListWrap: {
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1
    },
    holdDataList: {
        fontSize: 14,
        color: "#222",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3
    },
    holdDataItem: {
        flex: 1,
        textAlign: "center"
    },
    tipWrap: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "rgba(238, 133, 134, 0.1)",

    },
    tipText: {
        color: "#FC5F01",
        fontSize: 12
    }



});