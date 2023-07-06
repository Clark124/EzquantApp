
import { useEffect, useState, } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { pixel } from '../../utils/index';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { StackActions } from '@react-navigation/native';
// import RNExitApp from 'react-native-exit-app';
import {getClassicListAll} from '../../service'

let modalIndex = 0

export default function Index({ navigation }) {
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    useEffect(() => {
        getClassicListAll({
            pageSize:100,
            pageNum:1,
            typeId:1
        }).then(res=>{
            // console.log(res.data.list)
            // setDataList(res.data.list)
        })
        AsyncStorage.getItem("hasAgree").then(res => {
            if (res) {
                navigation.navigate("main")
                setModalVisible1(false)
            } else{
                modalIndex = 1
                setModalVisible1(true)
            }
            
        }).catch(err=>{
            modalIndex = 1
            setModalVisible1(true)
        })
        navigation.addListener('focus', () => {
            if (modalIndex === 1) {
                setModalVisible1(true)
            } else if(modalIndex===2){
                setModalVisible2(true)
            }

        });

       
    
    }, [navigation])

    const onAgree = () => {
        AsyncStorage.setItem("hasAgree",'true')
        navigation.navigate('main')
       
    }
    return (

        <View style={styles.centeredView}>
            <Modal
                // animationType="fade"
                transparent={true}
                visible={modalVisible1}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>个人信息保护提示</Text>
                        <ScrollView>
                            <Text style={styles.modalText}>欢迎使用经典战法！</Text>
                            <Text style={styles.modalText}>
                                我们将通过<TouchableWithoutFeedback onPress={() => {
                                    setModalVisible1(false)
                                    modalIndex = 1
                                    navigation.navigate('用户协议')
                                }}><Text style={styles.navLink}>《用户协议》</Text ></TouchableWithoutFeedback>
                                和<TouchableWithoutFeedback onPress={() => {
                                    setModalVisible1(false)
                                    modalIndex = 1
                                    navigation.navigate('隐私政策')
                                }}><Text style={styles.navLink}>《隐私政策》</Text></TouchableWithoutFeedback>,帮助您了解我们为您 提供的服务、
                                我们如何处理个人信息以及您向右的权利。我们会严格按照相关法律法规要求，采取各种安全措施来保护您的个人信息。
                            </Text>
                            <Text style={styles.modalText}>
                                点击“同意”按钮，表示您已知情并同意以上协议和以下约定。
                            </Text>
                            <Text style={styles.modalText}>
                                1.为了保障软件的安全运行和账户安全，我们会申请读取收集您的设备信息、AndroidID、IP地址、MAC地址、IMEI、OAID、IMSI、应用列表等信息
                            </Text>
                            <Text style={styles.modalText}>
                                2.上传或拍摄图片、视频，需要使用您的存储、相机、麦克风权限。
                            </Text>
                            <Text style={styles.modalText}>
                                3.我们可能会申请位置权限，用于为您推荐您可能感兴趣的内容。
                            </Text>
                        </ScrollView>

                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3", marginTop: 20 }}
                            onPress={() => {
                                setModalVisible1(!modalVisible1);
                                onAgree()
                            }}
                        >
                            <Text style={styles.textStyle}>同意</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#fff", }}
                            onPress={() => {
                                setModalVisible1(!modalVisible1);
                                setModalVisible2(!modalVisible2);
                            }}
                        >
                            <Text style={{ ...styles.textStyle, color: "#000", marginTop: 10 }}>不同意</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            <Modal
                // animationType="fade"
                transparent={true}
                visible={modalVisible2}
            >
                <View style={styles.centeredView}>
                    <View style={{ ...styles.modalView, height: 300 }}>
                        <Text style={styles.modalTitle}>温馨提示</Text>
                        <Text style={styles.modalText}>
                            如果您不同意<TouchableWithoutFeedback onPress={() => {
                                setModalVisible2(false)
                                modalIndex = 2
                                navigation.navigate('用户协议')
                            }}><Text style={styles.navLink}>《用户协议》</Text ></TouchableWithoutFeedback>
                            和<TouchableWithoutFeedback onPress={() => {
                                setModalVisible2(false)
                                modalIndex = 2
                                navigation.navigate('隐私政策')
                            }}><Text style={styles.navLink}>《隐私政策》</Text></TouchableWithoutFeedback>，很遗憾我们将
                            无法为您提供服务。您需要同意以上协议后，才能使用经典战法。
                        </Text>
                        <Text style={styles.modalText}>
                            我们将严格按照相关法律法规要求，坚决保障您的个人隐私和信息安全。
                        </Text>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3", marginTop: 20 }}
                            onPress={() => {
                                setModalVisible2(!modalVisible2);
                                onAgree()
                            }}
                        >
                            <Text style={styles.textStyle}>同意并继续</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#fff", }}
                            onPress={() => {
                                // RNExitApp.exitApp();
                                Alert.alert(
                                    "提示",
                                    "好吧，请退出吧！",
                                    [
                                      
                                      { text: "OK", onPress: () => console.log("OK Pressed") }
                                    ]
                                  );
                            }}
                        >
                            <Text style={{ ...styles.textStyle, color: "#000", marginTop: 10 }}>放弃使用</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>


        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        height: 450 * pixel,
        width: 300 * pixel,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15
    },
    modalText: {
        marginBottom: 3,
        fontSize: 16,
        lineHeight: 20
    },
    navLink: {
        color: "blue"
    }

});
