// pages/store/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pages: null,
        loading: false,
        pageNum: 0,
        stories: [],
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
        this.onLoadStoreList();
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
        console.log('onPullDownRefresh');
        this.setData({ pageNum: 0 });
        this.onLoadStoreList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("onReachBottom");
        const { pageNum, pages } = this.data;
        console.log('pages', pages, 'pageNum', pageNum);
        if (pages && pages <= pageNum + 1) {
            return;
        }
        this.setData({ pageNum: pageNum + 1 });
        this.onLoadStoreList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onLoadStoreList: function() {
        const { pageNum, stories } = this.data;
        this.setData({ loading: true });
        fetch({ url: `${app.globalData.baseApiUrl}/store/pagination`, method: 'post', data: { pageNum, pageSize: 5, filtered: [], sorted: []} })
        .then((res) => {
            console.log('res', res);
            if (pageNum) {
                this.setData({ stories: stories.concat(res.data), pages: res.pages });
            } else {
                this.setData({ stories: res.data, pages: res.pages });
            }
        })
        .catch((err) => wx.showToast({
          title: '加载失败',
        }))
        .finally(() => this.setData({ loading: false }));
    },
})