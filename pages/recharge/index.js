// pages/recharge/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        pageIndex: 0,
        pages: [
          { name: "全部", index: 0, status: null },
          { name: "待支付", index: 1, status: 0 },
          { name: "已完成", index: 2, status: 1 },
          { name: "已取消", index: 3, status: -1 },
        ],
        data: {}
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
        var data = this.data.pages.map((v) => {
            return [v.index] = []
        });
        this.setData({
            data: data
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loadData(this.data.pageIndex);
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

    loadData: function(index) {
        console.log('index', index);
        this.setData({
            loading: true,
        })
        fetch({
            url: `${app.globalData.baseApiUrl}/order/index`,
            method: 'post',
            data: {
                pageNum: Math.ceil(this.data.data[index].length / 5),
                pageSize: 5,
                status: this.data.pages[index].status
            }
        }).then((res) => {
            console.log('res', res);
            if(!res.code) {
                throw new Error(res.msg);
            }
            if(!res.data.length) {
                wx.showToast({
                    icon: 'none',
                    title: "没有更多的数据",
                });
                return;
            }
            for(let k in this.data.data) {
                if(k === index) {
                    this.data.data[k].push(...res.data);
                }
            }
            this.setData({
                data: this.data.data,
            })
        }).catch((e) => {
            wx.showToast({
                icon:'none',
                title: e.message,
            })
        }).finally(() => {
            this.setData({
                loading: false,
            })
        })
    },

    onSlidePage: function(e) {
        let index = e.currentTarget.id;
        let load = this.data.data[index].length;
        this.setData({
          pageIndex: index,
        })
        if(!load) {
            this.loadData(index);
        }
      },
})