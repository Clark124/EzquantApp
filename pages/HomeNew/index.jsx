import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableWithoutFeedback, Alert ,DeviceEventEmitter} from 'react-native';
import { statisticsHomeCount, optimalStrategyListMore, tradeRecord } from '../../service/index'
import search_icon from '../../assets/ssuo.png'
import help_icon from '../../assets/bzhu.png'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { periodObj } from '../../utils/index'

export default function HomeScreen({ navigation, route }) {
    const [carouselList] = useState([
        { image: 'http://img.spd9.com/admin/upload/jdzf/banner01.png', key: "banner1", },
        { image: 'http://img.spd9.com/admin/upload/jdzf/banner02.png', key: "banner2", },
        { image: 'http://img.spd9.com/admin/upload/jdzf/banner03.png', key: "banner3", },
        { image: 'http://img.spd9.com/admin/upload/jdzf/banner04.png', key: "banner4", },
    ])
    const [statisticsCount, setStatisticsCount] = useState(0)
    const [signalRankList, setSignalRankList] = useState([])
    const [signalDate, setSignalDate] = useState("--")
    const [recordList, setRecordList] = useState([])


    useEffect(() => {
        getStatisticsHomeCount()
        getSignalList()
        getTradeRecord()
        let listerer = DeviceEventEmitter.addListener("refreshHome",()=>{
            getTradeRecord()
        })
        return ()=>{
            listerer.remove();
        }

    }, [])

    const getStatisticsHomeCount = () => {
        statisticsHomeCount({ period: 6 }).then(res => {
            const { date, size } = res.data
            setStatisticsCount(size)
            AsyncStorage.setItem("statisticsHome", JSON.stringify(date))
        })
    }

    const getSignalList = () => {
        optimalStrategyListMore({ page: 1, size: 9, period: 6 }).then(res => {
            const result = res.data.page_date
            if (result.length > 0) {
                setSignalRankList(result)
                setSignalDate(result[0].lastTime)
            }

        })
    }

    const getTradeRecord = () => {
        AsyncStorage.getItem("userInfo").then(res => {
            if (res) {
                const userInfo = JSON.parse(res)
                let data = {
                    page: 1,
                    size: 2,
                    userId: userInfo.id,
                }
                tradeRecord(data).then(res => {
                    if (res.code === 200) {
                        setRecordList(res.data.page_date)
                    }
                })

            }else{
                setRecordList([])
            }
        })
    }






    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.searchInputWrap}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("search", { from: "home" })}>
                        <View style={styles.searchInput}>
                            <Image source={search_icon} style={styles.searchIcon} />
                            <Text>请输入股票代码</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("在线客服")}>
                        <View style={styles.help}>
                            <Image source={help_icon} style={styles.helpIcon} />
                            <Text>帮助</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("homeStatistics")}>
                    <View style={styles.statistics}>
                        <View style={styles.statisticsInfo}>
                            <Text style={styles.statisticsRed}>每日统计：</Text>
                            <Text style={styles.statisticsText}>最新前5战法都买入持有的有</Text>
                            <Text style={styles.statisticsRed}>{statisticsCount}</Text>
                            <Text style={styles.statisticsText}>只</Text>
                        </View>
                        <Text style={{ color: "gray" }}>&gt;</Text>

                    </View>
                </TouchableWithoutFeedback>

                <Swiper style={styles.wrapper} showsButtons={false}>
                    {carouselList.map((item, index) => {
                        return (
                            <View style={styles.carouselItem} key={index}>
                                <Image source={{ uri: item.image }} style={styles.carouselImg} />
                            </View>
                        )
                    })}
                </Swiper>

                <View style={styles.signalHead}>
                    <View style={styles.signalText}>
                        <Text style={styles.signalTextName}>买卖信号排行</Text>
                        <Text style={styles.signalTextName}>({signalDate})</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("classicRank")}>
                        <Text style={styles.signalMore}>
                            更多&gt;
                        </Text>
                    </TouchableWithoutFeedback>
                </View>

                <View style={styles.signalList}>
                    {signalRankList.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback key={index} onPress={() => navigation.navigate("classicSignalDetail", { id: item.id, code: item.prodCode })}>
                                <View style={styles.signalItem} >
                                    <Text style={styles.signalRate}>{item.yield}%</Text>
                                    <Text style={styles.signalRateText}>年收益率</Text>
                                    <Text style={styles.symbol}>({item.prodName})</Text>
                                    <Text style={styles.strategyName}>{item.strategyName}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })}


                </View>

                <View style={styles.mySubHead}>
                    <Text style={styles.signalTextName}>我的订阅</Text>
                    <TouchableWithoutFeedback onPress={() => {
                        AsyncStorage.getItem("userInfo").then(res => {
                            if (res) {
                                navigation.navigate("userMessage")
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
                        <Text style={styles.signalMore}>
                            更多&gt;
                        </Text>
                    </TouchableWithoutFeedback>

                </View>
                <View style={styles.subWrap}>
                    {recordList.length > 0 ?
                        recordList.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => {
                                    navigation.navigate("classicSignalDetail", { id: item[6], code: item[1] })
                                }}>
                                    <View style={styles.tradeLogItem} >
                                        <View style={styles.signalInfo}>
                                            <Text style={styles.signalInfoText}>策略名称:</Text><Text style={styles.signalInfoValue}>{item[0]}</Text>
                                        </View>
                                        <View style={styles.signalInfo}>
                                            <Text style={styles.signalInfoText}>股票名称:</Text><Text style={styles.signalInfoValue}>{item[2]}&nbsp;&nbsp;</Text>
                                            <Text style={styles.signalInfoText}>买卖:</Text><Text style={item[3] === '卖出' ? styles.signalInfoValueGreen : styles.signalInfoValueRed} >{item[3]}&nbsp;&nbsp;</Text>
                                            <Text style={styles.signalInfoText}>价格:</Text><Text style={styles.signalInfoValueRed}>{item[4]}&nbsp;&nbsp;</Text>
                                            {/* <Text style={styles.signalInfoText}>周期:</Text><Text style={styles.signalInfoValue}>{periodObj[item[7]]}</Text> */}
                                        </View>

                                        <View style={styles.tradeLogDate}>
                                            <Text>时间:</Text>
                                            <Text style={styles.tradeTime}>{item[5]}</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>

                            )
                        }) : <Text style={styles.noData}>暂无数据！</Text>
                    }

                </View>

            </ScrollView>
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    scrollWrap: {

    },
    searchInputWrap: {
        flexDirection: "row",
    },
    searchInput: {
        flexDirection: "row",
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 40,
        alignItems: "center",
        flex: 1,
        marginRight: 10,
        borderRadius: 20
    },
    searchIcon: {
        width: 25,
        height: 25,
        marginRight: 5
    },
    help: {
        alignItems: "center",
        justifyContent: "center"
    },
    helpIcon: {
        width: 25,
        height: 25,
    },
    statistics: {
        flexDirection: "row",
        backgroundColor: "#ffeae8",
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: "space-between"
    },
    statisticsInfo: {
        flexDirection: "row",
        alignItems:"center"
    },
    statisticsRed: {
        color: "red",
        fontSize: 15
    },
    statisticsText: {
        fontSize: 15
    },
    carouselItem: {
        width: "100%",
        height: 160
    },
    carouselImg: {
        width: "100%",
        height: 160
    },
    wrapper: {
        height: 160,
        marginTop: 10
    },
    signalHead: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 10
    },
    signalText: {
        flexDirection: "row",

    },
    signalTextName: {
        fontSize: 16
    },
    signalList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    signalItem: {
        backgroundColor: "#ffe7e7",
        width: "32%",
        // flex:0.8,
        // marginRight:8,
        marginBottom: 10,
        minHeight: 101,
        paddingVertical: 15,
        paddingHorizontal: 5,
        alignItems: "center",
        borderRadius: 10,
    },
    signalRate: {
        color: "#e84345",
        fontSize: 20,
        fontWeight: "bold"
    },
    signalRateText: {
        color: "#e84345",
        fontSize: 14,
    },
    signalMore: {
        color: "gray"
    },
    symbol: {
        marginTop: 5,
        fontSize: 12
    },
    strategyName: {
        textAlign: "center",
        fontSize: 12
    },
    mySubHead: {
        flexDirection: "row",
        justifyContent: "space-between",

        marginTop: 25
    },
    subWrap: {
        marginBottom: 40,
    },
    noData: {
        textAlign: "center",
        marginVertical: 30,
        fontSize: 15,
        color: "gray"
    },
    tradeLogItem: {
        paddingVertical: 15,
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1
    },
    signalInfo: {
        flexDirection: "row",
        marginBottom: 10
    },
    signalInfoText: {

    },
    signalInfoValue: {
        color: "#083aef"
    },
    signalInfoValueRed: {
        color: "#e84345"
    },
    signalInfoValueGreen: {
        color: "green"
    },
    tradeLogDate: {
        flexDirection:"row"
    },
    tradeTime: {
        color: 'blue'
    }
});