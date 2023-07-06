import React, { Component } from 'react'
import { View, Text as Texts, Image, TouchableOpacity, StyleSheet, Dimensions, PanResponder } from 'react-native'


import Svg, { Circle, Text, Path, Line, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { pixel } from '../../utils/index';
const window = Dimensions.get('window');

import Util from '../util';
import Service from '../service'

export default class MiniuteGrapg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'loading',
            data: [],
            chartWidth: (props.prodCode === '000001.SS' ||
                props.prodCode === '399001.SZ' ||
                props.prodCode === '399001.SZ' ||
                props.prodCode === '399006.SZ'
            ) ? (window.width - 20) : (window.width - 20) * 0.65, //主图的宽
            chartHeight: window.height * 0.22, //主图的高
            quoteWdith: window.width, //指标图的宽
            quoteHeight: window.height * 0.10, //指标图的高
            pointArr: [],
            cSpace: 5,
            isClick: false,

            index: 1,
            clickPoint: [],//鼠标点击 保存坐标
            currentPrice: "",//鼠标点击 保存当前价格
            riseFallValue: "",//鼠标点击 保存差价
            currentAveragePrice: "",//鼠标点击 保存均价
            currentRatio: "",
            currentTime: "",
            sellGrp: [1, 2, 3, 4, 5],
            buyGrp: [1, 2, 3, 4, 5]
        }
    }
    componentWillMount() {
        this.getData()
        this.getFivePrice()
        this.updateTime = setInterval(() => {
            this.getData()
            this.getFivePrice()
        }, 3000)
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gs) => {
                let x = gs.x0 - 10
                let y = gs.y0 - 50 - 8
                for (var i = 0; i < this.pointsList.length; i++) {
                    if (x >= parseFloat(this.pointsList[i].x) && x <= (parseFloat(this.pointsList[i].x) + this.pointWith)) {
                        this.setState({
                            clickPoint: [{ x: x + this.pointWith / 2, y: this.pointsList[i].y }],
                            currentPrice: this.pointsList[i].currentPrice,
                            riseFallValue: parseFloat(this.pointsList[i].currentPrice - this.openValue).toFixed(2),
                            currentAveragePrice: this.averagePpointsList[i].currentAveragePrice,
                            currentRatio: parseFloat((this.pointsList[i].currentPrice / this.openValue - 1) * 100).toFixed(2) + '%',
                            currentTime: this.pointsList[i].date,
                            currentVol: this.pointsList[i].vol,
                        })
                    }

                }
            },
            onPanResponderMove: (evt, gs) => {
                if (Math.abs(gs.dy) > 10) {
                    this.setState({ index: 1, clickPoint: [], currentPrice: "", riseFallValue: "", currentAveragePrice: "", currentRatio: "", currentTime: "", currentVol: "" })
                    return
                }
                let x = gs.moveX - 10
                let y = gs.y0 - 50 - 8
                for (var i = 0; i < this.pointsList.length; i++) {
                    if (x >= parseFloat(this.pointsList[i].x) && x <= (parseFloat(this.pointsList[i].x) + this.pointWith)) {
                        this.setState({
                            clickPoint: [{ x: x + this.pointWith / 2, y: this.pointsList[i].y }],
                            currentPrice: this.pointsList[i].currentPrice,
                            riseFallValue: parseFloat(this.pointsList[i].currentPrice - this.openValue).toFixed(2),
                            currentAveragePrice: this.averagePpointsList[i].currentAveragePrice,
                            currentRatio: parseFloat((this.pointsList[i].currentPrice / this.openValue - 1) * 100).toFixed(2) + '%',
                            currentTime: this.pointsList[i].date,
                            currentVol: this.pointsList[i].vol,
                        })
                        break
                    }
                }

            },
            onPanResponderRelease: (evt, gs) => {
                // clearInterval(this.moveingLeft)
                this.setState({ index: 1, clickPoint: [], currentPrice: "", riseFallValue: "", currentAveragePrice: "", currentRatio: "", currentTime: "", currentVol: "" })
            }
        })
    }
    //获取五档的信息
    getFivePrice() {
        const { period, prodCode } = this.props
        Util.post('https://real.pushutech.com/quote/multidata', { code: prodCode }, function (result) {

            const real = result.real[prodCode]
            let data = result.trend[prodCode].data
            // let obj = {
            //     categoryData: [0],
            //     values: [real.preclose_px],
            //     vol: [0]
            // }
            // for (let i = 0; i < data.length; i++) {
            //     obj.categoryData.push(data[i][0])
            //     obj.values.push(data[i][1])
            //     obj.vol.push(data[i][3])
            // }
            // console.log(obj) 

            let buyGrp = real.bid_grp
            let sellGrp = real.offer_grp
            sellGrp = sellGrp.split(',').slice(0, 15)
            buyGrp = buyGrp.split(',').slice(0, 15)
            let arr1 = []
            let arr2 = []
            for (let i = sellGrp.length - 1; i >= 0; i = i - 3) {
                let obj = {
                    price: sellGrp[i - 2],
                    value: sellGrp[i - 1]
                }
                arr1.push(obj)
            }
            for (let i = 0; i < buyGrp.length; i = i + 3) {
                let obj = {
                    price: buyGrp[i],
                    value: buyGrp[i + 1]
                }
                arr2.push(obj)
            }
            this.setState({
                sellGrp: arr1,
                buyGrp: arr2
            })
        }.bind(this))
    }
    //获取股票数据
    getData() {

        const { period, prodCode } = this.props
        Util.post(Service.host + '/quote/internal/kline', { prod_code: prodCode, period: period }, function (result) {
            let data = result.data.candle[prodCode]
            data = this.splitData(data)

            const allBarsNum = data.values.length
            let date = new Date()
            const year = date.getFullYear()
            let month = date.getMonth() + 1

            if (month.toString().length === 1) {
                month = '0' + month
            }
            let day = date.getDate()
            if (day.toString().length === 1) {
                day = '0' + day
            }
            let fullDay = "" + year + month + day + '0931'
            const index = data.categoryData.indexOf(parseInt(fullDay))
            let value = ''
            if (index > 0) {
                value = data.values.slice(index - 1, allBarsNum).map(item => {
                    return item[3]
                })
            } else {
                value = data.values.slice(allBarsNum - 240 - 1, allBarsNum).map(item => {
                    return item[3]
                })
            }
            this.averageValueList = []
            for (let i = 0; i < value.length; i++) {
                let averageValue = value.slice(0, i + 1).reduce((pre, current) => {
                    return pre + current
                })
                this.averageValueList.push(parseFloat(averageValue / (i + 1)).toFixed(2))
            }
            //当前均价
            this.currentAverageValue = this.averageValueList[this.averageValueList.length - 1]

            this.openValue = value[0]
            this.maxValue = Math.max(...value)
            this.minValue = Math.min(...value)
            let maxRatio = this.maxValue / this.openValue - 1
            let minRatio = 1 - this.minValue / this.openValue
            this.ratio = Math.max(maxRatio, minRatio, 0.01)
            this.maxValue = parseFloat(this.openValue * (1 + this.ratio)).toFixed(2)
            this.minValue = parseFloat(this.openValue * (1 - this.ratio)).toFixed(2)

            this.currentPrice = value[value.length - 1]
            //当前涨跌幅率
            this.currentRatio = parseFloat((this.currentPrice / this.openValue - 1) * 100).toFixed(2) + '%'
            //当前涨跌值
            this.riseFallValue = parseFloat(this.currentPrice - this.openValue).toFixed(2)
            this.setState({
                status: 'success',
                data: data,
                currentData: {
                    ...data,
                    values: value,
                    valueList: index > 0 ? data.values.slice(index, allBarsNum) : data.values.slice(allBarsNum - 240, allBarsNum),
                    categoryData: index > 0 ? data.categoryData.slice(index, allBarsNum) : data.categoryData.slice(allBarsNum - 240, allBarsNum),
                    vol: index > 0 ? data.vol.slice(index, allBarsNum) : data.vol.slice(allBarsNum - 240, allBarsNum)
                },
            })
        }.bind(this))
    }


    //重新组织数据
    splitData(rawData) {
        var categoryData = [];
        var values = []
        let vol = []
        for (var i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i].splice(0, 1)[0]);
            vol.push(rawData[i].splice(4, 5)[0])
            values.push(rawData[i])
        }

        return {
            categoryData: categoryData,
            values: values,
            vol,
        };
    }
    //序列化参数
    stringifyURL(params, postFlag) {
        var paramUrl = '';
        for (var key in params) {
            if (!postFlag && paramUrl === '') {
                paramUrl += '?' + key + '=' + encodeURIComponent(params[key]);
            }
            else {
                paramUrl += '&' + key + '=' + encodeURIComponent(params[key]);
            }
        }
        return paramUrl;
    }

    //画分割线 及文字
    drawMarker() {
        const { chartWidth, chartHeight } = this.state
        const theme = this.props.theme
        let oneValue = chartHeight / 4
        let oneWidth = chartWidth / 4
        let arr = []
        for (var i = 1; i < 4; i++) {
            if (i === 2) {
                arr.push(
                    <Line
                        x1={0}
                        y1={oneValue * i}
                        x2={chartWidth}
                        y2={oneValue * i}
                        stroke={theme.lightBgLine}
                        strokeWidth={1}
                        key={i}
                    />)
                arr.push(
                    <Line
                        x1={oneWidth * i}
                        y1={0}
                        x2={oneWidth * i}
                        y2={chartHeight}
                        stroke={theme.lightBgLine}
                        strokeWidth={1}
                        key={i + 0.1}
                    />)
            } else {
                arr.push(
                    <Line
                        x1={0}
                        y1={oneValue * i}
                        x2={chartWidth}
                        y2={oneValue * i}
                        stroke={theme.lightBgLine}
                        strokeWidth={1}
                        strokeDasharray="2,2"
                        key={i}
                    />)
                arr.push(
                    <Line
                        x1={oneWidth * i}
                        y1={0}
                        x2={oneWidth * i}
                        y2={chartHeight}
                        stroke={theme.lightBgLine}
                        strokeWidth={1}
                        strokeDasharray="2,2"
                        key={i + 0.1}
                    />)
            }
        }
        return arr
    }
    //画成交量 分割线
    drawVolMarker() {
        const theme = this.props.theme
        const { chartWidth, quoteHeight } = this.state
        let oneValue = quoteHeight / 4
        let oneWidth = chartWidth / 4

        let arr = []
        arr.push(
            <Line
                x1={0}
                y1={quoteHeight / 2}
                x2={chartWidth}
                y2={quoteHeight / 2}
                stroke={theme.lightBgLine}
                strokeWidth={1}
                strokeDasharray="2,2"
                key={0}
            />)
        for (var i = 1; i < 4; i++) {
            if (i === 2) {
                arr.push(
                    <Line
                        x1={oneWidth * i}
                        y1={0}
                        x2={oneWidth * i}
                        y2={quoteHeight}
                        stroke={theme.lightBgLine}
                        strokeWidth={1}
                        key={i + 0.1}
                    />)
            } else {
                arr.push(
                    <Line
                        x1={oneWidth * i}
                        y1={0}
                        x2={oneWidth * i}
                        y2={quoteHeight}
                        stroke={theme.lightBgLine}
                        strokeWidth={1}
                        strokeDasharray="2,2"
                        key={i + 0.1}
                    />)
            }
        }


        return arr
    }
    //画分时图
    drawMinLine() {
        const theme = this.props.theme
        const valueList = this.state.currentData.values
        const dateList = this.state.currentData.categoryData
        const volList = this.state.currentData.vol
        const { chartWidth, chartHeight } = this.state
        this.pointWith = chartWidth / 240
        //计算每个点的坐标
        this.pointsList = []
        this.averagePpointsList = []

        for (let i = 0; i < valueList.length; i++) {
            let x = i * this.pointWith
            let y = chartHeight - chartHeight * (valueList[i + 1] - this.minValue) / (this.maxValue - this.minValue)
            let aY = chartHeight - chartHeight * (this.averageValueList[i + 1] - this.minValue) / (this.maxValue - this.minValue)
            this.pointsList.push({ x: parseFloat(x).toFixed(2), y: parseFloat(y).toFixed(2), currentPrice: valueList[i + 1], date: dateList[i + 1], vol: volList[i + 1] })
            this.averagePpointsList.push({ x: parseFloat(x).toFixed(2), y: parseFloat(aY).toFixed(2), currentAveragePrice: this.averageValueList[i + 1] })
        }

        let pointStr = ''
        let avaterPointStr = ''
        for (let i = 0; i < this.pointsList.length - 1; i++) {
            if (i === 0) {
                pointStr = `M${0} ${this.pointsList[i].y} `
                avaterPointStr = `M${0} ${this.averagePpointsList[i].y} `

            } else {
                pointStr = pointStr + `L${this.pointsList[i].x} ${this.pointsList[i].y} `
                avaterPointStr = avaterPointStr + `L${this.averagePpointsList[i].x} ${this.averagePpointsList[i].y} `
            }
        }

        let arr = []
        arr.push(<Path
            key={1}
            d={pointStr}
            fill="transparent"
            stroke={theme.mainOrange}
        />)


        let lastPoint = this.pointsList[this.pointsList.length - 2]
        pointStr = pointStr + `V${chartHeight - 1} H1  Z`

        arr.push(<Path
            key={2}
            d={pointStr}
            fillOpacity={0.3}
            fill={theme.mainOrange}
            // fill="url(#grad)"
            stroke={'transparent'}
        />)

        arr.push(<Path
            key={3}
            d={avaterPointStr}
            fill="transparent"
            stroke={'#ffce09'}
            fillOpacity={0.5}
        />)
        //数值信息
        arr.push(
            <Text key={4} x={3} y={10} fill={theme.mainOrange} fontSize={11}>
                {this.maxValue}
            </Text>
        ) 
        arr.push(
            <Text key={5} x={chartWidth - 38} y={10} fill={theme.mainOrange} fontSize={11}>
                {(parseFloat(this.ratio * 100).toFixed(2) ? parseFloat(this.ratio * 100).toFixed(2) : 0) + '%'}
            </Text>
        )
        arr.push(
            <Text key={6} x={3} y={chartHeight - 5} fill={theme.greenBar} fontSize={11}>
                {this.minValue}
            </Text>
        )
        arr.push(
            <Text key={7} x={chartWidth - 38} y={chartHeight - 5} fill={theme.greenBar} fontSize={11}>
                -{(parseFloat(this.ratio * 100).toFixed(2) ? parseFloat(this.ratio * 100).toFixed(2) : 0) + '%'}
            </Text>
        )
        arr.push(
            <Text key={8} x={3} y={chartHeight / 2 + 3} fill={theme.bigText} fontSize={11} fillOpacity={0.8}>
                {this.openValue}
            </Text>
        )
        return arr
    }
    //画成交量
    drawVol(dataList) {
        const theme = this.props.theme
        const { chartWidth, quoteHeight } = this.state
        this.maxVol = Math.max.apply(null, dataList.vol)
        this.minVol = Math.min.apply(null, dataList.vol)
        let color = "#30C7C9";
        let arr = []

        for (var i = 0; i < dataList.vol.length; i++) {
            let data = dataList.valueList[i]
            let volVal = dataList.vol[i]
            let color = "rgb(13,244,155)"; //绿色
            let disY = 0;
            // //开盘0 最高1 最低2 收盘3  
            if (data[3] >= data[0]) { //涨
                color = theme.mainOrange; //红色
            } else {
                color = theme.greenBar
            }
            var barH = parseInt(quoteHeight * (volVal) / (this.maxVol));
            var y = quoteHeight - barH;
            var x = this.pointWith * i;
            arr.push(
                <Rect
                    key={i}
                    x={x}
                    y={y}
                    width={0.3}
                    height={barH}
                    fill={color}
                />
            )

        }
        return arr
    }
    componentWillUnmount() {
        clearInterval(this.updateTime)
    }

    //画十字线
    drawCrossLine(x, y) {
        const theme = this.props.theme
        const { clickPoint, currentPrice, riseFallValue, currentAveragePrice, chartWidth, chartHeight } = this.state
        let arr = []
        arr.push(
            < Line
                x1={0}
                y1={parseFloat(clickPoint[0].y)}
                x2={chartWidth}
                y2={parseFloat(clickPoint[0].y)}
                stroke="#888"
                strokeWidth={0.5}
                key={1}
            />
        )
        arr.push(
            < Line
                x1={clickPoint[0].x}
                y1={chartHeight}
                x2={clickPoint[0].x}
                y2={0}
                stroke="#888"
                strokeWidth={0.5}
                key={2}
            />
        )
        return arr
    }
    drawDate() {
        const theme = this.props.theme
        const { clickPoint, chartWidth, quoteHeight, currentTime } = this.state
        if (!currentTime) {
            return
        }
        let arr = []
        arr.push(
            < Line
                x1={clickPoint[0].x}
                y1={quoteHeight}
                x2={clickPoint[0].x}
                y2={0}
                stroke="#888"
                strokeWidth={0.5}
                key={2}
            />
        )
        arr.push(
            <Text
                key={1}
                x={clickPoint[0].x - 13}
                y={quoteHeight - 5}
                fill={theme.bigText}
                fontSize={12}
            >{currentTime.toString().substring(8)}</Text>
        )
        return arr
    }

    render() {
        const { chartWidth, chartHeight, quoteHeight, status, currentData, sellGrp, buyGrp, clickPoint,
            currentPrice, riseFallValue, currentAveragePrice, currentRatio, currentVol
        } = this.state
        const { period, prodCode, theme } = this.props
        let isBigCode = ""
        if (prodCode === '000001.SS' ||
            prodCode === '399001.SZ' ||
            prodCode === '399001.SZ' ||
            prodCode === '399006.SZ'
        ) {
            isBigCode = true
        }
        const SellGrp = sellGrp.map((item, index) => {
            return (
                <View style={styles.fivePriceItem} key={index}>
                    <Texts style={{ fontSize: 11, color: theme.text, width: 20, marginLeft: 5 }}>卖{sellGrp.length - index}</Texts>
                    <View style={{ width: 55, justifyContent: "center", alignItems: "center" }}>
                        <Texts style={{ fontSize: 11, color: theme.mainOrange, }}>{item.price}</Texts>
                    </View>

                    <Texts style={{ fontSize: 11, color: theme.text }}>{parseInt(parseInt(item.value) / 100)}</Texts>
                </View>
            )
        })
        const BuyGrp = buyGrp.map((item, index) => {
            return (
                <View style={styles.fivePriceItem} key={index}>
                    <Texts style={{ fontSize: 11, color: theme.text, width: 20, marginLeft: 5 }}>买{index + 1}</Texts>
                    <View style={{ width: 55, justifyContent: "center", alignItems: "center" }}>
                        <Texts style={{ fontSize: 11, color: theme.mainOrange }}>{item.price}</Texts>
                    </View>
                    <Texts style={{ fontSize: 11, color: theme.text }}>{parseInt(parseInt(item.value) / 100)}</Texts>
                </View>
            )
        })

        if (status === 'success') {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} {...this._panResponder.panHandlers}>
                    <View style={[styles.wrapper, { backgroundColor: theme.moduleBg, borderColor: theme.lightBgLine }]}>
                        <View style={[styles.newData, { borderColor: theme.lightBgLine }]}>
                            <Texts style={[styles.newDataText, { fontSize: 11 * pixel, color: theme.bigText }]}>均价 </Texts>
                            <Texts style={[styles.newDataText, { marginRight: 10, fontSize: 11 * pixel, color: theme.mainOrange }]}> {currentAveragePrice ? currentAveragePrice : this.currentAverageValue}</Texts>
                            <Texts style={[styles.newDataText, { fontSize: 11 * pixel, color: theme.bigText }]}>最新 </Texts>
                            <Texts style={[styles.newDataText, { fontSize: 11 * pixel, color: theme.mainOrange }]}>{currentPrice ? currentPrice : this.currentPrice}</Texts>
                        </View>
                        <Svg height={chartHeight} width={chartWidth}>
                            {/* <Defs>
                                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="100%"   gradientUnits="userSpaceOnUse">
                                    <Stop offset="0" stopColor={theme.mainOrange} stopOpacity="1" />
                                    <Stop offset="1" stopColor={theme.mainOrange}  stopOpacity="0" />
                                </LinearGradient>
                            </Defs> */}
                            <Path
                                d={`M0 0 h${chartWidth} V${chartHeight} h${-chartWidth} Z`}
                                stroke={theme.lightBgLine}
                                strokeWidth="1"
                                fill="transparent"
                            />
                            {this.drawMarker()}
                            {this.drawMinLine()}
                            {clickPoint.length > 0 ? this.drawCrossLine(clickPoint[0].x, clickPoint[0].y) : null}

                        </Svg>
                        <View style={[styles.volTime, { width: chartWidth }]}>
                            <Texts style={{ fontSize: 11 * pixel, color: theme.text, }}>9:30</Texts>
                            <Texts style={{ fontSize: 11 * pixel, color: theme.text, }}>11:30</Texts>
                            <Texts style={{ fontSize: 11 * pixel, color: theme.text, }}>15:00</Texts>
                        </View>

                        <Svg height={quoteHeight} width={chartWidth}>
                            <Path
                                d={`M0 0 h${chartWidth} V${quoteHeight} h${-chartWidth} Z`}
                                stroke={theme.lightBgLine}
                                strokeWidth="1"
                                fill="transparent"
                            />
                            {this.drawVolMarker()}
                            {this.drawVol(currentData)}
                            {clickPoint.length > 0 ? this.drawDate() : null}

                        </Svg>
                        <View style={styles.volMessage}>
                            <Texts style={{ fontSize: 11 * pixel, color: theme.text, }}>分时量：{currentVol ? currentVol : currentData.vol[currentData.vol.length - 1]}</Texts>
                            <Texts style={{ fontSize: 11 * pixel, color: theme.text, }}>现手：6481</Texts>
                        </View>

                    </View>
                    {!isBigCode ?
                        <View style={[styles.fivePriceWrapper, { backgroundColor: theme.moduleBg, borderColor: theme.lightBgLine }]}>
                            <View style={[styles.fivePriceHeader, { backgroundColor: theme.moduleBg, borderColor: theme.lightBgLine }]}>
                                <Texts style={{ fontSize: 11 * pixel, color: theme.text }}>五档</Texts>
                            </View>
                            <View style={{ borderColor: theme.lightBgLine, borderBottomWidth: 1 }}>
                                {SellGrp}
                            </View>
                            {BuyGrp}
                        </View>
                        : null}

                </View>

            )
        } else {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", height: 303 }}>
                    <Texts style={{ color: "#fff" }}>加载中...</Texts>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 0,
        marginBottom: 0,
        borderWidth: 1,
        // height: 308 * pixel,
    },
    newData: {
        flexDirection: 'row',
        height: 27 * pixel,
        alignItems: "center",
        paddingLeft: 5 * pixel,

    },
    newDataText: {
        fontSize: 12,
        color: '#666',
    },
    volMessage: {
        flexDirection: 'row',
        justifyContent: "space-between",
        position: "absolute",
        width: "100%",
        left: 0,
        top: window.height * 0.22 + 56 * pixel,
        paddingHorizontal: 5 * pixel,
    },
    volTime: {
        height: 27 * pixel,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between'
    },
    fivePriceWrapper: {
        borderWidth: 1,
        width: (window.width - 20) * 0.31,
        // height: 308 * pixel,

        // marginBottom: 10
    },
    fivePriceHeader: {
        height: 27 * pixel,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
    },
    fivePriceItem: {
        flexDirection: "row",
        height: 28 * pixel,
        alignItems: "center",
    }
})