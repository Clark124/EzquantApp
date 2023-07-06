

import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { ActionSheet } from '@ant-design/react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment';
import { statisticsHome } from '../../service'

export default function HomeStatistics({navigation}) {
    const [dateList, setDateList] = useState([])
    const [dateIndex, setDateIndex] = useState(0)
    const [strategyList, setStrategyList] = useState([])
    const [avgPorfit, setAvgPorfit] = useState('--')
    const [winRate, setWinRate] = useState('--')

    useEffect(() => {
        AsyncStorage.getItem("statisticsHome").then(res => {
            const dateList = JSON.parse(res)
            setDateList(dateList)
            getStrategyList(dateList, dateIndex)
        })
    }, [])

    const showTimeActionSheet = () => {
        let BUTTONS = dateList.map((item) => {
            return moment(item, 'YYYYMMDD').format('YYYY-MM-DD')
        });
        BUTTONS.push("取消")
        ActionSheet.showActionSheetWithOptions(
            {
                title: '选择时间',
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                // destructiveButtonIndex: dateIndex,
            },
            buttonIndex => {
                if (buttonIndex === BUTTONS.length - 1) {
                    return
                }
                setDateIndex(buttonIndex)
                getStrategyList(dateList, buttonIndex)
            }
        );
    }

    const getStrategyList = (dateList, dateIndex) => {
        const data = {
            date: dateList[dateIndex],
            period: 6,
            buySell: 1
        }
        statisticsHome(data).then(res => {
            if (res.code === 200) {
                setStrategyList(res.data.d)
                if (res.data.w) {
                    setWinRate(res.data.w)
                } else {
                    setWinRate('--')
                }
                if (res.data.y) {
                    setAvgPorfit(res.data.y)
                } else {
                    setAvgPorfit('--')
                }

            }

        })

    }

    const onNavTraderoom = (item)=>{
        AsyncStorage.setItem("currentSymbol",item[0]).then(res=>{
            navigation.navigate("traderoomNew")
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.mainInfo}>
                    <TouchableWithoutFeedback onPress={showTimeActionSheet}>
                        <View style={styles.mainInfoTextWrap}>
                            <Text>选入时间：</Text><Text style={{ color: "#083aef" }}>{moment(dateList[dateIndex], 'YYYYMMDD').format('YYYY-MM-DD')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.mainInfoTextWrap}>
                        <Text>选股数量：</Text><Text style={{ color: "red" }}>{strategyList.length}</Text>
                    </View>
                </View>

                <View style={styles.mainInfo}>
                    <View style={styles.mainInfoTextWrap}>
                        <Text>平均收益率：</Text><Text style={avgPorfit > 0 ? { color: 'red' } : avgPorfit < 0 ? { color: "green" } : { color: "gray" }}>{avgPorfit}%</Text>
                    </View>
                    <View style={styles.mainInfoTextWrap}>
                        <Text>胜率：</Text><Text style={winRate > 0 ? { color: 'red' } : winRate < 0 ? { color: "green" } : { color: "gray" }}>{winRate}%</Text>
                    </View>
                </View>
                <View style={styles.strategyHead}>
                    <Text style={styles.strategyHeadText}>合约</Text>
                    <Text style={styles.strategyHeadText}>选股价</Text>
                    <Text style={styles.strategyHeadText}>收益率</Text>
                </View>
                <View style={styles.strategyList}>
                    {strategyList.map((item, index) => {
                        return (
                            <TouchableWithoutFeedback key={index} onPress={()=>onNavTraderoom(item)}>
                                <View style={styles.strategyItem} >
                                    <View style={styles.code}>
                                        {item[4] === 1 ? <Text style={{ color: "red" }}>新</Text> : null}
                                        <View>
                                            <Text style={{ color: "#083aef", textAlign: "center" }}>{item[1]}</Text>
                                            <Text style={{ color: "#666" }}>{item[0]}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.price}>{item[2]}</Text>
                                    <Text style={item[3] > 0 ? styles.rateRed : item[3] < 0 ? styles.rateGreen : styles.rateGray}>{item[3]}%</Text>

                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    mainInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20

    },
    mainInfoTextWrap: {
        flexDirection: "row",
    },
    strategyHead: {
        flexDirection: "row",
        marginBottom: 5
    },
    strategyHeadText: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    },
    strategyItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        marginBottom: 10
    },
    code: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    price: {
        flex: 1,
        textAlign: "center",
        color: "red"
    },
    rateRed: {
        flex: 1,
        textAlign: "center",
        color: "red"
    },
    rateGreen: {
        flex: 1,
        textAlign: "center",
        color: "green"
    },
    rateGray: {
        flex: 1,
        textAlign: "center",
        color: "gray"
    }


});