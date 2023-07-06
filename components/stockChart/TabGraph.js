import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
// import MiniuteGraph from './MiniuteGraph'
import KGraph from './Kchart'
import SelectIndicate from './SelectIndicate'
import { pixel } from '../../utils/index'

const window = Dimensions.get('window');

export default class TabGraph extends Component {
    constructor() {
        super()
        this.state = {
            tabIndex: 1,
            indicateIndex: 0,
            period: 6,
            isShowPicker: false,
            isShowMinGraph: false,
            moreList: ['分时', '日K', '周K', '月K', '1分', '5分', '15分', '30分', '60分'],
            isShowBoll: false,
        }
    }
    componentDidMount() {
      
    }
    tabGraphIndex(index) {
        let period = ""
        if (index === 0) {
            this.setState({ tabIndex: index, isShowMinGraph: true })
            return
        } else if (index === 1) {
            period = 6
        } else if (index === 2) {
            period = 7
        } else if (index === 3) {
            period = 8
        } else if (index === 4) {
            period = 1
        } else if (index === 5) {
            period = 2
        } else if (index === 6) {
            period = 3
        } else if (index === 7) {
            period = 4
        } else if (index === 8) {
            period = 5
        }
        this.setState({ tabIndex: index, period, isShowMinGraph: false }, () => {
            this.kChart.getData()
        })
    }
    //选择更多
    selectMore(index) {
        let period = ""
        if (index === 0) {
            period = 1
        } else if (index === 1) {
            period = 2
        } else if (index === 2) {
            period = 3
        } else if (index === 3) {
            period = 4
        } else if (index === 4) {
            period = 5
        }
        this.setState({ tabIndex: 4, period, isShowPicker: false, isShowMinGraph: false }, () => {
            this.kChart.getData()
        })
    }
    //保存Kchart组件到父组件中，方便之后调用子组件方法
    onRef(ref) {
        this.kChart = ref
        this.props.onRef(this)
    }
    //刷新K线图
    reload() {
        this.kChart.onClearInterval()
        this.kChart.getData()
    }
    refreshKline(code){
        this.kChart.getData(null,code)
    }
    //设置策略的买卖点,调用Kchart组件里的setStrategyPoint方法
    setStrategyPoint(data) {
        this.kChart.setStrategyPoint(data)
    }
    changeIndicate(index) {
        this.setState({ indicateIndex: index })
        this.kChart.changeIndicate(index)
    }
    showBoll() {
        this.setState({ isShowBoll: !this.state.isShowBoll })
    }
    showPicker() {
        this.setState({ isShowPicker: !this.state.isShowPicker })
    }
    //切换到日K线图,并设置买卖点
    tabDayLine(cb) {
        this.setState({ tabIndex: 1, period: 6, isShowPicker: false, isShowMinGraph: false }, () => {
            this.kChart.getData(cb)
        })
    }
    hasGetData(data) {
        // console.log('success')
        if (this.props.hasGetData) {
            this.props.hasGetData(data)
        }
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }
    render() {
        const { tabIndex, period, isShowPicker, isShowMinGraph, moreList } = this.state
        const theme = this.props.theme
        return (
            <View >
                {/* {!this.props.hideTabHeader ?
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.tab, { backgroundColor: theme.headerBg }]}>
                        {
                            moreList.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={this.tabGraphIndex.bind(this, index)} key={index}>
                                        <View style={styles.tabItem}>
                                            <Text style={tabIndex === index ? [styles.tabText, { color: theme.mainOrange }] : [styles.tabText, { color: theme.text }]}>{item}</Text>
                                            <View style={tabIndex === index ? [styles.line, { backgroundColor: theme.mainOrange }] : [styles.line, { backgroundColor: 'transparent' }]}></View>
                                        </View>
                                    </TouchableOpacity >
                                )
                            })
                        }
                    </ScrollView> : null
                } */}

                <View style={{ paddingTop: 0,backgroundColor:"#fff", paddingHorizontal: 10, marginBottom: 0 * pixel ,height:this.props.option.mainChartHeight+this.props.option.quoteChartHeight}}>
                    
                    <KGraph
                        indicateIndex={this.state.indicateIndex}
                        onRef={this.onRef.bind(this)}
                        period={period}
                        prodCode={this.props.prodCode}
                        hasGetData={this.hasGetData.bind(this)}
                        isShowBoll={this.state.isShowBoll}
                        theme={this.props.theme}
                        option={this.props.option} 
                    />
                    

                </View>
                {isShowMinGraph ? null : <SelectIndicate
                    theme={this.props.theme}
                    changeIndicate={this.changeIndicate.bind(this)}
                    indicateIndex={this.state.indicateIndex}
                    isShowBoll={this.state.isShowBoll}
                    showBoll={this.showBoll.bind(this)}
                />}

                {/* {isShowPicker ?
                    <View style={styles.selectMore}>
                        {MoreList}
                    </View> : null
                } */}

            </View >
        )
    }
}

const styles = StyleSheet.create({
    tab: {
        height: 35 * pixel,
        paddingHorizontal: 10,
        marginBottom: 10 * pixel,
    },
    tabItem: {
        width: 50 * pixel,
        justifyContent: "center",
        alignItems: "center",
        height: 35 * pixel,
        marginRight: 1,
    },
    line: {
        width: 10.5 * pixel,
        height: 3 * pixel,
        borderRadius: 1.5 * pixel,
        marginTop: 2,
    },

    tabText: {
        fontSize: 12.5 * pixel,
    },
    selectMore: {
        position: 'absolute',
        width: window.width / 5 - 2,
        right: 3,
        top: window.height * 0.045,
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    selectTextWrapper: {
        width: window.width / 5 - 2,
        backgroundColor: "#eee",
        marginBottom: 1,
        alignItems: "center"
    },

    selectText: {
        paddingVertical: 5,
        color: "#333",
    }
})