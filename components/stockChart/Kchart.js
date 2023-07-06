import React, { Component } from 'react';
import { View, StyleSheet, Text as Texts, Dimensions, PanResponder, TouchableOpacity, Alert } from 'react-native';

import Svg, {
  Circle,
  Text,
  Path,
  Line,
  Rect,
} from 'react-native-svg';
import { calcKDJ } from './kdj'
import calcMACD from './macd'
import calculateRSI from './rsi'
import calculateBoll from './boll'
import { pixel } from '../../utils/index';
import {getNewKline} from '../../service/index'
// import {Toast} from "antd-mobile-rn/lib/index.native";

// import Util from '../util';
// import Service from '../../service'

const window = Dimensions.get('window');

//找到最大值和最小值
function maxAndMinData(values) {
  let maxValue = 0
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (values[i][j] > maxValue) {
        maxValue = values[i][j]
      }
    }
  }
  let minValue = maxValue
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (values[i][j] < minValue) {
        minValue = values[i][j]
      }
    }
  }
  return {
    minValue,
    maxValue
  };
}



let MaColor = {
  MA5: "#ff6666",
  MA10: "#33cc99",
  MA20: "#ffcc00",
}
let macdColor = {
  dif: "red",
  dea: 'yellow',
  barUp: 'red',
  barDown: 'green',
  m: "green"
}
let rsiColor = {
  rsi1: "#ff6666",
  rsi2: "#33cc99",
  rsi3: "#ffcc00",
}

