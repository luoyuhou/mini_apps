// pages/goods/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // "生鲜果蔬", "休闲食品", "粮油调味","酒水饮料", "粮油调味", "烟品茶饮", "方便速食", "散装食品", "熟食烘焙", "冷冻食品", "日化用品", "家庭用品"
        categoryId: 0,
        categories: [
            { id: 0, name: "生鲜果蔬"},
            { id: 1, name: "休闲食品"},
            { id: 2, name: "粮油调味"},
            { id: 3, name: "酒水饮料"},
            { id: 4, name: "粮油调味"},
            { id: 5, name: "烟品茶饮"},
            { id: 6, name: "粮油调味"},
            { id: 7, name: "方便速食"},
            { id: 8, name: "粮油调味"},
            { id: 9, name: "散装食品"},
            { id: 10, name: "日化用品"},
            { id: 11, name: "家庭用品"},
            { id: 12, name: "生鲜果蔬"},
            { id: 13, name: "休闲食品"},
            { id: 14, name: "粮油调味"},
            { id: 15, name: "酒水饮料"},
            { id: 16, name: "粮油调味"},
            { id: 17, name: "烟品茶饮"},
            { id: 18, name: "粮油调味"},
            { id: 19, name: "方便速食"},
            { id: 20, name: "粮油调味"},
            { id: 21, name: "散装食品"},
            { id: 22, name: "日化用品"},
            { id: 23, name: "家庭用品"},
        ],
        goods: [
            { id: 0, name: "瓜子", price: 10, monthly_number: 50, remained_number: 21 },
            { id: 1, name: "花生", price: 10, monthly_number: 50, remained_number: 21 },
            { id: 2, name: "矿泉水", price: 10, monthly_number: 50, remained_number: 21 },
            { id: 3, name: "啤酒", price: 10, monthly_number: 50, remained_number: 21 },
            { id: 4, name: "饮料", price: 10, monthly_number: 50, remained_number: 21 },
            { id: 5, name: "八宝粥", price: 10, monthly_number: 50, remained_number: 21 },
        ],
        cars: {},
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

    onSwitchCategory: function(e) {
        const id = e.target.dataset.id;
        this.setData({ categoryId: id });
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