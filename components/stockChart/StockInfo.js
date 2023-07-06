import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'



export default class StockInfo extends Component {
    render() {
        return (
            <View style={styles.wrapper}>
                <Image
                    source={require('../assets/add_icon.png')}
                    style={{ width: 21, height: 21 }}
                />
                <View style={{ justifyContent: "center" ,marginTop:15}}>
                    <Text style={{ fontSize: 20, color: "#333" }}>上证指数</Text>
                    <Text style={{ fontSize: 24, color: "#bcbcbc" ,marginTop:5}}>000001</Text>
                </View>
                <View style={{marginTop:5}}>
                    <Text style={{ fontSize: 24, color: "#fa6d41" }}>18.32</Text>
                    <View style={{ flexDirection: 'row' ,marginTop:8}}>
                        <Text style={{ fontSize: 15, color: "#fa6d41" ,}}>1.66</Text>
                        <Text style={{ fontSize: 15, color: "#fa6d41" }}>10.02%</Text>
                    </View>
                </View>
                <View style={{marginTop:10}}>
                    <View style={{ flexDirection: 'row' ,alignItems:'center'}}>
                        <Text style={{ fontSize: 12, color: "#333", marginRight: 7, }}>最高</Text>
                        <Text style={{ fontSize: 18, color: "#fa6d41" }}>18.32</Text>
                    </View>
                    <View style={{ flexDirection: 'row' ,alignItems:'center',marginTop:8}}>
                        <Text style={{ fontSize: 12, color: "#333", marginRight: 7 }}>最低</Text>
                        <Text style={{ fontSize: 18, color: "#009966" }}>16.04</Text>
                    </View>
                </View>
                <Image
                    source={require('../assets/arrow_down.png')}
                    style={{ width: 15, height: 8 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 17
    }
})