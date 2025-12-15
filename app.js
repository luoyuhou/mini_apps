//app.js
const config = require('./config.js');

App({
  onLaunch: function () {
    var self = this;
    
    // 先从本地存储读取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      console.log('从本地存储读取用户信息:', userInfo);
    }
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('获取用户信息成功:', res.userInfo);
              
              // 保存到 globalData
              this.globalData.userInfo = res.userInfo;
              
              // 持久化存储到本地
              wx.setStorageSync('userInfo', res.userInfo);
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: err => {
              console.error('获取用户信息失败:', err);
            }
          })
        } else {
          console.log('用户未授权 scope.userInfo');
        }
      }
    })
  },
  globalData: {
    baseApiUrl: config.baseApiUrl,
    userInfo: null
  }
})