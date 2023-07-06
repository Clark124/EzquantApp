import { StyleSheet, Text, View, ScrollView ,TouchableWithoutFeedback} from 'react-native';
import { Toast } from '@ant-design/react-native';
import { tradeRecord } from '../../service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';

export default function UserMessage({navigation}) {

    const [dataList, setDataList] = useState([])

    useEffect(() => {
        getTradeRecord()
    }, [])

    const getTradeRecord = () => {
        AsyncStorage.getItem("userInfo").then(res => {
            if (res) {
                const userInfo = JSON.parse(res)
                const data = {
                    userId: userInfo.id,
                    page: 1,
                    size: 50,
                }
                const loading = Toast.loading({
                    content: '加载中'
                })
                tradeRecord(data).then(res => {
                    Toast.remove(loading);
                    setDataList(res.data.page_date)

                }).catch(err => {
                    Toast.remove(loading);
                })
            }

        })


    }

    return (
        <ScrollView style={styles.container}>
            {
                dataList.map((item, index) => {
                    return (
                        <TouchableWithoutFeedback key={index} onPress={() => {
                            navigation.navigate("classicSignalDetail", { id: item[6], code: item[1] })
                        }}>
                            <View  style={styles.dataItem}>
                                <View style={styles.dataItemInfo}>
                                    <Text >策略名称:</Text><Text style={{ color: "blue" }}>{item[0]}</Text>
                                </View>
                                <View style={styles.dataItemInfo}>
                                    <Text >股票名称:</Text><Text style={{ color: "blue" }}>{item[2]}&nbsp;&nbsp;</Text>
                                    <Text >买卖:</Text><Text style={item[3] === '卖出' ? styles.signalInfoValueGreen : styles.signalInfoValueRed}>{item[3]}&nbsp;&nbsp;</Text>
                                    <Text >价格:</Text><Text style={{ color: "red" }}>{item[4]}</Text>
                                    {/* <Text className='signal-info-text'>周期:</Text><Text className='signal-info-value'>{periodObj[item[7]]}</Text> */}
                                </View>

                                <View style={styles.dataItemInfo}>
                                    <Text>时间:</Text>
                                    <Text style={{ color: "blue" }}>{item[5]}</Text>

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })
            }
            {dataList.length===0?<Text style={styles.noData}>暂无数据！</Text>:null}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    dataItem: {
        backgroundColor: "#fff",
        marginBottom: 15,
        padding: 10,
    },
    dataItemInfo: {
        flexDirection: "row",
        marginBottom: 10
    },
    signalInfoValueRed: {
        color: "#e84345"
    },
    signalInfoValueGreen: {
        color: "green"
    },
    noData: {
        textAlign: "center",
        marginVertical: 30,
        fontSize: 15,
        color: "gray"
    },

});