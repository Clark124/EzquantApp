import {
    Dimensions,AsyncStorage
} from 'react-native'
const window = Dimensions.get('window');
import axios from 'axios';
export const pixel = window.width / 375

export const mainUrl = "https://pp.ezquant.cn"

axios.interceptors.response.use(res => {
    if (res.data.retCode === -2 || res.data.retCode === -1 || res.code === -1 || res.data.code === 205) {
        // alert('请重新登录')
        // AsyncStorage.removeItem('userInfo');
        // Toast.show({
        //     icon: 'fail',
        //     content: "请重新登录",
        //     afterClose: () => {
        //         window.location = '/#/user'
        //     }

        // })
        return;
    } else {
        return res;
    }
}, err => {
    console.log(err)
   
});

function stringifyURL(params, postFlag) {
    var paramUrl = '';
    for (var key in params) {
        if (!postFlag && paramUrl === '') {
            paramUrl += '?' + key + '=' + encodeURIComponent(params[key]);
        } else {
            paramUrl += '&' + key + '=' + encodeURIComponent(params[key]);
        }
    }
    return paramUrl;
}




export function get(url, data) {
    return new Promise((resolve, reject) => {
        
        axios.get(url, { params: data,  })
            .then(res => {
                if (res !== undefined) {
                    resolve(res.data);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function post(url, data, isJson = false, head) {
    return new Promise((resolve, reject) => {
        data = isJson ? data : stringifyURL(data, true);
       
        if (!head) {
            head = {}
        }
        let header = isJson
            ? { 'Content-type': 'application/json', ...head }
            : { 'Content-Type': 'application/x-www-form-urlencoded', ...head };
        axios.post(url, data, {
            headers: header,
        }).then(res => {
            if (res.data) {
                resolve(res.data);
            }
        }).catch(err => {
            console.log(err)
            reject(err);
        });
    });
}

export function debounce(func, wait, immediate) {
    let timeout

    return function () {
        let context = this
        let args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait)
        }
    }
}

export const periodObj = {
    1: "1分钟",
    2: "5分钟",
    3: "15分钟",
    4: "30分钟",
    5: "1小时",
    6: '1日',
}