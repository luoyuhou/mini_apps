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
            url: `${app.globalData.baseApiUrl}/auth/sign-in`,
            method: "GET"
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
                    url: `${app.globalData.baseApiUrl}/auth/wx/verify-code`,
                    method: "POST",
                    data: { code },
                }).then((data) => {
                    console.log('wxlogin data', data);


                    wx.getUserInfo({
                      lang: "zh_CN",
                      success: (info) => {
                        console.log('getUserInfo', info);

                        fetch({
                            url: `${app.globalData.baseApiUrl}/auth/wx/sign-in`,
                            method: "POST",
                            data: { 
                                uuid: data.data.uuid,
                                signature: info.signature,
                                rawData: info.rawData,
                             },
                        })
                        .then((loginData) => {
                            console.log('loginData', loginData);

                            app.globalData.userInfo = loginData?.data;
                            
                            // 保存 openid 到本地存储
                            if (loginData?.data?.openid) {
                                wx.setStorageSync('openid', loginData.data.openid);
                                console.log('已保存 openid:', loginData.data.openid);
                            }
                            
                            wx.showToast({
                                icon: "success",
                                title: '登陆成功',
                            }).then(() => {
                                console.log('________');
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: '../home/index',
                                    })
                                }, 2000);
                            })
                        })
                        .catch((err) => {
                            wx.showToast({
                                icon: "error",
                                title: err || "请重试!"
                            })
                        })
                      },
                      fail: (err) => {
                          console.log('error', err)
                          wx.showToast({
                            icon: "error",
                            title: err || "请重试!"
                        })
                      }
                    });
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