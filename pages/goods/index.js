// pages/goods/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        address: "",
        storeId: "",
        categoryId: 0,
        categories: [],
        goods: [],
        expandedGoods: {}, // 记录哪些商品已展开
        cars: {}, // { version_id: count }
        searchKeyword: "",
        totalCount: 0, // 购物车总数量
        totalPrice: 0, // 购物车总价格
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ storeId: options.storeId });

        // 加载店铺信息
        fetch({ 
            url: `${app.globalData.baseApiUrl}/store/${options.storeId}`, 
            method: "get" 
        }).then((res) => {
            console.log("store", res);
            this.setData({ 
                address: `${res.province_name}${res.city_name}${res.area_name}${res.town_name}${res.address}`
            });
        });

        // 加载分类
        fetch({ 
            url: `${app.globalData.baseApiUrl}/store/category/${options.storeId}`, 
            method: "get" 
        }).then((res) => { 
            this.setData({ categories: res });
            const categoryId = res[0]?.category_id;
            this.setData({ categoryId: categoryId });
            return categoryId;
        }).then((id) => {
            if (!id) return;
            this.loadGoods(id);
        });
    },

    /**
     * 加载商品及其版本
     */
    loadGoods: function(categoryId) {
        // 加载商品列表
        fetch({ 
            url: `${app.globalData.baseApiUrl}/store/goods/category/${categoryId}`, 
            method: "get" 
        }).then((goodsList) => {
            console.log('goods list', goodsList);
            
            // 为每个商品加载版本信息
            const promises = goodsList.map(goods => 
                fetch({ 
                    url: `${app.globalData.baseApiUrl}/store/goods/version/${goods.goods_id}`, 
                    method: "get" 
                }).then(res => {
                    // 过滤激活状态的版本，并按价格排序
                    const activeVersions = (res.data || [])
                        .filter(v => v.status === 1)
                        .sort((a, b) => a.price - b.price);
                    
                    return {
                        ...goods,
                        versions: activeVersions
                    };
                }).catch(err => {
                    console.error('Failed to load versions for', goods.goods_id, err);
                    return {
                        ...goods,
                        versions: []
                    };
                })
            );

            return Promise.all(promises);
        }).then((goodsWithVersions) => {
            // 只显示有版本的商品
            const validGoods = goodsWithVersions.filter(g => g.versions.length > 0);
            console.log('goods with versions', validGoods);
            this.setData({ goods: validGoods });
        }).catch(err => {
            console.error('Failed to load goods', err);
            wx.showToast({
                title: '加载商品失败',
                icon: 'none'
            });
        });
    },

    /**
     * 切换分类
     */
    onSwitchCategory: function(e) {
        const id = e.target.dataset.id;
        this.setData({ 
            categoryId: id,
            goods: [] // 清空当前商品列表
        });
        this.loadGoods(id);
    },

    /**
     * 展开/收起商品规格
     */
    onToggleExpand: function(e) {
        const goodsId = e.currentTarget.dataset.id;
        const { expandedGoods } = this.data;
        expandedGoods[goodsId] = !expandedGoods[goodsId];
        this.setData({ expandedGoods });
    },

    /**
     * 添加到购物车
     */
    onAddGoodsToCars: function(e) {
        const versionId = e.currentTarget.dataset.id;
        const goodsName = e.currentTarget.dataset.name;
        const unitName = e.currentTarget.dataset.unit;
        
        // 查找对应的版本信息
        let version = null;
        for (let goods of this.data.goods) {
            version = goods.versions.find(v => v.version_id === versionId);
            if (version) break;
        }

        if (!version) {
            wx.showToast({
                title: '商品信息错误',
                icon: 'none'
            });
            return;
        }

        // 检查库存
        const currentCount = this.data.cars[versionId] || 0;
        if (currentCount >= version.count) {
            wx.showToast({
                title: '库存不足',
                icon: 'none'
            });
            return;
        }

        const { cars } = this.data;
        cars[versionId] = currentCount + 1;
        
        this.setData({ cars }, () => {
            this.calculateTotal();
        });

        // 显示添加成功提示
        wx.showToast({
            title: `已添加 ${goodsName}(${unitName})`,
            icon: 'success',
            duration: 1000
        });
    },

    /**
     * 从购物车减少
     */
    onReduceGoodsOnCars: function(e) {
        const versionId = e.currentTarget.dataset.id;
        const { cars } = this.data;
        const currentCount = cars[versionId] || 0;

        if (currentCount > 0) {
            cars[versionId] = currentCount - 1;
            this.setData({ cars }, () => {
                this.calculateTotal();
            });
        }
    },

    /**
     * 计算购物车总数和总价
     */
    calculateTotal: function() {
        const { cars, goods } = this.data;
        let totalCount = 0;
        let totalPrice = 0;

        // 遍历购物车
        for (let versionId in cars) {
            const count = cars[versionId];
            if (count <= 0) continue;

            // 查找版本信息
            for (let goodsItem of goods) {
                const version = goodsItem.versions.find(v => v.version_id === versionId);
                if (version) {
                    totalCount += count;
                    totalPrice += version.price * count;
                    break;
                }
            }
        }

        this.setData({ 
            totalCount,
            totalPrice
        });
    },

    /**
     * 清空购物车（由订单页调用）
     */
    clearCart: function() {
        console.log('清空购物车');
        this.setData({ 
            cars: {},
            totalCount: 0,
            totalPrice: 0
        });
    },

    /**
     * 查看购物车
     */
    onViewCart: function() {
        const { cars, goods, storeId } = this.data;
        const cartItems = [];

        for (let versionId in cars) {
            const count = cars[versionId];
            if (count <= 0) continue;

            for (let goodsItem of goods) {
                const version = goodsItem.versions.find(v => v.version_id === versionId);
                if (version) {
                    cartItems.push({
                        goods_id: goodsItem.goods_id,
                        goods_name: goodsItem.name,
                        version_id: versionId,
                        goods_version_id: versionId,
                        unit_name: version.unit_name,
                        price: version.price,
                        count: count,
                        subtotal: version.price * count
                    });
                    break;
                }
            }
        }

        if (cartItems.length === 0) {
            wx.showToast({
                title: '购物车为空',
                icon: 'none'
            });
            return;
        }

        console.log('购物车内容:', cartItems);
        
        // 跳转到订单页面，传递购物车数据
        wx.navigateTo({
            url: `/pages/order/index?storeId=${storeId}&cart=${encodeURIComponent(JSON.stringify(cartItems))}`
        });
    },

    /**
     * 搜索商品
     */
    onSearch: function() {
        const { searchKeyword, goods } = this.data;
        if (!searchKeyword.trim()) {
            wx.showToast({
                title: '请输入搜索关键词',
                icon: 'none'
            });
            return;
        }

        // TODO: 调用后端搜索接口
        // 临时方案：前端过滤
        const filteredGoods = goods.filter(item => 
            item.name.includes(searchKeyword) || 
            item.description?.includes(searchKeyword)
        );

        if (filteredGoods.length === 0) {
            wx.showToast({
                title: '未找到相关商品',
                icon: 'none'
            });
        } else {
            this.setData({ goods: filteredGoods });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        const { categoryId } = this.data;
        if (categoryId) {
            this.loadGoods(categoryId);
        }
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {}
});
