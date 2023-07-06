import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Alert, Button, TouchableOpacity } from "react-native";
import { sendCode, getLogin } from '../../service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Toast } from '@ant-design/react-native';

export default function Login({ navigation, route }) {

    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [registerCode, setregisterCode] = useState("获取验证码")
    const [isDataArrive, setIsDataArrive] = useState(true)

    const validateUsername = () => {
        if (!/^[1][3-9][0-9]{9}$/.test(phone)) {
            Alert.alert(
                "提示",
                "必须为一个手机号码",
                [
                    { text: "确定", onPress: () => console.log("OK Pressed") }
                ]
            );

            return
        }
        return true
    }

    const onSendCode = () => {
        if (!validateUsername()) {
            return
        }
        if (registerCode !== '获取验证码') {
            return
        }

        if (!isDataArrive) {
            return
        }
        setIsDataArrive(false)


        sendCode({ phone: phone }).then(res => {
            setIsDataArrive(true)
            if (res.retCode === 0) {
                let time = 60
                let interval = setInterval(() => {
                    time--
                    setregisterCode(`剩余${time}s`)
                    if (!time) {
                        setregisterCode(`获取验证码`)
                        clearInterval(interval)
                    }
                }, 1000)
            } else {

            }
        }).catch(err => {
            console.log(err)
            setIsDataArrive(true)
        })
    }

    const onLogin = () => {

        const isValidate = validate()
        if (isValidate) {
            getLogin({
                phone: phone,
                captcha: code,
                isLogin: 1,
            }).then(res => {
                if (res.retCode === 0) {
                    const result = res.data
                    AsyncStorage.setItem("userInfo", JSON.stringify(result))
                    Toast.success({
                        content: '登录成功',
                        duration: 2,
                        stackable: true,
                    })
                 
                    
                    route.params.receiveUserinfo(result)
                    navigation.goBack()

                }
            })
        }
    }

    const validate = () => {
        if (!/^[1][3-9][0-9]{9}$/.test(phone)) {
            Alert.alert(
                "提示",
                "必须为一个手机号码",
                [
                    { text: "确定", onPress: () => console.log("OK Pressed") }
                ]
            );
            return
        }

        if (code.trim() === "") {
            Alert.alert(
                "提示",
                "请输入验证码",
                [
                    { text: "确定", onPress: () => console.log("OK Pressed") }
                ]
            );
            return
        }

        return true
    }

    return (
        <View style={styles.container}>
            {/* <View style={styles.titleWrap}>
                <Text style={styles.title}>手机登录</Text>
            </View> */}
            <View style={styles.loginItem}>
                <Text style={styles.loginText}>手机号码</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => setPhone(text)}
                    value={phone}
                    placeholder="请输入手机号码"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.loginItem}>
                <Text style={styles.loginText}>验证码</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => setCode(text)}
                    value={code}
                    placeholder="请输入验证码"
                    keyboardType="numeric"
                />
                <TouchableWithoutFeedback onPress={() => onSendCode()}>
                    <Text style={registerCode !== '获取验证码' ? styles.getCodeBtnGray : styles.getCodeBtn}>{registerCode}</Text>
                </TouchableWithoutFeedback>
            </View>

            <TouchableOpacity onPress={onLogin}>
                <Text style={styles.loginBtn}>登录</Text>
            </TouchableOpacity>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#fff"
    },
    titleWrap: {
        marginTop: 10,
        paddingBottom: 15,
        borderBottomColor: "#eee",
        borderBottomWidth: 1
    },
    title: {
        fontSize: 18,
        textAlign: "center",
    },
    loginItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1
    },
    loginText: {
        marginRight: 10,
        fontSize: 16,
        width: 75,
    },
    textInput: {
        width: 160,
        height: 30,
        fontSize: 16,
        marginRight: 10,
        paddingLeft: 15
    },
    getCodeBtn: {
        backgroundColor: '#2a89ff',
        paddingHorizontal: 5,
        paddingVertical: 5,
        color: "#fff"
    },
    getCodeBtnGray: {
        backgroundColor: 'gray',
        paddingHorizontal: 5,
        paddingVertical: 5,
        color: "#fff"
    },
    loginBtn: {
        textAlign: "center",
        paddingVertical: 10,
        backgroundColor: "#2a89ff",
        color: "#fff",
        fontSize: 18,
        marginTop: 30
    }


});