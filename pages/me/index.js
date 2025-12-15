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
    // 优先从 globalData 读取
    let userInfo = app.globalData.userInfo;
    
    // 如果 globalData 没有，从本地存储读取
    if (!userInfo) {
      userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        app.globalData.userInfo = userInfo;
      }
    }
    
    this.setData({
      profile: userInfo || {}
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
  },

  // 跳转到收藏页面
  onNavToFavorites: function() {
    wx.showToast({
      title: '收藏功能开发中',
      icon: 'none'
    });
  },

  // 跳转到浏览记录页面
  onNavToHistory: function() {
    wx.showToast({
      title: '浏览记录功能开发中',
      icon: 'none'
    });
  },

  // 选择头像
  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail;
    console.log('选择头像:', avatarUrl);
    
    // 更新本地数据
    const userInfo = {
      ...this.data.profile,
      avatarUrl: avatarUrl
    };
    
    this.setData({
      profile: userInfo
    });
    
    // 保存到本地存储
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.userInfo = userInfo;
    
    wx.showToast({
      title: '头像更新成功',
      icon: 'success'
    });
  },

  // 昵称输入完成
  onNicknameBlur: function(e) {
    const nickName = e.detail.value;
    console.log('输入昵称:', nickName);
    
    if (!nickName) {
      return;
    }
    
    // 更新本地数据
    const userInfo = {
      ...this.data.profile,
      nickName: nickName
    };
    
    this.setData({
      profile: userInfo
    });
    
    // 保存到本地存储
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.userInfo = userInfo;
    
    wx.showToast({
      title: '昵称更新成功',
      icon: 'success'
    });
  }
})