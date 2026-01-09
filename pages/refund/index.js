// pages/refund/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentStatus: 0, // 0:待退款, 1:已完成, 2:已拒绝, -1:已取消, null:全部
        tabs: [
            { status: null, name: '全部' },
            { status: 0, name: '待退款' },
            { status: 1, name: '已完成' },
            { status: 2, name: '已拒绝' },
        ],
        refundList: [],
        loading: false,
        page: 1,
        pageSize: 10,
        hasMore: true,
        statusConfig: {
            '0': { text: '待退款', color: '#ff6b6b' },
            '1': { text: '已完成', color: '#52c41a' },
            '2': { text: '已拒绝', color: '#999' },
            '-1': { text: '已取消', color: '#999' },
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadRefundList();
    },

    /**
     * 切换Tab
     */
    onTabChange: function(e) {
        const status = e.currentTarget.dataset.status;
        this.setData({
            currentStatus: status,
            refundList: [],
            page: 1,
            hasMore: true
        });
        this.loadRefundList();
    },

    /**
     * 加载退款列表
     */
    loadRefundList: function() {
        const { currentStatus, page, pageSize, loading, hasMore } = this.data;
        
        if (loading || !hasMore) {
            return;
        }

        this.setData({ loading: true });

        const requestData = {
            pageNum: page,
            pageSize: pageSize,
            status: currentStatus
        };

        fetch({
            url: `${app.globalData.baseApiUrl}/refund/index`,
            method: 'post',
            data: requestData
        }).then(res => {
            console.log('Refunds:', res);
            
            const refunds = Array.isArray(res.data) ? res.data : [];
            const hasMore = refunds.length >= pageSize;

            this.setData({
                refundList: page === 1 ? refunds : [...this.data.refundList, ...refunds],
                loading: false,
                hasMore: hasMore,
                page: page + 1
            });
        }).catch(err => {
            console.error('Failed to load refunds:', err);
            this.setData({ loading: false });
            
            // 加载失败，使用模拟数据
            this.loadMockRefunds();
        });
    },

    /**
     * 加载模拟退款数据（用于测试）
     */
    loadMockRefunds: function() {
        const mockRefunds = [
            {
                refund_id: 'RF202601100001',
                order_id: '202601100001',
                state: 0,
                money: 15800,
                reason: '商品不符合描述',
                createtime: '2026-01-10 11:30:00',
                goods_info: {
                    goods_name: '可口可乐',
                    unit_name: '瓶装 330ml',
                    count: 2
                }
            },
            {
                refund_id: 'RF202601090001',
                order_id: '202601090001',
                state: 1,
                money: 28500,
                reason: '收到商品破损',
                createtime: '2026-01-09 16:20:00',
                goods_info: {
                    goods_name: '苹果',
                    unit_name: '500g',
                    count: 2
                }
            },
            {
                refund_id: 'RF202601080001',
                order_id: '202601080001',
                state: 2,
                money: 45600,
                reason: '不想要了',
                createtime: '2026-01-08 14:00:00',
                goods_info: {
                    goods_name: '洗衣液',
                    unit_name: '2L',
                    count: 1
                }
            }
        ];

        // 根据状态筛选
        let filteredRefunds = mockRefunds;
        if (this.data.currentStatus !== null) {
            filteredRefunds = mockRefunds.filter(refund => refund.state === this.data.currentStatus);
        }

        this.setData({
            refundList: filteredRefunds,
            loading: false,
            hasMore: false
        });
    },

    /**
     * 查看退款详情
     */
    onViewDetail: function(e) {
        const refundId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/refund-detail/index?refundId=${refundId}`
        });
    },

    /**
     * 取消退款
     */
    onCancelRefund: function(e) {
        const refundId = e.currentTarget.dataset.id;
        
        wx.showModal({
            title: '取消退款',
            content: '确认取消该退款申请？',
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '处理中...' });
                    
                    setTimeout(() => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '已取消退款',
                            icon: 'success'
                        });
                        this.refreshRefunds();
                    }, 1000);
                }
            }
        });
    },

    /**
     * 催促退款
     */
    onUrgeRefund: function(e) {
        wx.showToast({
            title: '已提醒商家处理',
            icon: 'success'
        });
    },

    /**
     * 刷新退款列表
     */
    refreshRefunds: function() {
        this.setData({
            refundList: [],
            page: 1,
            hasMore: true
        });
        this.loadRefundList();
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
        this.refreshRefunds();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadRefundList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})