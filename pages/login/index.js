// pages/login/index.js
const app = getApp();

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
                if(res.code){
                    wx.request({
                        url: `${app.globalData.baseApiUrl}/user/wxlogin?code=${code}`,
                        success: function (res) {
                            console.log('res===', res.data);
                            let data = res.data;
                            if (data instanceof String) {
                                wx.showToast({
                                title: '登陆失败',
                                icon: 'error',
                                duration: 2000,
                                })
                                return;
                            }
                            if (!data.code) {
                                wx.showToast({
                                    title: data.msg,
                                    icon: 'error',
                                    duration: 1000,
                                })
                                return;
                            }
                            if (data.code === 1) {
                                wx.redirectTo({
                                url: '../home/index',
                                })
                                return;
                            }
                            if (data.code === 301) {
                                wx.navigateTo({
                                    url: '../profile/index',
                                });
                                return;
                            }
                            wx.showToast({
                            title: 'error',
                            msg: '请重试!'
                            })
                        }
                    })
                }
            }
        })
    }
})