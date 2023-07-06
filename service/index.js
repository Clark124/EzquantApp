import { get, post, mainUrl } from '../utils/index'


//经典战法列表
export function classicList(data) {
    return post(`${mainUrl}/strategyinfo/strategyBuildController/listStrategyClasstic`, data)
}

export function classicStrategyDetail(data){
  return get(`${mainUrl}/strategyinfo/strategyBuildController/strategyClassticDetail`, data)
}


//新版获取K线行情数据
export function getNewKline(data){
  return get(mainUrl + '/quote/kline/all_latest_time', data)
}

//查询股票代码的行情
export function getQuote(data) {
  return get(mainUrl + '/quote/all_real', data)
}

//交易室 经典策略
export function classicStrategyList(data){
  return get(`${mainUrl}/subselectime/system/list_stock_pagingsort`, data);
}

//最优策略回测
export function backtestOptimalSignal(data){
  return get(`${mainUrl}/subselectime/system/list_signal`,data)
}

export function searchCode(data) {
  return get(`${mainUrl}/quote/base_info_query/list_find_prod_code`, data);
}

//发送验证码
export function sendCode(data) {
  return get(`${mainUrl}/userinfo/userController/sendCode`, data);
}

//登录
export function getLogin(data){
  return get(`${mainUrl}/userinfo/userController/validateCaptcha`, data);
}

//经典战法大全
export function getClassicListAll(data){
  return get(`${mainUrl}/userinfo/userController/userQuestionList`, data);
}

//买卖信号 订阅
export function subscribeSignalClassic(data) {
  return post(`${mainUrl}/subselectime/system/add_subscribe`, data)
}

//买卖信号 取消订阅
export function cancelSubSignalClassic(data) {
  return post(`${mainUrl}/subselectime/system/delete_subscribe`, data)
}

// 6.(查询用户的订制信息)
export function subscribeSignalClassicList(data){
  return get(`${mainUrl}/subselectime/system/list_user_subscribe`, data)
}

//交易信号
export function tradeRecord(data) {
  return get(`${mainUrl}/subselectime/system/list_usersubscribe_signal`, data);
}

export function statisticsHomeCount(data){
  return get(`${mainUrl}/subselectime/system/list_position_strategysort_count`,data)
}

export function statisticsHome(data){
  return get(`${mainUrl}/subselectime/system/list_position_strategysort`,data)
}


//最优策略 - 更多
export function optimalStrategyListMore(data) {
  return get(`${mainUrl}/subselectime/system/list_paging_sort`, data);
}


export function startegyDetail(data){
  return get(`${mainUrl}/subselectime/system/get_report_detail`,data);
}