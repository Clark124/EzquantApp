import { Button, View, Text ,Image,StyleSheet,TextInput,TouchableOpacity,ScrollView,TouchableWithoutFeedback} from 'react-native';
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {debounce} from '../../utils/index'
import {searchCode} from '../../service/index'

export default function SearchSymbol({navigation,route}) {
 
    const [codeList, setCodeList] = useState([])
    const [historyList, sethistoryList] = useState([])
    const [text, onChangeText] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('searchHistroy').then(res=>{
            if (res) {
                let history = JSON.parse(res)
                sethistoryList(history)
            }
        })
        
    }, [])

    const handleSearchStock = value => {
      
        searchCode({ prodCode: value, findType: 1 }).then(res => {
            if (res.code === 200) {
                let list = res.data.map(item => {
                    return {
                        label: `${item.prodCode} ${item.prodName}`,
                        code: item.prodCode,
                        name: item.prodName
                    }
                })
                setCodeList(list)
            } else {
                setCodeList([])
            }
        })

    }

    const debounceBtn = debounce(handleSearchStock, 1000)

    const handleSelectStock = (item) => {
        let history = []
         AsyncStorage.getItem('searchHistroy').then(res=>{
            if (res&&res!=="[]") {
                history = JSON.parse(res)
                let inHistroy = false
                history.forEach((historyItem, index) => {
                    if (historyItem.code === item.code) {
                        inHistroy = true
                    }
                })
                if (!inHistroy) {
                    history.push(item)
                }
            } else {
                history = [item]
            }
            AsyncStorage.setItem("searchHistroy", JSON.stringify(history),)
        })
       
      
        AsyncStorage.setItem("currentSymbol",item.code).then(res=>{
            if(route.params.from&&route.params.from==='home'){
                navigation.navigate("traderoomNew")
            }else{
                route.params.changeCode(item.code)
                navigation.goBack()
            }
        })
      
        
    
    }

  
    const clearHistory = () => {
        sethistoryList([])
        AsyncStorage.removeItem('searchHistroy')
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchInputWrap}>
                <TextInput
                    style={styles.searchInput}
                    onChangeText={text => {
                        debounceBtn(text)
                    }}
                   
                />
            </View>
            <View style={styles.symbolList}>
                {codeList.map((item, index) => {
                    return (
                        <View style={styles.symbolItem} key={item.code}>
                            <TouchableOpacity onPress={() => { handleSelectStock(item) }}>
                                <View style={styles.symbolTest}>
                                    <Text >{item.name}</Text><Text >{item.code}</Text>
                                </View>
                            
                            </TouchableOpacity>
        
                        </View>
                    )
                })}
                {codeList.length === 0 && historyList.length === 0?
                    <Text style={styles.tips}>请搜索</Text> : null
                }

                {codeList.length === 0 && historyList.length > 0 ?
                    <View className='history-search'>
                        <Text style={styles.tips}>
                            以下为历史搜索记录:
                        </Text>
                        <View style={styles.symbolList}>
                            {historyList.map((item, index) => {
                              
                                return (
                                    <View style={styles.symbolItem} key={item.code}>
                                        <TouchableWithoutFeedback onPress={() => { handleSelectStock(item) }}>
                                            <View style={styles.symbolTest}>
                                                 <Text >{item.name}</Text><Text >{item.code}</Text>
                                            </View>
                                          
                                        </TouchableWithoutFeedback>
                                     
                                    </View>
                                )
                            })}
                        </View>
                        <Text style={styles.clearBtn} onClick={clearHistory}>清除历史</Text>
                    </View> :

                    null
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:15
      
    },
    searchInputWrap:{
        marginBottom:20
    },
    searchInput:{
        borderColor:"transparent",
        borderRadius: 20,
        backgroundColor:"#fff",
        height:40,
        paddingLeft:15
    },
    symbolList:{
        padding:15,
        backgroundColor:"#fff"
    },
    symbolItem:{
        marginBottom:10,
        paddingBottom:10,
        borderBottomColor:"#eee",
        borderBottomWidth:1
    },
    symbolTest:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    tips:{
        textAlign:"center"
    },
    clearBtn:{
        textAlign:"center",
        paddingTop:20,
        color:"#083AEF"
    }

});