export default class Kchart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: 'loading',
      data: [],
      chartWidth: window.width - 30, //主图的宽
      charHeight: props.option.mainChartHeight, //主图的高
      quoteWdith: window.width, //指标图的宽
      quoteHeight: props.option.quoteChartHeight, //指标图的高
      endPoint: props.option.endPoint ? props.option.endPoint : 0,  //最后一点距离终点的个数
      kBarBumber: 40,
      cMargin: 0,   //canvas内边距
      pointArr: [],
      totalYNomber: 9, //y轴上的标识数量
      cSpace: 5,
      isClick: false,
      currentPrice: '',
      MA5: [],
      MA10: [],
      MA20: [],
      MA30: [],
      index: 1,
      clickPoint: [],//鼠标点击 保存坐标
      shrinkNum: 0,//缩小次数
      indicateIndex: 0,//指标下标,
      currentMa: "",
      currentVol: "",
      currentMACD: "",
      currentKDJ: "",
      currentBollList: "",
    }
  }
  //获取股票数据
  getData(cb,code) {
    this.setState({ status: 'loading', endPoint: this.props.option.endPoint })
    // Toast.loading('加载中', 0, null, true)
    let { endPoint } = this.state

    const { period, prodCode } = this.props
    getNewKline({prod_code: code?code:prodCode, period: period ,count:500}).then(result=>{
      let data = result.data.candle[code?code:prodCode]
      if(data.length==0){
        Alert.alert(
          "提示",
          "股票代码错误",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
        return;
      }
      data = this.splitData(data)
      const allBarsNum = data.values.length

      //数据数量小于40
      let kBarBumber = 40
      if (allBarsNum < 40) {
        kBarBumber = allBarsNum
      }
      //建立买卖点
      let sellPoint = []
      for (let i = 0; i < allBarsNum; i++) {
        sellPoint.push(0)
      }
      data.sellPoint = sellPoint


      let input = data.values.map((item, index) => {
        return { open: item[0], close: item[3], low: item[2], high: item[1] }
      })
      this.kdj = calcKDJ(9, 3, 3, input)
      this.macd = calcMACD(data.values)
      this.rsi = calculateRSI(data.values)
      this.boll = calculateBoll(20, data)

      const beginDate = data.categoryData[allBarsNum - endPoint - 1]
      const lastDate = data.categoryData[allBarsNum - endPoint - 1 + 30]

      // Toast.hide()
      this.setState({
        kBarBumber,
        data: data,
        currentData: {
          ...data,
          sellPoint: sellPoint.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
          values: data.values.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
          categoryData: data.categoryData.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
          vol: data.vol.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint)
        },
        MA5: this._calculateMA(5, data),
        MA10: this._calculateMA(10, data),
        MA20: this._calculateMA(20, data),
        MA30: this._calculateMA(30, data)
      }, () => {
        if (cb) {
          cb()
        }
        this.setState({ status: 'success' })
        const obj = { beginDate, lastDate }
        this.props.hasGetData(obj)
        // this.updateKLine = setInterval(() => {
        //   this.refreshBars()
        // }, 3000)
      })

    })
   
  }
  //刷新最后一根K线
  refreshBars() {
    const { period, prodCode } = this.props
    const datas = this.state.data
    const len = datas.values.length
    // Util.post(Service.host + '/quote/internal/lastkline', { prod_code: prodCode, period: period }, function (result) {
    //   let data = result.data.candle[prodCode][1]
    //   data = this.splitData([data])
    //   datas.values[len - 1] = data.values[0]
    //   datas.vol[len - 1] = data.vol[0]
    //   this.setState({
    //     ...this.state,
    //     data: datas,
    //   })
    // }.bind(this), (err) => {
    //   console.log(err)
    //   if (this.updateKLine) {
    //     clearInterval(this.updateKLine)
    //   }
    // })
  }
  //计算均线点
  _calculateMA(dayCount, data) {
    var result = [];
    const allData = data
    for (var i = 0, len = allData.values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += allData.values[i - j][3];
      }
      result.push(parseFloat(sum / dayCount).toFixed(2));
    }
    return result
  }
  componentDidMount() {
    this.props.onRef(this)
  }

  UNSAFE_componentWillMount() {
    // this.getData()
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gs) => {
        let x = gs.x0 - 8
        let y = gs.y0 - 50 - 8
        for (var i = 0; i < this.pointArr.length; i++) {
          if (x >= this.pointArr[i].x && x <= (this.pointArr[i].x + this.bWidth)) {
            this.setState({
              clickPoint: [{ x: x, y: y }],
              currentPrice: this.pointArr[i].currentPrice,
              currentMa: {
                MA5: this.pointArr[i].Ma5Value,
                MA10: this.pointArr[i].Ma10Value,
                MA20: this.pointArr[i].Ma20Value,
              },
              currentVol: this.pointArr[i].vol,
              currentMACD: this.pointArr[i].macd,
              currentRIS: this.pointArr[i].rsi,
              currentKDJ: this.pointArr[i].kdj,
              currentBollList: this.pointArr[i].boll
            })
            break
          }
        }

      },
      onPanResponderMove: (evt, gs) => {
        if (Math.abs(gs.dy) > 10) {
          this.setState({
            index: 1, clickPoint: [],
            currentPrice: "", currentMa: "", currentVol: "", currentMACD: "",
            currentRIS: "", currentKDJ: "", currentBollList: ""
          })
          return
        }
        let x = gs.moveX - 8
        let y = gs.y0 - 50 - 8
        for (var i = 0; i < this.pointArr.length; i++) {
          if (x >= this.pointArr[i].x && x <= (this.pointArr[i].x + this.bWidth)) {
            this.setState({
              clickPoint: [{ x: x, y: y }],
              currentPrice: this.pointArr[i].currentPrice,
              currentMa: {
                MA5: this.pointArr[i].Ma5Value,
                MA10: this.pointArr[i].Ma10Value,
                MA20: this.pointArr[i].Ma20Value,
              },
              currentVol: this.pointArr[i].vol,
              currentMACD: this.pointArr[i].macd,
              currentRIS: this.pointArr[i].rsi,
              currentKDJ: this.pointArr[i].kdj,
              currentBollList: this.pointArr[i].boll
            })
            break
          }
        }
      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({ index: 1, clickPoint: [], currentPrice: "", currentMa: "", currentVol: "", currentMACD: "", currentRIS: "", currentKDJ: "", currentBollList: "" })
      }
    })
  }
  onClearInterval() {
    clearInterval(this.updateKLine)
  }
  componentWillUnmount() {
    clearInterval(this.updateKLine)
    this.setState = (state, callback) => {
      return;
    };
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

  //画坐标及标记点
  drawMarkers(maxValue, minValue, totalYNomber, originX, originY, cWidth, cHeight) {
    const theme = this.props.theme
    const oneVal = (maxValue - minValue) / totalYNomber
    let arr = []
    for (var i = 1; i <= totalYNomber; i++) {
      var markerVal = parseFloat(i * oneVal + minValue).toFixed(2);
      var xMarker = originX + cWidth;
      var yMarker = originY - cHeight * (markerVal - minValue) / (maxValue - minValue);
      arr.push(
        <Text
          key={yMarker + 0.01}
          x={xMarker + 5}
          y={yMarker + 5}
          fontSize={11}
          fill={theme.text}
        >
          {markerVal}
        </Text>)
      if (i > 0) {
        arr.push(
          <Line
            key={yMarker + 0.001}
            x1={xMarker}
            y1={yMarker}
            x2={xMarker + 5}
            y2={yMarker}
            stroke={theme.lightBgLine}
            strokeWidth={1}
          />
        )
        arr.push(
          <Line
            key={i + 10}
            x1={xMarker}
            y1={yMarker}
            x2={originX}
            y2={yMarker}
            // strokeDasharray="5,5"
            stroke={theme.lightBgLine}
            strokeWidth={0.5}
          />)
      }
    }
    return arr
  }

  //画K线,买卖点
  drawKBar(allBarsNum, kBarBumber, endPoint, dataList, maxValue, minValue, cHeight, originX, originY, bWidth, bMargin) {
    const theme = this.props.theme
    this.point_MA5 = []
    this.point_MA10 = []
    this.point_MA20 = []
    this.point_MA30 = []
    this.pointArr = []

    let arr = []
    //开始计算均线点
    let { MA5, MA10, MA20, MA30 } = this.state

    MA5 = MA5.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint);
    MA10 = MA10.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint);
    MA20 = MA20.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint);
    MA30 = MA30.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint);
    for (var i = 0; i < kBarBumber; i++) {
      let data = dataList.values[i]
      let date = dataList.categoryData[i] //日期
      let sellPoint = dataList.sellPoint[i]
      let vol = dataList.vol[i]

      var color = theme.greenBar; //绿色
      var barVal = data[0];
      var disY = 0; //开盘价与收盘价的差值 
      //开盘0 最高1 最低2 收盘3  
      if (data[3] >= data[0]) { //涨
        color = theme.mainOrange; //红色
        barVal = data[3];
        disY = data[3] - data[0];
      } else {
        disY = data[0] - data[3];
      }

      var showH = disY / (maxValue - minValue) * cHeight; //每根K线的高度（在Y轴上，开盘到收盘）

      showH = showH > 2 ? showH : 2;

      var barH = parseInt(cHeight * (barVal - minValue) / (maxValue - minValue));
      var y = originY - barH;

      var x = originX + (bWidth + bMargin) * i;
      arr.push(
        <Path
          key={i + 0.1}
          d={`M${x} ${y} h${bWidth} v${showH} h${-bWidth} Z`}
          fill={color}
        />
      )

      let kdj = {
        k: this.currentKDJ.k[i],
        d: this.currentKDJ.d[i],
        j: this.currentKDJ.j[i],
      }
      let macd = {
        dif: this.currentMACD.dif[i],
        dea: this.currentMACD.dea[i],
        m: this.currentMACD.bar[i],
      }
      let rsi = {
        rsi1: this.currentRSI.rsi1[i],
        rsi2: this.currentRSI.rsi2[i],
        rsi3: this.currentRSI.rsi3[i],
      }
      let boll = {
        up: this.currentBOLL.up[i],
        middle: this.currentBOLL.middle[i],
        down: this.currentBOLL.down[i]
      }

      //保存每日的收盘价
      if (data[3] >= data[0]) {
        this.pointArr.push({ x: x + parseFloat(bWidth / 2) - 1, y: y, barVal: data[3], currentPrice: data, Ma5Value: MA5[i], Ma10Value: MA10[i], Ma20Value: MA20[i], Ma30Value: MA30[i], date, vol, macd, rsi, kdj, boll })
      } else {
        this.pointArr.push({ x: x + parseFloat(bWidth / 2) - 1, y: y + showH, barVal: data[3], currentPrice: data, Ma5Value: MA5[i], Ma10Value: MA10[i], Ma20Value: MA20[i], Ma30Value: MA30[i], date, vol, macd, rsi, kdj, boll })
      }

      //计算每个均线点线的X坐标
      this._calculateMaX(i, MA5, MA10, MA20, MA30, originX, bWidth, bMargin)

      // //最高最低的线
      showH = (data[1] - data[2]) / (maxValue - minValue) * cHeight;
      showH = showH > 2 ? showH : 2;

      y = originY - parseInt(cHeight * (data[1] - minValue) / (maxValue - minValue));
      arr.push(
        <Path
          key={i}
          d={`M${x + parseFloat(bWidth / 2) - 0.5} ${y} h${1} v${showH} h${-1} Z`}
          fill={color}
        />
      )
      //画买卖点
      //根据K线数量设置买卖点大小
      let r = 6
      let fontSize = 8
      if (this.state.kBarBumber >= 80 && this.state.kBarBumber <= 150) {
        r = 3
        fontSize = 3
      } else if (this.state.kBarBumber > 150) {
        r = 2
        fontSize = 1
      }
      else if (this.state.kBarBumber < 25) {
        r = 8
        fontSize = 10
      }
      if (sellPoint === 1) {
        arr.push(
          <Circle
            key={i + 'circleBuy'}
            cx={x + parseFloat(bWidth / 2)}
            cy={y + showH + 9}
            r={r}
            fill="#fa6d41" />
        )
        arr.push(
          <Text
            key={i + 'buy'}
            x={x + parseFloat(bWidth / 2) - 4}
            y={y + showH + 12}
            fontSize={fontSize}
            fill="#fff" >买</Text>
        )
      } else if (sellPoint === 2) {
        arr.push(
          <Circle
            key={i + 'circleSell'}
            cx={x + parseFloat(bWidth / 2)}
            cy={y - 8}
            r={r}
            fill="#96d544" />
        )
        arr.push(
          <Text
            key={i + 'sell'}
            x={x + parseFloat(bWidth / 2) - 4}
            y={y - 4}
            fontSize={fontSize}
            fill="#fff" >卖</Text>
        )
      }

    }
    return arr

  }
  //画买卖点
  drawSellPoint(y, showH, sellPoint) {

  }
  //画成交量
  drawVol(dataList) {
    const theme = this.props.theme
    const { kBarBumber } = this.state
    this.maxVol = Math.max.apply(null, dataList.vol)
    this.minVol = Math.min.apply(null, dataList.vol)
    let arr = []
    for (var i = 0; i < kBarBumber; i++) {
      let data = dataList.values[i]
      let volVal = dataList.vol[i]
      let color = theme.greenBar; //绿色
      let disY = 0;
      //开盘0 最高1 最低2 收盘3  
      if (data[3] >= data[0]) { //涨
        color = theme.mainOrange; //红色
      } else {
        color = theme.greenBar
      }
      var barH = parseInt((this.qHeight - 15) * (volVal) / (this.maxVol));
      var y = this.quoteOriginY - barH;
      var x = this.quoteOriginX + (this.bWidth + this.bMargin) * i;
      arr.push(
        <Path
          key={i}
          d={`M${x} ${y} h${this.bWidth} v${barH} h${-this.bWidth} Z`}
          fill={color}
        />
      )

    }
    return arr
  }

  //计算每个均线点线的X坐标
  _calculateMaX(i, MA5, MA10, MA20, MA30, originX, bWidth, bMargin) {
    var x = originX + ((bWidth + bMargin) * i);
    this._drawMA(MA5, i, x, "MA5", bWidth);
    this._drawMA(MA10, i, x, "MA10", bWidth);
    this._drawMA(MA20, i, x, "MA20", bWidth);
    // this._drawMA(this.MA30, i, x, "MA30");
  }

  //计算均线点的坐标
  _drawMA(MA, i, x, type, bWidth) {
    var MA5_ox1, MA5_oy1, MA5_ox2, MA5_oy2;
    var MA10_ox1, MA10_oy1, MA10_ox2, MA10_oy2;
    var MA20_ox1, MA20_oy1, MA20_ox2, MA20_oy2;
    var MA30_ox1, MA30_oy1, MA30_ox2, MA30_oy2;

    var MAVal = MA[i];
    var MAH = parseInt(this.cHeight * (MAVal - this.minValue) / (this.maxValue - this.minValue));
    var MAy = this.originY - MAH;
    if (type == "MA5") {
      MA5_ox1 = parseInt(x + bWidth / 2);
      MA5_oy1 = MAy;
      this.point_MA5.push({ x: MA5_ox1, y: MA5_oy1 });
    }
    if (type == "MA10") {
      MA10_ox1 = parseInt(x + bWidth / 2);
      MA10_oy1 = MAy;
      this.point_MA10.push({ x: MA10_ox1, y: MA10_oy1 });
    }
    if (type == "MA20") {
      MA20_ox1 = parseInt(x + bWidth / 2);
      MA20_oy1 = MAy;
      this.point_MA20.push({ x: MA20_ox1, y: MA20_oy1 });
    }
    if (type == "MA30") {
      MA30_ox1 = parseInt(x + bWidth / 2);
      MA30_oy1 = MAy;
      this.point_MA30.push({ x: MA30_ox1, y: MA30_oy1 });
    }
  }

  //绘制均须
  _drawMAline() {
    //画均线
    let arr = []
    let MA5Line = this._drawBezier(this.point_MA5, MaColor.MA5, 1);
    let MA10Line = this._drawBezier(this.point_MA10, MaColor.MA10, 2);
    let MA20Line = this._drawBezier(this.point_MA20, MaColor.MA20, 3);
    // this._drawBezier(this.point_MA30, "rgb(212,130,101)");
    arr = [MA5Line, MA10Line, MA20Line]
    return arr.map((item, index) => {
      return <Path
        key={index}
        d={item.pointStr}
        fill="transparent"
        stroke={item.color}
      />
    })
  }

  //贝塞尔曲线
  _drawBezier(point, color, num, key) {
    let pointStr = ''
    for (let i = 0; i < point.length; i++) {
      if (i === 0 && point[i].y) {
        pointStr = `M${point[i].x} ${point[i].y} `

      } else if (i > 0 && point[i].y && !point[i - 1].y) {
        pointStr = `M${point[i].x} ${point[i].y} `

      } else if (i > 0 && point[i].y && point[i - 1].y) {
        pointStr = pointStr + `L${point[i].x} ${point[i].y} `
      }else{
        pointStr = `M${point[i].x} 0 `
      }
    }
    return { pointStr, color }
  }

  //绘制BOLL线
  _drawBoll(currentBOLL) {
    let arr = []
    let up = this._drawBollLine(currentBOLL.up, MaColor.MA5);
    let middle = this._drawBollLine(currentBOLL.middle, MaColor.MA10);
    let down = this._drawBollLine(currentBOLL.down, MaColor.MA20);
    arr = [up, middle, down]
    return arr.map((item, index) => {
      return <Path
        key={index}
        d={item.pointStr}
        fill="transparent"
        stroke={item.color}
      />
    })
  }
  _drawBollLine(data, color) {
    const { kBarBumber } = this.state
    let pointList = []
    for (let i = 0; i < kBarBumber; i++) {
      let x = this.originX + ((this.bWidth + this.bMargin) * i);
      let MAx = parseInt(x + this.bWidth / 2);
      var MAH = parseInt(this.cHeight * (data[i] - this.minValue) / (this.maxValue - this.minValue));
      var MAy = this.originY - MAH;
      pointList.push({ x: MAx, y: MAy });
    }
    let result = this._drawBezier(pointList, color)
    return result

  }

  //设置贝塞尔缺陷控制点
  _getCtrlPoint(ps, i, a, b) {
    if (!a || !b) {
      a = 0.1;
      b = 0.1;
    }
    //处理两种极端情形
    if (i < 1) {
      var pAx = ps[0].x + (ps[1].x - ps[0].x) * a;
      var pAy = ps[0].y + (ps[1].y - ps[0].y) * a;
    } else {
      var pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a;
      var pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a;
    }
    if (i > ps.length - 3) {
      var last = ps.length - 1
      var pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * b;
      var pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * b;
    } else {
      var pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
      var pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
    }
    return {
      pA: { x: pAx, y: pAy },
      pB: { x: pBx, y: pBy }
    }
  }

  //减少K线根数
  enlargeChart() {
    if (this.state.kBarBumber <= 10) {
      return
    }
    this.setState({ kBarBumber: this.state.kBarBumber - 5 })
  }

  //增加K线根数
  shrinkChart() {
    const len = this.state.data.values.length
    if (this.state.kBarBumber + this.state.endPoint >= len - 5) {
      return
    }
    this.setState({ kBarBumber: this.state.kBarBumber + 5 })
  }

  //画十字线
  drawCrossLine(x, y) {
    let arr = []
    for (var i = 0; i < this.pointArr.length; i++) {
      if (x >= this.pointArr[i].x && x <= (this.pointArr[i].x + this.bWidth)) {
        this.Ma5Title = this.pointArr[i].Ma5Value
        this.Ma10Title = this.pointArr[i].Ma10Value
        this.Ma20Title = this.pointArr[i].Ma20Value
        this.Ma30Title = this.pointArr[i].Ma30Value
        arr.push(
          < Line
            x1={this.originX}
            y1={this.pointArr[i].y}
            x2={this.originX + this.cWidth}
            y2={this.pointArr[i].y}
            stroke="#888"
            strokeWidth={0.5}
            key={1}
          />
        )
        arr.push(
          < Line
            x1={this.pointArr[i].x + 1}
            y1={this.state.charHeight}
            x2={this.pointArr[i].x + 1}
            y2={0}
            stroke="#888"
            strokeWidth={0.5}
            key={2}
          />
        )
        arr.push(
          <Rect
            key={3}
            x={this.originX + this.cWidth}
            y={this.pointArr[i].y - 15}
            rx={5}
            ry={5}
            width={50}
            height={30}
            fill={'#eee'}
          />
        )
        arr.push(
          <Text
            key={4}
            x={this.originX + this.cWidth + 5}
            y={this.pointArr[i].y + 3}
            fill={'#333'}
            fontSize={10}
          >{this.pointArr[i].barVal}</Text>
        )

        break
      }
    }
    return arr
  }

  drawDate(x, y) {
    const theme = this.props.theme
    let arr = []
    for (var i = 0; i < this.pointArr.length; i++) {
      if (x >= this.pointArr[i].x && x <= (this.pointArr[i].x + this.bWidth)) {
        arr.push(
          < Line
            x1={this.pointArr[i].x + 1}
            y1={this.quoteOriginY}
            x2={this.pointArr[i].x + 1}
            y2={0}
            stroke="#888"
            strokeWidth={0.5}
            key={1}
          />
        )
        arr.push(
          <Text
            key={2}
            x={this.pointArr[i].x - 30}
            y={this.quoteOriginY - 3}
            fill={theme.bigText}
            fontSize={12}
          >{this.pointArr[i].date}</Text>
        )
        break
      }
    }
    return arr
  }

  //画KDJ的单条线
  drawKDJLine(data, color, max, min) {
    const { kBarBumber } = this.state
    let minKdj = min
    let maxKdj = max
    let KpointList = []
    for (let i = 0; i < kBarBumber; i++) {
      let x = this.quoteOriginX + ((this.bWidth + this.bMargin) * i) + parseFloat(this.bWidth / 2) - 0.5;
      let y = this.qHeight - (this.qHeight - 10) * (data[i] + Math.abs(minKdj)) / (maxKdj - minKdj)
      KpointList.push({ x, y })
    }

    let pointStr = ''

    for (let i = 0; i < KpointList.length; i++) {
      if (i === 0) {
        pointStr = `M${KpointList[i].x} ${KpointList[i].y} `
      } else {
        pointStr = pointStr + `L${KpointList[i].x} ${KpointList[i].y} `
      }
    }
    return { pointStr, color }
  }
  //画Kdj的3条线
  drawKdj(currentKDJ) {
    const theme = this.props.theme
    let max = 0
    let min = 0
    for (let key in currentKDJ) {
      let currentMax = Math.max(...currentKDJ[key])
      let currentMin = Math.min(...currentKDJ[key])
      if (currentMax > max) {
        max = parseFloat(currentMax).toFixed(2)
      }
      if (currentMin < min) {
        min = parseFloat(currentMin).toFixed(2)
      }
    }
    //最大致与最小值
    let maxAndMinValue = []
    maxAndMinValue.push(
      <Text
        key={'kdj' + max}
        x={0}
        y={20}
        fill={theme.text}
        fontSize={10}
      >{max}</Text>
    )
    maxAndMinValue.push(
      <Text
        key={'kdj' + min}
        x={0}
        y={this.qHeight - 3}
        fill={theme.text}
        fontSize={10}
      >{min}</Text>
    )
    let k = this.drawKDJLine(currentKDJ.k, rsiColor.rsi1, max, min)
    let d = this.drawKDJLine(currentKDJ.d, rsiColor.rsi2, max, min)
    let j = this.drawKDJLine(currentKDJ.j, rsiColor.rsi3, max, min)
    let indicate = this.drawKDJIndicate()

    let arr = [k, d, j].map((item, index) => {
      return <Path
        key={index}
        d={item.pointStr}
        fill="transparent"
        stroke={item.color}
      />
    })
    return [...arr, ...maxAndMinValue, ...indicate]
  }
  //画KDJ参数
  drawKDJIndicate() {
    const { currentKDJ, endPoint } = this.state
    let len = this.kdj.k.length
    let lastk = parseFloat(this.kdj.k[len - 1 - endPoint]).toFixed(2)
    let lastd = parseFloat(this.kdj.d[len - 1 - endPoint]).toFixed(2)
    let lastj = parseFloat(this.kdj.j[len - 1 - endPoint]).toFixed(2)
    let arr = []
    if (currentKDJ) {
      arr.push(
        <Text
          key={'K'}
          x={0}
          y={10}
          fill={rsiColor.rsi1}
          fontSize={10}
        >{`K:${parseFloat(currentKDJ.k).toFixed(2)}`}</Text>
      )
      arr.push(
        <Text
          key={'D'}
          x={60}
          y={10}
          fill={rsiColor.rsi2}
          fontSize={10}
        >{`D:${parseFloat(currentKDJ.d).toFixed(2)}`}</Text>
      )
      arr.push(
        <Text
          key={'J'}
          x={125}
          y={10}
          fill={rsiColor.rsi3}
          fontSize={10}
        >{`J:${parseFloat(currentKDJ.j).toFixed(2)}`}</Text>
      )
    } else {
      arr.push(
        <Text
          key={'K'}
          x={0}
          y={10}
          fill={rsiColor.rsi1}
          fontSize={10}
        >{`K:${lastk}`}</Text>
      )
      arr.push(
        <Text
          key={'D'}
          x={60}
          y={10}
          fill={rsiColor.rsi2}
          fontSize={10}
        >{`D:${lastd}`}</Text>
      )
      arr.push(
        <Text
          key={'J'}
          x={125}
          y={10}
          fill={rsiColor.rsi3}
          fontSize={10}
        >{`J:${lastj}`}</Text>
      )
    }
    return arr
  }

  //绘制MACD
  drawMacd(currentMACD) {
    const theme = this.props.theme
    let max = 0
    let min = 0
    for (let key in currentMACD) {
      let currentMax = Math.max(...currentMACD[key])
      let currentMin = Math.min(...currentMACD[key])
      if (currentMax > max) {
        max = currentMax
      }
      if (currentMin < min) {
        min = currentMin
      }
    }
    //最大致与最小值
    let maxAndMinValue = []
    maxAndMinValue.push(
      <Text
        key={"MACD" + max}
        x={0}
        y={20}
        fill={theme.text}
        fontSize={10}
      >{max}</Text>
    )
    maxAndMinValue.push(
      <Text
        key={"MACD" + min}
        x={0}
        y={this.qHeight - 3}
        fill={theme.text}
        fontSize={10}
      >{min}</Text>
    )


    let dif = this.drawMACDLine(currentMACD.dif, macdColor.dif, max, min)
    let dea = this.drawMACDLine(currentMACD.dea, macdColor.dea, max, min)
    let indicate = this.drawMACDIndicate()

    let arr = [dif, dea].map((item, index) => {
      return <Path
        key={index}
        d={item.pointStr}
        fill="transparent"
        stroke={item.color}
      />
    })
    let bar = this.drawMACDBar(currentMACD.bar, max, min)
    return [...arr, ...bar, ...maxAndMinValue, ...indicate]
  }
  //画MACD的单条线
  drawMACDLine(data, color, max, min) {
    const { kBarBumber } = this.state
    let pointList = []
    for (let i = 0; i < kBarBumber; i++) {
      let x = this.quoteOriginX + ((this.bWidth + this.bMargin) * i) + parseFloat(this.bWidth / 2) - 0.5;
      let y = this.qHeight - (this.qHeight - 10) * (data[i] + Math.abs(min)) / (max - min)
      pointList.push({ x, y })
    }

    let pointStr = ''

    for (let i = 0; i < pointList.length; i++) {
      if (i === 0) {
        pointStr = `M${pointList[i].x} ${pointList[i].y} `
      } else {
        pointStr = pointStr + `L${pointList[i].x} ${pointList[i].y} `
      }
    }
    return { pointStr, color }
  }
  //画MACD 的柱状图
  drawMACDBar(data, max, min) {
    const { kBarBumber } = this.state
    let pointList = []
    for (let i = 0; i < kBarBumber; i++) {
      let x = this.quoteOriginX + ((this.bWidth + this.bMargin) * i) + parseFloat(this.bWidth / 2) - 0.5;
      let y = this.qHeight - (this.qHeight - 10) * (data[i] + Math.abs(min)) / (max - min)
      pointList.push({ x, y })
    }
    let arr = []
    let color = ''
    let origin = this.qHeight - (this.qHeight - 10) * (Math.abs(min)) / (max - min)
    for (let i = 0; i < pointList.length; i++) {
      if (pointList[i].y < origin) {
        color = macdColor.barUp
      } else {
        color = macdColor.barDown
      }
      arr.push(
        <Line
          key={i + 0.001}
          x1={pointList[i].x}
          y1={pointList[i].y}
          x2={pointList[i].x}
          y2={origin}
          stroke={color}
          strokeWidth={2}
        />
      )
    }
    return arr
  }
  //画MACD参数
  drawMACDIndicate() {
    const { currentMACD, endPoint } = this.state
    let len = this.macd.dif.length
    let lastDIF = parseFloat(this.macd.dif[len - 1 - endPoint]).toFixed(2)
    let lastdea = parseFloat(this.macd.dea[len - 1 - endPoint]).toFixed(2)
    let lastM = parseFloat(this.macd.bar[len - 1 - endPoint]).toFixed(2)
    let arr = []
    if (currentMACD) {
      arr.push(
        <Text
          key={'dif'}
          x={0}
          y={10}
          fill={macdColor.dif}
          fontSize={10}
        >{`DIF:${parseFloat(currentMACD.dif).toFixed(2)}`}</Text>
      )
      arr.push(
        <Text
          key={'dea'}
          x={60}
          y={10}
          fill={macdColor.dea}
          fontSize={10}
        >{`DEA:${parseFloat(currentMACD.dea).toFixed(2)}`}</Text>
      )
      arr.push(
        <Text
          key={'M'}
          x={125}
          y={10}
          fill={macdColor.m}
          fontSize={10}
        >{`M:${parseFloat(currentMACD.m).toFixed(2)}`}</Text>
      )
    } else {
      arr.push(
        <Text
          key={'dif'}
          x={0}
          y={10}
          fill={macdColor.dif}
          fontSize={10}
        >{`DIF:${lastDIF}`}</Text>
      )
      arr.push(
        <Text
          key={'dea'}
          x={60}
          y={10}
          fill={macdColor.dea}
          fontSize={10}
        >{`DEA:${lastdea}`}</Text>
      )
      arr.push(
        <Text
          key={'M'}
          x={125}
          y={10}
          fill={macdColor.m}
          fontSize={10}
        >{`M:${lastM}`}</Text>
      )
    }
    return arr
  }

  //绘制RIS
  drawRsi(currentRSI) {
    const theme = this.props.theme
    let max = 0
    let min = 100
    for (let key in currentRSI) {
      let currentMax = Math.max(...currentRSI[key].filter(item => item != '-'))
      let currentMin = Math.min(...currentRSI[key].filter(item => item != '-'))
      if (currentMax > max) {
        max = currentMax
      }
      if (currentMin < min) {
        min = currentMin
      }
    }
    //最大致与最小值
    let maxAndMinValue = []
    maxAndMinValue.push(
      <Text
        key={'rsi' + max}
        x={0}
        y={20}
        fill={theme.text}
        fontSize={10}
      >{max}</Text>
    )
    maxAndMinValue.push(
      <Text
        key={'rsi' + min}
        x={0}
        y={this.qHeight - 3}
        fill={theme.text}
        fontSize={10}
      >{min}</Text>
    )
    let rsi1 = this.drawRSILine(currentRSI.rsi1, rsiColor.rsi1, max, min)
    let rsi2 = this.drawRSILine(currentRSI.rsi2, rsiColor.rsi2, max, min)
    let rsi3 = this.drawRSILine(currentRSI.rsi3, rsiColor.rsi3, max, min)
    let indicate = this.drawRSIIndicate()
    let arr = [rsi1, rsi2, rsi3].map((item, index) => {
      return <Path
        key={index}
        d={item.pointStr}
        fill="transparent"
        stroke={item.color}
      />
    })
    return [...arr, ...maxAndMinValue, ...indicate]

  }
  //画RIS的单条线
  drawRSILine(data, color, max, min) {
    const { kBarBumber } = this.state
    let pointList = []
    for (let i = 0; i < kBarBumber; i++) {
      let x = this.quoteOriginX + ((this.bWidth + this.bMargin) * i) + parseFloat(this.bWidth / 2) - 0.5;
      let y = this.qHeight - (this.qHeight - 10) * (data[i] - Math.abs(min)) / (max - min)
      pointList.push({ x, y })
    }

    let pointStr = ''

    for (let i = 0; i < pointList.length; i++) {
      if (i === 0) {
        pointStr = `M${pointList[i].x} ${pointList[i].y} `
      } else {
        pointStr = pointStr + `L${pointList[i].x} ${pointList[i].y} `
      }
    }
    return { pointStr, color }
  }
  //画RSI参数
  drawRSIIndicate() {
    const { currentRIS, endPoint } = this.state
    let len = this.rsi.rsi1.length
    let lastRSI1 = parseFloat(this.rsi.rsi1[len - 1 - endPoint]).toFixed(2)
    let lastRSI2 = parseFloat(this.rsi.rsi2[len - 1 - endPoint]).toFixed(2)
    let lastRSI3 = parseFloat(this.rsi.rsi3[len - 1 - endPoint]).toFixed(2)
    let arr = []
    if (currentRIS) {
      arr.push(
        <Text
          key={'rsi1'}
          x={0}
          y={10}
          fill={rsiColor.rsi1}
          fontSize={10}
        >{`RSI1:${parseFloat(currentRIS.rsi1).toFixed(2)}`}</Text>
      )
      arr.push(
        <Text
          key={'rsi2'}
          x={60}
          y={10}
          fill={rsiColor.rsi2}
          fontSize={10}
        >{`RSI2:${parseFloat(currentRIS.rsi1).toFixed(2)}`}</Text>
      )
      arr.push(
        <Text
          key={'rsi3'}
          x={125}
          y={10}
          fill={rsiColor.rsi3}
          fontSize={10}
        >{`RSI3:${parseFloat(currentRIS.rsi1).toFixed(2)}`}</Text>
      )
    } else {
      arr.push(
        <Text
          key={'dif'}
          x={0}
          y={10}
          fill={rsiColor.rsi1}
          fontSize={10}
        >{`RSI1:${lastRSI1}`}</Text>
      )
      arr.push(
        <Text
          key={'dea'}
          x={60}
          y={10}
          fill={rsiColor.rsi2}
          fontSize={10}
        >{`RSI2:${lastRSI2}`}</Text>
      )
      arr.push(
        <Text
          key={'M'}
          x={125}
          y={10}
          fill={rsiColor.rsi3}
          fontSize={10}
        >{`RSI3:${lastRSI3}`}</Text>
      )
    }
    return arr
  }

  //切换指标
  changeIndicate(index) {
    this.setState({ indicateIndex: index })
  }
  longpressLeft() {
    this.moveingLeft = setInterval(() => {
      this.moveLeft()
    }, 100)
  }
  longpressRight() {
    this.moveingRight = setInterval(() => {
      this.moveRight()
    }, 100)
  }

  moveLeft() {
    const { index, endPoint, data, kBarBumber } = this.state
    if (endPoint >= data.values.length - kBarBumber) {
      return
    }
    this.setState({ index: index + 1, endPoint: this.state.endPoint + 1 })
  }
  moveRight(callback) {
    const { index, endPoint, kBarBumber } = this.state
    if (endPoint <= 0) {
      return
    }
    let data = this.state.data
    const len = data.values.length
    this.setState({ index: index + 1, endPoint: this.state.endPoint - 1 }, () => {
      if (callback && typeof callback === 'function') {
        callback(data.values[len - endPoint][3])
      }
    })
  }

  //设置买点
  setBuyPoint(status, callback) {

    const { endPoint } = this.state
    let data = this.state.data
    const len = data.sellPoint.length
    if (status === 0) {
      data.sellPoint[len - endPoint - 1] = 1
    } else {
      data.sellPoint[len - endPoint - 1] = 2
    }
    if (callback && typeof callback === 'function') {
      callback(data.values[len - endPoint - 1][3])
    }

    this.setState({ data })
  }
  //设置策略的买卖点
  setStrategyPoint(signalList) {
    let data = this.state.data
    let timeList = data.categoryData
    data.sellPoint.forEach((item, pointIndex) => {
      data.sellPoint[pointIndex] = 0
    })
    signalList.forEach((item, itemIndex) => {
      let index = timeList.indexOf(parseInt(item.time))
      if (index > -1) {
        if (item.type === 1) {
          data.sellPoint[index] = 1
        } else if (item.type === 3) {
          data.sellPoint[index] = 2
        }
      }

    })
    this.setState({ data })
  }

  render() {
    const { status } = this.state
    if (status === 'success') {
      const { data, cMargin, chartWidth, charHeight, endPoint, kBarBumber, clickPoint, quoteWdith, quoteHeight, currentPrice,
        MA5, MA10, MA20, currentMa, currentVol, currentBollList, totalYNomber, indicateIndex
      } = this.state

      // const indicateIndex = this.props.indicateIndex
      const allBarsNum = data.values.length

      let currentData = {
        ...data,
        sellPoint: data.sellPoint.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        values: data.values.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        categoryData: data.categoryData.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        vol: data.vol.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint)
      }

      //计算当前KDJ值
      let currentKDJ = {
        k: this.kdj.k.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        d: this.kdj.d.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        j: this.kdj.j.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
      }
      this.currentKDJ = currentKDJ
      //计算当前MACD值
      let currentMACD = {
        dif: this.macd.dif.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        dea: this.macd.dea.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        bar: this.macd.bar.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
      }
      this.currentMACD = currentMACD
      //计算当前的RSI值
      let currentRSI = {
        rsi1: this.rsi.rsi1.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        rsi2: this.rsi.rsi2.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        rsi3: this.rsi.rsi3.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
      }
      this.currentRSI = currentRSI
      //计算当前的BOLL值
      let currentBOLL = {
        up: this.boll.up.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        down: this.boll.down.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
        middle: this.boll.mb.slice(allBarsNum - kBarBumber - endPoint, allBarsNum - endPoint),
      }
      this.currentBOLL = currentBOLL

      this.originX = cMargin   //坐标轴原点
      this.originY = charHeight

      //指标图原点
      this.quoteOriginX = cMargin
      this.quoteOriginY = quoteHeight


      let cWidth = chartWidth - cMargin * 2 - 40    //canvas中部的宽/高  
      let cHeight = charHeight - cMargin * 2 - 30

      this.qHeight = quoteHeight - cMargin

      let bMargin = 1;    //每个k线图间间距
      let bWidth = (parseFloat((cWidth - 5) / kBarBumber).toFixed(2)) - 1;     //K线图的宽度

      this.maxValue = maxAndMinData(currentData.values).maxValue   //所有k线图的最大值/最小值 
      this.maxValue = this.maxValue + this.maxValue * 0.01
      this.minValue = maxAndMinData(currentData.values).minValue   //最小值  
      this.minValue = this.minValue - this.minValue * 0.03
      this.cWidth = cWidth
      this.cHeight = cHeight
      this.bWidth = bWidth
      this.bMargin = bMargin

      const len = MA5.length
      let heighPrice, lowPrice, openPrice, closePrice
      let currentMA5, currentMA10, currentMA20
      let currentVolValue
      let dataLen = data.values.length
      if (!currentPrice) {
        heighPrice = data.values[dataLen - 1][1]
        lowPrice = data.values[dataLen - 1][2]
        openPrice = data.values[dataLen - 1][0]
        closePrice = data.values[dataLen - 1][3]
      } else {
        heighPrice = currentPrice[1]
        lowPrice = currentPrice[2]
        openPrice = currentPrice[0]
        closePrice = currentPrice[3]
      }
      //当前均线的价格
      if (currentMa) {
        currentMA5 = currentMa.MA5
        currentMA10 = currentMa.MA10
        currentMA20 = currentMa.MA20
      } else {
        currentMA5 = MA5[len - 1 - endPoint]
        currentMA10 = MA10[len - 1 - endPoint]
        currentMA20 = MA20[len - 1 - endPoint]
      }
      //当前成交量
      if (currentVol) {
        currentVolValue = currentVol
      } else {
        currentVolValue = data.vol[dataLen - 1 - endPoint]
      }

      let up, middle, down
      if (currentBollList) {
        up = currentBollList.up
        middle = currentBollList.middle
        down = currentBollList.down
      } else {
        let len = this.boll.up.length
        up = this.boll.up[len - 1 - endPoint]
        middle = this.boll.mb[len - 1 - endPoint]
        down = this.boll.down[len - 1 - endPoint]
      }
      const theme = this.props.theme
      const option = this.props.option
      return (
        <View style={[styles.container, { height:charHeight +quoteHeight}]}>
          <View style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: theme.lightBgLine,height:charHeight +quoteHeight}}  {...this._panResponder.panHandlers}>

            <View >
              {!this.props.isShowBoll ?
                <View style={{ flexDirection: "row", position: 'absolute', left: 10, top: 10 }}>
                  <Texts style={{ fontSize: 10.5, color: MaColor.MA5, marginRight: 5 }}>MA5:{currentMA5}</Texts>
                  <Texts style={{ fontSize: 10.5, color: MaColor.MA10, marginRight: 5 }}>MA10:{currentMA10}</Texts>
                  <Texts style={{ fontSize: 10.5, color: MaColor.MA20, marginRight: 5 }}>MA20:{currentMA20}</Texts>

                </View> :
                <View style={{ flexDirection: "row", position: 'absolute', left: 10, top: 10 }}>
                  <Texts style={{ fontSize: 10.5, color: MaColor.MA10, marginRight: 5 }}>MID:{middle}</Texts>
                  <Texts style={{ fontSize: 10.5, color: MaColor.MA5, marginRight: 5 }}>UP:{up}</Texts>
                  <Texts style={{ fontSize: 10.5, color: MaColor.MA20, marginRight: 5 }}>LOW:{down}</Texts>

                </View>
              }
            </View>
            <Svg height={charHeight} width={window.width - 10}  >
              <Path
                d={`M${this.originX} ${this.originY} h${window.width - 20} M${this.originX + cWidth} ${this.originY}  V${0}`}
                stroke={theme.lightBgLine}
                strokeWidth={1}
                fill="transparent"
              />
              {this.drawMarkers(this.maxValue, this.minValue, totalYNomber, this.originX, this.originY, cWidth, cHeight)}
              {this.drawKBar(allBarsNum, kBarBumber, endPoint, currentData, this.maxValue, this.minValue, cHeight, this.originX, this.originY, bWidth, bMargin)}
              {!this.props.isShowBoll ? this._drawMAline() : this._drawBoll(currentBOLL)}

              {clickPoint.length > 0 ? this.drawCrossLine(clickPoint[0].x, clickPoint[0].y) : null}
            </Svg>

            <Svg height={quoteHeight} width={window.width}>
              <Path
                d={`M${this.quoteOriginX} ${this.quoteOriginY} h${cWidth} V${0}`}
                stroke={theme.lightBgLine}
                strokeWidth="1"
                fill="transparent"
              />

              {indicateIndex === 0 ? this.drawVol(currentData) : null}
              {indicateIndex === 0 ? <Text x={0} y={10} fill={theme.text} fontSize={10}>成交量：</Text> : null}
              {indicateIndex === 0 ? <Text x={35} y={10} fill={theme.text} fontSize={10}>{currentVolValue}</Text> : null}

              {indicateIndex === 1 ? this.drawKdj(currentKDJ) : null}
              {indicateIndex === 2 ? this.drawMacd(currentMACD) : null}
              {indicateIndex === 3 ? this.drawRsi(currentRSI) : null}

              {clickPoint.length > 0 ? this.drawDate(clickPoint[0].x, clickPoint[0].y) : null}
            </Svg>
          </View>
          {option.showControlBtn ?
            <View style={[styles.btnWrapper, { top: option.controlBtnPosition ? option.controlBtnPosition : window.height * 0.28 }]}>
              <TouchableOpacity style={styles.btn} onPress={this.enlargeChart.bind(this)}>
                <Texts style={{ fontSize: 16, color: "#fff" }}>+</Texts>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={this.shrinkChart.bind(this)}>
                <Texts style={{ fontSize: 16, color: "#fff" }}>-</Texts>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={this.moveLeft.bind(this)}
                onPressIn={this.longpressLeft.bind(this)}
                onPressOut={() => clearInterval(this.moveingLeft)}
              >
                <Texts style={{ fontSize: 16, color: "#fff" }}>＜</Texts>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn}
                onPress={this.moveRight.bind(this)}
                onPressIn={this.longpressRight.bind(this)}
                onPressOut={() => clearInterval(this.moveingRight)}
              >
                <Texts style={{ fontSize: 16, color: "#fff" }}>＞</Texts>
              </TouchableOpacity>
            </View>
            : null
          }

        </View>
      )
    } else if (status === 'fail') {
      const theme = this.props.theme
      return (
        <View style={{ height: 343 * pixel, justifyContent: "center", alignItems: "center" }}>
          <Texts style={{ color: theme.bigText, fontSize: 12 }}>网络出错，请稍后再试！</Texts>
        </View>
      )
    } else {
      const theme = this.props.theme
      return (
        <View style={{ height: 343 * pixel, justifyContent: "center", alignItems: "center" }}>
          <Texts style={{ color: theme.bigText, fontSize: 12 }}>加载中...</Texts>
        </View>
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
 
    backgroundColor:"#fff"
  },
  btnWrapper: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row',
  },
  btn: {
    width: window.width * 0.07,
    height: window.width * 0.07,
    borderRadius: window.width * 0.035,
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  }
});