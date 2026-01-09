// pages/goods/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: "",
        categoryId: 0,
        categories: [],
        goods: [
            // { id: 0, name: "瓜子", price: 10, monthly_number: 50, remained_number: 21 },
        ],
        versions: [],
        cars: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        fetch({ url:   `${app.globalData.baseApiUrl}/store/${options.storeId}`, method: "get" })
        .then((res) => {
            console.log("store", res);
            this.setData({ address: `${res.province_name}${res.city_name}${res.area_name}${res.town_name}${res.address}`})
        });

        fetch({ url:   `${app.globalData.baseApiUrl}/store/category/${options.storeId}`, method: "get" })
        .then((res) => { 
            this.setData({ categories: res });
            const categoryId = res[0]?.category_id;
            this.setData({ categoryId: categoryId });

            return categoryId;
        })
        .then((id) => {
            if (!id) return;

            fetch({ url:  `${app.globalData.baseApiUrl}/store/goods/category/${id}`, method: "get" })
            .then((res) => {
                console.log('goods', res);
                this.setData({ goods: res });
            });
        })
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

    onSwitchCategory: function(e) {
        const id = e.target.dataset.id;
        this.setData({ categoryId: id });
        fetch({ url:  `${app.globalData.baseApiUrl}/store/goods/category/${id}`, method: "get" })
        .then((res) => {
            console.log('goods', res);
            this.setData({ goods: res });
        });
    },

    onAddGoodsToCars: function(e) {
        const { cars } = this.data;
        const id = e.target.dataset.id;

        cars[id] = (cars[id] ?? 0) + 1;
        this.setData({ cars });
    },

    onReduceGoodsOnCars: function(e) {
        const { cars } = this.data;
        const id = e.target.dataset.id;

        cars[id] = (cars[id] ?? 0) > 0 ? cars[id] - 1:  0;
        this.setData({ cars });
    }
})