import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { Button } from '@ant-design/react-native'
import { optimalStrategyListMore } from '../../service/index'
import { useEffect, useState } from 'react';


export default function UserServer({ navigation }) {
    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [backtestDate, setBacktestDate] = useState("--")
    const [hasMore, setHasMore] = useState(true)
    const [isDataArrive, setIsDataArrive] = useState(true)


    useEffect(() => {
        onGetClassicList()
    }, [])

    const onGetClassicList = () => {
        let data = {
            period: 6,
            page: page,
            size: size
        }
        optimalStrategyListMore(data).then(res => {
            if (res.code === 200) {
                let list = res.data.page_date
                setDataList(list)
                if (list.length > 0) {
                    setBacktestDate(list[0].lastTime)
                } else {
                    setBacktestDate('--')
                }
                if (res.data.total_page !== 0 && res.data.current_page > 0) {
                    if (res.data.current_page === res.data.total_page) {
                        setHasMore(false)
                    } else {
                        setPage(2)
                    }
                } else {
                    setHasMore(false)
                }
            }
        })

    }
    const loadMore = () => {
        let data = {
            period: 6,
            page: page,
            size: size
        }
        if (!isDataArrive || page === 1 || !hasMore) {
            return
        }
        setIsDataArrive(false)
        optimalStrategyListMore(data).then(res => {
            if (res.code === 200) {
                let list = res.data.page_date
                setDataList([...dataList, ...list])

                if (res.data.total_page !== 0 && res.data.current_page > 0) {
                    if (res.data.current_page === res.data.total_page) {
                        setHasMore(false)
                    } else {
                        setPage(page + 1)
                    }
                } else {
                    setHasMore(false)
                }
                setIsDataArrive(true)
            }
        }).catch(err => {
            setIsDataArrive(true)
        })
    }

    const navDetail = (content) => {
        navigation.navigate("classicDetail", { content: content })
    }

    const renderItem = ({ item }) => (
        <View style={styles.dataItem} >
            <View style={styles.strategyName}>
                <Text style={{ textAlign: "center" }}>{item.strategyName}</Text>
                <Text style={{ color: "gray" }}>({item.prodName})</Text>
            </View>
            <Text style={item.yield > 0 ? styles.rate : styles.rateGreen}>{item.yield}%</Text>
            <View style={styles.btnWrap}>
                <Button type="primary" size='small' style={{ width: 50 }}
                    onPress={() => navigation.navigate("classicSignalDetail", { id: item.id, code: item.prodCode })}
                >详情</Button>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.head}>
                <Text style={styles.headItem}>策略名</Text>
                <View style={styles.headItem}>
                    <Text style={{ color: "#666" }}>年收益率</Text>
                    <Text style={{ color: "#666" }}>({backtestDate})</Text>
                </View>
                <Text style={styles.headItem}>操作</Text>
            </View>
            <FlatList
                data={dataList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListFooterComponent={() => (
                    <Text style={styles.noMore}>没有更多了~</Text>
                )}
                onEndReachedThreshold={0.1}
                onEndReached={loadMore}
            />
            {/* {dataList.map((item, index) => {
                return (
                    <View style={styles.dataItem} key={index}>
                        <View style={styles.strategyName}>
                            <Text style={{ textAlign: "center" }}>{item.strategyName}</Text>
                            <Text style={{ color: "gray" }}>({item.prodName})</Text>
                        </View>
                        <Text style={item.yield > 0 ? styles.rate : styles.rateGreen}>{item.yield}%</Text>
                        <View style={styles.btnWrap}>
                            <Button type="primary" size='small' style={{ width: 50 }}>详情</Button>
                        </View>
                    </View>
                )
            })} */}


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: "#fff"
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        paddingVertical: 10
    },
    headItem: {
        flex: 1,
        textAlign: "center",
        alignItems: "center",
        color: "#666"
    },
    dataItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1
    },
    strategyName: {
        flex: 1,
        textAlign: "center",
        alignItems: "center"
    },
    rate: {
        flex: 1,
        textAlign: "center",
        color: "red",
    },
    rateGreen: {
        flex: 1,
        textAlign: "center",
        color: "green",
    },
    btnWrap: {
        flex: 1,
        textAlign: "center",
        alignItems: "center"
    },
    noMore: {
        textAlign: "center",
        paddingVertical: 15
    }

});