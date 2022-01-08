// pages/chat/index.js
const app = getApp();
const fetch = require("../../utils/util").fetch;
const store = require("../../utils/store")
const watch = require("../../utils/watch");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        message: "",
        baseUrl: "",
        profile: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        watch.setWatcher(this);
        const _list = store.getStorageSync('app_chat', true);
        this.setData({
            baseUrl: app.globalData.baseApiUrl,
            profile: app.globalData.userInfo,
            list: _list || [],
        });
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

    inputMsg: function(msg) {
        this.setData({
            message: msg.detail.value
        })
    },


    chat: function () {
        const self = this;
        const msg = this.data.message;
        if (!msg) {
            wx.showToast({
                icon: "none",
                title: '内容不能为空',
            })
            return;
        }
        this.setData({
            list: self.data.list.concat({ username: this.data.profile.username, date: Math.round(Date.now() / 1000), message: msg, isMe: true }),
        });
        fetch({ url: `${this.data.baseUrl}/robot/chat`, method: "POST", data: { message: msg } })
        .then((res) => {
            self.setData({
                list: self.data.list.concat({ username: "小微", message: res.msg[0].content, date: Math.round(res.create_time / 1000), isMe: false }),
                message: "",
            });
        })
        .catch((err) => {
            wx.showToast({
                icon: "none",
                title: err,
            })
        })
    },

    watch: {
        list: (newVal, oldVal) => {
            if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
                return;
            }
            store.saveStorageSync('app_chat', newVal, true);
        }
    },

    removeChatList: () => {
        wx.showModal({
            title: '警告',
            content: '删除聊天记录，不可恢复',
            success (res) {
              if (res.confirm) {
                store.removeStorageSync('app_chat');
                wx.redirectTo({
                  url: 'index',
                })
              }
            }
        })
    }
})