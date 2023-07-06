import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
// import banner_img from './assets/images/zfbanner.png'
import { pixel } from '../../utils/index';
import { useEffect, useState } from 'react';
import { classicList } from '../../service/index'

export default function Home({ navigation }) {
    const [tabIndex, setTabIndex] = useState(0)
    const [strategyList, setStrategyList] = useState([])
    const [period, setPeriod] = useState(6)

    useEffect(() => {
        getClassicList(tabIndex,)
    }, [])

    const getClassicList = (index, currentPeriod = period) => {
        let orderBy = ""
        if (index === 0) {
            orderBy = 'strategy_name desc'
        } else if (index === 1) {
            orderBy = 'winning_ratio desc'
        } else {
            orderBy = 'return_risk_ratio desc'
        }
        let data = {
            orderBy: orderBy,
            period: currentPeriod
        }

        classicList(data).then(res => {
            setStrategyList(res.data.list)
        })
    }

    const changeTabIndex = (index) => {
        setTabIndex(index)
        getClassicList(index)
    }

    return (
        <View style={styles.container}
        >
            {/* <TouchableWithoutFeedback onPress={() => navigation.navigate("经典战法")}>
                <Image
                    resizeMode="stretch"
                    style={styles.banner}
                    source={{ uri: "https://img.spd9.com/admin/upload/jdzf/app01.jpg" }}
                />
            </TouchableWithoutFeedback> */}
            <View style={styles.tab}>
                <TouchableWithoutFeedback onPress={() => changeTabIndex(0)}>
                    <View style={styles.tabItemWrap}>
                        <Text style={styles.tabItem}>战法名称</Text>
                        <Text style={tabIndex === 0 ? styles.tabLineActive : styles.tabLine}></Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => changeTabIndex(1)}>
                    <View style={styles.tabItemWrap} >
                        <Text style={styles.tabItem}>胜率</Text>
                        <Text style={tabIndex === 1 ? styles.tabLineActive : styles.tabLine}></Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => changeTabIndex(2)}>
                    <View style={styles.tabItemWrap}>
                        <Text style={styles.tabItem}>盈亏比</Text>
                        <Text style={tabIndex === 2 ? styles.tabLineActive : styles.tabLine}></Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <ScrollView style={styles.strategyList}
                scrollEventThrottle={16}
                keyboardDismissMode='on-drag'
            >
                {strategyList.map((item, index) => {
                    return (
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                navigation.navigate('战法详情',{id:item.outStrategyId})
                            }}
                            key={index}
                        >
                            <View style={styles.strategyItem} >
                                <Text style={styles.strategyName}>{item.strategyName}</Text>
                                <View style={styles.strategyItemInfo}>
                                    <Text style={styles.profit}>胜率：{item.winningRatio}%</Text>
                                    <Text style={styles.rate}>赢亏比：{item.returnRiskRatio}</Text>
                                </View>

                                <Text style={styles.source}>来源：<Text style={styles.sourceText}>{item.source}</Text></Text>
                                {/* <Text style={styles.desc}>描述：{item.desc}</Text> */}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </ScrollView>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        height: 160,
        width: 375 * pixel
    },
    tab: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingTop: 20 ,
        paddingBottom: 10,

    },
    tabItemWrap: {
        flex: 1,
        display: "flex",
        alignItems: "center",
    },
    tabItem: {
        fontSize: 16 ,
        textAlign: "center"
    },
    tabLine: {
        width: 25,
        height: 4,
        backgroundColor: "transparent",
        marginTop: 8
    },
    tabLineActive: {
        width: 25 ,
        height: 4 ,
        backgroundColor: "blue",
        marginTop: 8 
    },
    strategyList: {
        flex: 1,
        boxSizing: "border-box",
        paddingTop: 10,
        paddingLeft: 15 ,
        paddingRight: 15 ,
        marginBottom: 0
        // padding: 15 ,

    },
    strategyItem: {
        borderWidth: 1,
        borderColor: "#eee",
        padding: 15 ,
        borderRadius: 5 ,
        marginBottom: 10 
    },
    strategyName: {
        fontWeight: "bold",
        fontSize: 17 
    },
    strategyItemInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10 
    },
    profit: {
        width: 150 ,
        height: 35 ,
        lineHeight: 35 ,
        textAlign: "center",
        fontSize: 15 ,
        backgroundColor: "#fa3a35",
        color: "#fff"
    },
    rate: {
        width: 150 ,
        height: 35 ,
        lineHeight: 35 ,
        textAlign: "center",
        fontSize: 15 ,
        backgroundColor: "#f99d37",
        color: "#fff"
    },
    source: {
        marginTop: 10 ,
        fontSize:17
    },
    sourceText: {
        color: 'blue'
    }


});
