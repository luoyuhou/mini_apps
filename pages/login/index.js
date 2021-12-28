// pages/login/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({
    
    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        fetch({
            url: `${app.globalData.baseApiUrl}/user/login`,
            method: "HEAD"
        }).then((user) => {
            console.log("user", user);
            app.globalData.userInfo = user;
            wx.switchTab({
                url: '../home/index',
            })
            return;
        })
        .catch(() => {})
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

     // 登录
    onLogin: function() {  
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                var code = res.code;
                console.log('code', code);
                res.code && fetch({
                    url: `${app.globalData.baseApiUrl}/user/wxlogin?code=${code}`,
                }).then((data) => {
                    console.log('wxlogin data', data);
                        app.globalData.userInfo = data.data;
                        wx.switchTab({
                            url: '../home/index',
                        })
                        return;
                }).catch((err) => {
                    wx.showToast({
                        icon: "error",
                        title: err || "请重试!"
                    })
                })
            }
        })
    }
})