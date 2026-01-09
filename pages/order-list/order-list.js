// pages/order-list/order-list.js
const app = getApp();
const fetch = require('../../utils/util').fetch;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentStatus: 'all', // all, 0, 1, 2, 4
        tabs: [
            { status: 'all', name: '全部' },
            { status: '0', name: '待付款' },
            { status: '1', name: '待发货' },
            { status: '2', name: '待收货' },
            { status: '4', name: '待评价' }
        ],
        orderList: [],
        loading: false,
        page: 1,
        pageSize: 10,
        hasMore: true,
        statusConfig: {
            '0': { text: '待付款', color: '#ff6b6b', action: '去支付' },
            '1': { text: '待发货', color: '#ffa500', action: '提醒发货' },
            '2': { text: '待收货', color: '#1890ff', action: '确认收货' },
            '3': { text: '已完成', color: '#52c41a', action: '再次购买' },
            '4': { text: '待评价', color: '#faad14', action: '去评价' },
            '5': { text: '已取消', color: '#999', action: '删除订单' },
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('Order list page options:', options);
        
        const status = options.status || 'all';
        this.setData({ 
            currentStatus: status 
        });
        
        // 加载订单列表
        this.loadOrders();
    },

    /**
     * 切换Tab
     */
    onTabChange: function(e) {
        const status = e.currentTarget.dataset.status;
        this.setData({
            currentStatus: status,
            orderList: [],
            page: 1,
            hasMore: true
        });
        this.loadOrders();
    },

    /**
     * 加载订单列表
     */
    loadOrders: function() {
        const { currentStatus, page, pageSize, loading, hasMore } = this.data;
        
        if (loading || !hasMore) {
            return;
        }

        this.setData({ loading: true });

        // 构建请求URL
        let url = `${app.globalData.baseApiUrl}/order/list?page=${page}&pageSize=${pageSize}`;
        if (currentStatus !== 'all') {
            url += `&status=${currentStatus}`;
        }

        fetch({
            url: url,
            method: 'get'
        }).then(res => {
            console.log('Orders:', res);
            
            const orders = Array.isArray(res.data) ? res.data : [];
            const hasMore = orders.length >= pageSize;

            this.setData({
                orderList: page === 1 ? orders : [...this.data.orderList, ...orders],
                loading: false,
                hasMore: hasMore,
                page: page + 1
            });
        }).catch(err => {
            console.error('Failed to load orders:', err);
            this.setData({ loading: false });
            
            // 加载失败，使用模拟数据
            this.loadMockOrders();
        });
    },

    /**
     * 加载模拟订单数据（用于测试）
     */
    loadMockOrders: function() {
        const mockOrders = [
            {
                order_id: '202601100001',
                status: '0',
                create_time: '2026-01-10 10:30:00',
                total_price: 15800,
                total_count: 3,
                store_name: '超市便利店',
                address: {
                    recipient: '张三',
                    phone: '138****8888',
                    address: '北京市朝阳区xx街道xx号'
                },
                delivery_time: {
                    label: '今天下午',
                    description: '14:00 - 18:00'
                },
                items: [
                    { goods_name: '可口可乐', unit_name: '瓶装 330ml', price: 300, count: 2, subtotal: 600 },
                    { goods_name: '薯片', unit_name: '袋装 100g', price: 800, count: 1, subtotal: 800 },
                    { goods_name: '矿泉水', unit_name: '瓶装 500ml', price: 200, count: 5, subtotal: 1000 }
                ]
            },
            {
                order_id: '202601090001',
                status: '1',
                create_time: '2026-01-09 15:20:00',
                total_price: 28500,
                total_count: 5,
                store_name: '生鲜超市',
                address: {
                    recipient: '李四',
                    phone: '139****9999',
                    address: '上海市浦东新区xx路xx号'
                },
                delivery_time: {
                    label: '明天上午',
                    description: '9:00 - 12:00'
                },
                items: [
                    { goods_name: '苹果', unit_name: '500g', price: 1500, count: 2, subtotal: 3000 },
                    { goods_name: '牛奶', unit_name: '盒装 250ml', price: 500, count: 3, subtotal: 1500 }
                ]
            },
            {
                order_id: '202601080001',
                status: '2',
                create_time: '2026-01-08 11:00:00',
                total_price: 45600,
                total_count: 4,
                store_name: '日用百货',
                address: {
                    recipient: '王五',
                    phone: '137****7777',
                    address: '广州市天河区xx路xx号'
                },
                delivery_time: {
                    label: '今天晚间',
                    description: '18:00 - 21:00'
                },
                items: [
                    { goods_name: '洗衣液', unit_name: '2L', price: 3800, count: 1, subtotal: 3800 },
                    { goods_name: '纸巾', unit_name: '10包装', price: 2500, count: 2, subtotal: 5000 }
                ]
            }
        ];

        // 根据状态筛选
        let filteredOrders = mockOrders;
        if (this.data.currentStatus !== 'all') {
            filteredOrders = mockOrders.filter(order => order.status === this.data.currentStatus);
        }

        this.setData({
            orderList: filteredOrders,
            loading: false,
            hasMore: false
        });
    },

    /**
     * 订单操作
     */
    onOrderAction: function(e) {
        const orderId = e.currentTarget.dataset.id;
        const status = e.currentTarget.dataset.status;
        
        const config = this.data.statusConfig[status];
        
        switch(status) {
            case '0': // 待付款 - 去支付
                this.handlePayment(orderId);
                break;
            case '1': // 待发货 - 提醒发货
                this.handleRemindShip(orderId);
                break;
            case '2': // 待收货 - 确认收货
                this.handleConfirmReceipt(orderId);
                break;
            case '3': // 已完成 - 再次购买
                this.handleRebuy(orderId);
                break;
            case '4': // 待评价 - 去评价
                this.handleEvaluate(orderId);
                break;
            case '5': // 已取消 - 删除订单
                this.handleDeleteOrder(orderId);
                break;
        }
    },

    /**
     * 去支付
     */
    handlePayment: function(orderId) {
        wx.showModal({
            title: '确认支付',
            content: '是否确认支付该订单？',
            success: (res) => {
                if (res.confirm) {
                    // 调用支付接口
                    wx.showLoading({ title: '支付中...' });
                    
                    setTimeout(() => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success'
                        });
                        // 刷新订单列表
                        this.refreshOrders();
                    }, 1500);
                }
            }
        });
    },

    /**
     * 提醒发货
     */
    handleRemindShip: function(orderId) {
        wx.showToast({
            title: '已提醒商家发货',
            icon: 'success'
        });
    },

    /**
     * 确认收货
     */
    handleConfirmReceipt: function(orderId) {
        wx.showModal({
            title: '确认收货',
            content: '请确认已收到商品',
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '处理中...' });
                    
                    setTimeout(() => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '确认收货成功',
                            icon: 'success'
                        });
                        this.refreshOrders();
                    }, 1000);
                }
            }
        });
    },

    /**
     * 再次购买
     */
    handleRebuy: function(orderId) {
        wx.showToast({
            title: '已加入购物车',
            icon: 'success'
        });
    },

    /**
     * 去评价
     */
    handleEvaluate: function(orderId) {
        wx.navigateTo({
            url: `/pages/evaluate/index?orderId=${orderId}`
        });
    },

    /**
     * 删除订单
     */
    handleDeleteOrder: function(orderId) {
        wx.showModal({
            title: '删除订单',
            content: '确认删除该订单？',
            success: (res) => {
                if (res.confirm) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                    this.refreshOrders();
                }
            }
        });
    },

    /**
     * 取消订单
     */
    onCancelOrder: function(e) {
        const orderId = e.currentTarget.dataset.id;
        
        wx.showModal({
            title: '取消订单',
            content: '确认取消该订单？',
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '处理中...' });
                    
                    setTimeout(() => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '订单已取消',
                            icon: 'success'
                        });
                        this.refreshOrders();
                    }, 1000);
                }
            }
        });
    },

    /**
     * 查看订单详情
     */
    onViewDetail: function(e) {
        const orderId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/order-detail/index?orderId=${orderId}`
        });
    },

    /**
     * 刷新订单列表
     */
    refreshOrders: function() {
        this.setData({
            orderList: [],
            page: 1,
            hasMore: true
        });
        this.loadOrders();
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
        this.refreshOrders();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadOrders();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})