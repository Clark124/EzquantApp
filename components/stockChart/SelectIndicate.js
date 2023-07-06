import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'


const window = Dimensions.get('window');

export default class SelectIndicate extends Component {
    constructor() {
        super()
        this.state = {
            indicateList: [
                'VOL',
                'KDJ',
                'MACD',
                'RSI',
            ],
        }
    }
    //选择指标
    selectIndcate(index) {
        this.props.changeIndicate(index)
    }
    showBoll() {
        this.props.showBoll()
    }
    render() {
        const { indicateList, } = this.state
        const { indicateIndex, theme } = this.props
        return (
            <View style={[styles.setListWrapper, { backgroundColor: theme.moduleBg }]}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 10 }}>
                    {indicateList.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={this.selectIndcate.bind(this, index)}
                                style={indicateIndex === index ? [styles.indicate, { backgroundColor: theme.mainOrange }] : styles.indicate}
                            >
                                <Text style={indicateIndex === index ? [styles.indicateText, styles.indicateTextActive] : [styles.indicateText, { color: theme.text }]}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    <TouchableOpacity
                        style={this.props.isShowBoll ? [styles.indicate, styles.indicateActive, { backgroundColor: theme.mainOrange }] : styles.indicate}
                        onPress={this.showBoll.bind(this)}>
                        <Text style={this.props.isShowBoll ? [styles.indicateText, styles.indicateTextActive] : [styles.indicateText, { color: theme.text }]}>BOLL</Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity style={styles.setBtn}>
                    <Text style={{ fontSize: 12, color: "#333" }}>设置</Text>
                </TouchableOpacity> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    setListWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        height: window.height * 0.05,
        // borderTopWidth: 1,
        // borderColor: '#ccc',
    },
    setBtn: {
        justifyContent: "center",
        alignItems: "center",
        width: 55,
        backgroundColor: "#eeeeee"
    },
    indicate: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        // backgroundColor: "#fff",
        marginRight: 10,
        borderRadius: 13
    },
    indicateActive: {
        // backgroundColor: "#fb0",
        borderRadius: 13
    },
    indicateText: {
        fontSize: 10, color: "#333"
    },
    indicateTextActive: {
        color: '#fff'
    }
})