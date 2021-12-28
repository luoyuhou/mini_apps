// pages/profile/index.js
const app = getApp();
const fetch = require('../../utils/util.js').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        columns: [
            {type: 'txet', name: 'username', label: '账户', required: true },
            {type: 'txet', name: 'nickname', label: '昵称'},
            {type: 'password', name: 'password', label: '密码'},
            {type: 'password', name: 'confirm', label: '确认密码'},
            {type: 'email', name: 'email', label: '邮箱'},
            {type: 'text', name: 'mobile', label: '手机号', required: true },
            {type: 'text', name: 'bio', label: '座右铭'}
        ],
        genderColumns: [
            { name: "男", value: 1, checked: true },
            { name: '女', value: 0}
        ],
        profile: {},
        baseUrl: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        this.setData({
            profile: app.globalData.userInfo,
            baseUrl: app.globalData.baseApiUrl,
        })
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

    onChangeProflieAvatar: function () {
        wx.chooseImage({
          count: 1,
          success: (res) => {
              this.setData({
                  profile: {
                    ...this.data.profile,
                    avatar: res.tempFilePaths[0]
                  }
              })
          }
        })
    },

    onInputChange: function (res) {
        this.setData({
            profile: {
                ...this.data.profile,
                [res.target.id]: res.detail.value,
            }
        })
    },

    radioChange: function (res) {
        this.setData({
            profile: {
                ...this.data.profile,
                gender: Number(res.detail.value)
            }
        })
    },

    onsubmit: function () {
        var profile = this.data.profile;
        var isRequired = false;
        this.data.columns.forEach((v) => {
            if (v.required && !profile[v.name]) {
                isRequired = true;
            }
        })
        if (isRequired) {
            wx.showToast({
                icon:'error',
                title: '有必填项未填写',
            });
            return;
        }
        if ((profile.password || profile.confirm) && profile.password !== profile.confirm) {
            wx.showToast({
                icon: "none",
                title: '两次密码不一致',
            })
            return;
        }
        fetch({
          url: `${app.globalData.baseApiUrl}/user/profile`,
          method: 'PUT',
          data: this.data.profile
        }).then((data) => {
            console.log('bind profile', data); 
            wx.showToast({
                title: "更新成功",
            })
            app.globalData.userInfo = data;
        }).catch((err) => {
            wx.showToast({
              title: err,
            })
        });
    }
})