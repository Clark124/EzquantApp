import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { pixel } from '../../utils/index';
import {getClassicListAll} from '../../service/index'
import { useEffect, useState } from 'react';


export default function UserServer({navigation}){
    const [dataList,setDataList]=useState([])

    useEffect(()=>{
        getClassicListAll({
            pageSize:100,
            pageNum:1,
            typeId:1
        }).then(res=>{
            setDataList(res.data.list)
        })
    },[])

    const navDetail = (content)=>{
        navigation.navigate("classicDetail",{content:content})
    }

    return (
        <View style={styles.container}>
            {dataList.map((item,index)=>{
                return (
                    <TouchableWithoutFeedback onPress={()=>navDetail(item.content)} key={index}>
                        <View  style={styles.dataItem} key={index}>
                            <Text>{index+1}、</Text>
                            <Text>{item.title}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:15
       
    },
    img:{
        height: "100%" ,
        width: 375 * pixel,
    },
    dataItem:{
        padding:15,
        backgroundColor:"#fff",
        marginBottom:10,
        borderRadius:10,
        flexDirection:"row"
    }

});