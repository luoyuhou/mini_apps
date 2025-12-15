// pages/me/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: {},
    orderStats: {
      unpaid: 0,
      unshipped: 0,
      shipped: 0,
      completed: 0
    }
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
    this.setData({
      profile: app.globalData.userInfo || {}
    });
    this.loadOrderStats();
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

  loadOrderStats: function() {
    // 模拟加载订单统计数据
    this.setData({
      orderStats: {
        unpaid: 2,
        unshipped: 1,
        shipped: 3,
        completed: 15
      }
    });
  },

  onVipClick: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  onNavToOrders: function(e) {
    const status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../order-list/order-list?status=' + status,
    })
  },

  onNavToRefund: function() {
    wx.navigateTo({
      url: '../refund/index',
    })
  },

  onRecharge: function() {
    wx.navigateTo({
      url: '../recharge/index',
    })
  }
})