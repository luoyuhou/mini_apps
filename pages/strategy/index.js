// pages/strategy/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
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
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadData: function () {
    const data = [
      {category: '大家都在看', child: [
        {id: 1, title: "三周年庆典", description: "三年里,数以千万计的召唤师加入我们,aa联盟因你们的到来而精彩 三年后,当我们品尝回忆的滋味,有苦楚也有喜悦。这是召唤师的盛会,也是你我的节日", files: ['https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg'], createDate: Date.now()},
        {id: 1, title: "三周年庆典", description: "三年里,数以千万计的召唤师加入我们,aa联盟因你们的到来而精彩 三年后,当我们品尝回忆的滋味,有苦楚也有喜悦。这是召唤师的盛会,也是你我的节日", files: ['https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg', 'https://img2.baidu.com/it/u=3495436499,1211422207&fm=26&fmt=auto&gp=0.jpg'], createDate: Date.now()}
      ]}
    ];
    this.setData({
      index: this.data.index + 1,
      data: this.data.data.concat(data)
    })
  },
})