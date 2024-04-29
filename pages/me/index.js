// pages/me/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
const wxCharts = require('../../utils/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 2,
    pages: [
      { name: "待收货", index: 0 },
      { name: "全部订单", index: 1 },
      { name: "收获地址", index: 2 },
      { name: "用户等级", index: 3 },
      { name: "客户中心", index: 4 },
    ],
    accountColumn: ['现金余额', '赠送余额', '总余额'],
    accountTable: [['100', '20', '120']],
    accountNavigation: [
      { name: '消费记录', url: '' },
      { name: '退款', url: '' }
    ],
    address: [
      { address: "二轻大厦", recipient: "Tony", phone: "12345678901", is_default: true },
      { address: "轻工大厦", recipient: "Tony", phone: "12345678901", is_default: false },
      { address: "蜂巢公寓", recipient: "Tony", phone: "12345678901", is_default: false },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMothElectro();
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

  onSlidePage: function(e) {
    this.setData({
      pageIndex: e.currentTarget.id
    })
  },

  getMothElectro:function(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    new wxCharts({ //当月用电折线图配置
      canvasId: 'myHistory',
      type: 'line',
      categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15'], //categories X轴
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '赛季段位',
        //data: yuesimulationData.data,
        data: [1, 6, 9, 1, 0, 2, 9, 2, 8, 6, 0, 9, 8, 0, 3],
        format: function (val, name) {
          console.log('val', val, 'name', name);
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '',
        format: function (val) {
          return val;
        },
        max: 20,
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  }
})