// pages/home/index.js
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
      { id: 1, meChecked: false, good: 1, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 2, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 3, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 4, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 5, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 6, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' }
    ];
    this.setData({
      index: this.data.index + 1,
      data: this.data.data.concat(data)
    })
  },

  checkedGood: function(e) {
    const id = e.currentTarget.dataset.id;
    this.data.data.forEach(v => {
      if(v.id === id) {
        v.good = v.good ? v.good + 1: 1;
        v.meChecked = true;
      }
    })
    this.setData({data: this.data.data});
  },

  uncheckedGood: function(e) {
    const id = e.currentTarget.dataset.id;
    this.data.data.forEach(v => {
      if (v.id === id) {
        v.good = v.good ? v.good - 1 : 0;
        v.meChecked = false;
      }
    })
    this.setData({ data: this.data.data });
  }
})