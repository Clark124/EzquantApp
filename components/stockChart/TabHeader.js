import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class Market extends Component {
    constructor() {
        super()
        this.state = {
            tabType: 0
        }
    }
    selectTab(index){
        this.props.selectTab(index)
        this.setState({
            tabType:index
        })
    }
    render() {
        const { tabType } = this.state
        return (
            <View style={styles.tabHeader}>
                <TouchableOpacity style={{ flex: 1 }} onPress={this.selectTab.bind(this,0)} >
                    <View style={tabType === 0 ? [styles.tabTextWrapper, styles.tabActive] : styles.tabTextWrapper}>
                        <Text style={tabType === 0 ? [styles.tabText, styles.tabTextActive] : styles.tabText}>交易室</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this.selectTab.bind(this,1)}>
                    <View style={tabType === 1 ? [styles.tabTextWrapper, styles.tabActive] : styles.tabTextWrapper}>
                        <Text style={tabType === 1 ? [styles.tabText, styles.tabTextActive] : styles.tabText}>撤单</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this.selectTab.bind(this,2)}>
                    <View style={tabType === 2 ? [styles.tabTextWrapper, styles.tabActive] : styles.tabTextWrapper}>
                        <Text style={tabType === 2 ? [styles.tabText, styles.tabTextActive] : styles.tabText}>持仓</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this.selectTab.bind(this,3)}>
                    <View style={tabType === 3 ? [styles.tabTextWrapper, styles.tabActive] : styles.tabTextWrapper}>
                        <Text style={tabType === 3 ? [styles.tabText, styles.tabTextActive] : styles.tabText}>记录</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity style={{ flex: 1 }} onPress={this.selectTab.bind(this,4)}>
                    <View style={tabType === 4 ? [styles.tabTextWrapper, styles.tabActive] : styles.tabTextWrapper}>
                        <Text style={tabType === 4 ? [styles.tabText, styles.tabTextActive] : styles.tabText}>账户分析</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabHeader: {
        flexDirection: 'row',
        flex: 1,
        height: 31,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "#cccccc",
    },
    line: {
        height: 12,
        width: 1,
        backgroundColor: '#999999',
    },
    tabTextWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(0,0,0,0)',

    },
    tabActive: {
        borderBottomColor: '#8080ff',
    },
    tabText: {
        // flex:1,
        justifyContent: 'center',
        alignItems: "center",
        fontSize: 14,
        color: "#999999",
    },
    tabTextActive: {
        color: '#8080ff',
    },

})