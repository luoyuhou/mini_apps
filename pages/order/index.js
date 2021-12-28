// pages/order/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listIndex: -1,
        list: [
            { amount: 3000, discount: 0, price: 30000, money: 3000 },
            { amount: 5000, discount: 988, price: 5000, money: 5000 * 988 / 1000 },
            { amount: 10000, discount: 980, price: 10000, money: 10000 * 980 / 1000 },
            { amount: 20000, discount: 900, price: 20000, money: 20000 * 900 / 1000 },
            { amount: 30000, discount: 800, price: 30000, money: 30000 * 800 / 1000 }
        ]
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


    onChooseItem: function(e) {
        this.setData({
            listIndex:  e.currentTarget.id
        })
    },

    onOrder: function() {
        let data = this.data.list[this.data.listIndex];
        if (!data) {
            wx.showToast({
                icon: 'none',
                title: "请选择支付金额"
            })
        }
        wx.showModal({
          title: '提示',
          content: '确认下单',
          success: (sm) => {
              if (sm.confirm) {
                  fetch({
                      url: `${app.globalData.baseApiUrl}/order/index`,
                      method: "post",
                      data: data,
                  }).then((res) => {
                      console.log('res', res);
                  }).catch((err) => {
                      console.log('err', err);
                  })
              }
          }
        })
    }
})