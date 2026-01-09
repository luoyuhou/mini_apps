// pages/order/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeId: "",
        cartItems: [], // 购物车商品列表
        totalCount: 0, // 总数量
        totalPrice: 0, // 总价格
        selectedAddress: null, // 选中的收货地址
        addressList: [], // 地址列表
        deliveryTime: null, // 选中的送达时间
        deliveryTimeOptions: [], // 送达时间选项
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('Order page options:', options);
        
        if (options.storeId) {
            this.setData({ storeId: options.storeId });
        }

        // 接收购物车数据
        if (options.cart) {
            try {
                const cartItems = JSON.parse(decodeURIComponent(options.cart));
                console.log('Cart items:', cartItems);
                this.setData({ cartItems });
                this.calculateTotal();
            } catch (e) {
                console.error('Failed to parse cart data:', e);
                wx.showToast({
                    title: '购物车数据错误',
                    icon: 'none'
                });
            }
        }

        // 加载收货地址
        this.loadAddressList();

        // 初始化送达时间选项
        this.initDeliveryTimeOptions();
    },

    /**
     * 加载用户收货地址列表
     */
    loadAddressList: function() {
        fetch({ 
            url: `${app.globalData.baseApiUrl}/wx/user/address`, 
            method: 'get' 
        }).then((res) => {
            console.log("address res", res);
            const addressList = Array.isArray(res?.data) ? res.data : [];
            
            // 查找默认地址
            let defaultAddress = addressList.find(addr => addr.is_default);
            
            // 如果没有默认地址，使用第一个地址
            if (!defaultAddress && addressList.length > 0) {
                defaultAddress = addressList[0];
            }

            this.setData({
                addressList: addressList,
                selectedAddress: defaultAddress
            });
        }).catch((err) => {
            console.error('Failed to load address:', err);
            wx.showToast({
                icon: 'none',
                title: '加载地址失败',
            });
        });
    },

    /**
     * 选择收货地址
     */
    onSelectAddress: function() {
        const { addressList } = this.data;
        
        if (addressList.length === 0) {
            // 没有地址，跳转到新增地址页面
            wx.navigateTo({
                url: '/pages/address/add/index'
            });
            return;
        }

        // 显示地址选择器
        const addressNames = addressList.map(addr => 
            `${addr.recipient} ${addr.phone} ${addr.address}`
        );

        wx.showActionSheet({
            itemList: addressNames,
            success: (res) => {
                const selectedAddress = addressList[res.tapIndex];
                this.setData({ selectedAddress });
            }
        });
    },

    /**
     * 跳转到地址管理
     */
    onManageAddress: function() {
        wx.navigateTo({
            url: '/pages/address/index/index'
        });
    },

    /**
     * 初始化送达时间选项
     */
    initDeliveryTimeOptions: function() {
        const options = [];
        const now = new Date();
        
        // 立即送达（30分钟内）
        options.push({
            id: 'immediate',
            label: '立即送达',
            description: '预计30分钟内送达',
            time: new Date(now.getTime() + 30 * 60000)
        });

        // 今天的时间段
        const currentHour = now.getHours();
        const todaySlots = [
            { start: 9, end: 12, label: '上午' },
            { start: 12, end: 14, label: '午间' },
            { start: 14, end: 18, label: '下午' },
            { start: 18, end: 21, label: '晚间' }
        ];

        todaySlots.forEach(slot => {
            if (currentHour < slot.end - 1) { // 至少提前1小时
                const slotDate = new Date(now);
                slotDate.setHours(slot.start, 0, 0, 0);
                
                options.push({
                    id: `today-${slot.start}`,
                    label: `今天${slot.label}`,
                    description: `${slot.start}:00 - ${slot.end}:00`,
                    time: slotDate
                });
            }
        });

        // 明天的时间段
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        todaySlots.forEach(slot => {
            const slotDate = new Date(tomorrow);
            slotDate.setHours(slot.start, 0, 0, 0);
            
            options.push({
                id: `tomorrow-${slot.start}`,
                label: `明天${slot.label}`,
                description: `${slot.start}:00 - ${slot.end}:00`,
                time: slotDate
            });
        });

        // 后天的时间段
        const dayAfterTomorrow = new Date(now);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        
        todaySlots.forEach(slot => {
            const slotDate = new Date(dayAfterTomorrow);
            slotDate.setHours(slot.start, 0, 0, 0);
            
            options.push({
                id: `day-after-${slot.start}`,
                label: `后天${slot.label}`,
                description: `${slot.start}:00 - ${slot.end}:00`,
                time: slotDate
            });
        });

        // 默认选择立即送达
        this.setData({
            deliveryTimeOptions: options,
            deliveryTime: options[0]
        });
    },

    /**
     * 选择送达时间
     */
    onSelectDeliveryTime: function() {
        const { deliveryTimeOptions } = this.data;
        
        const itemList = deliveryTimeOptions.map(option => 
            `${option.label} (${option.description})`
        );

        wx.showActionSheet({
            itemList: itemList,
            success: (res) => {
                const selectedTime = deliveryTimeOptions[res.tapIndex];
                this.setData({ deliveryTime: selectedTime });
            }
        });
    },

    /**
     * 计算总价和总数量
     */
    calculateTotal: function() {
        const { cartItems } = this.data;
        let totalCount = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalCount += item.count;
            totalPrice += item.subtotal;
        });

        this.setData({ 
            totalCount,
            totalPrice 
        });
    },

    /**
     * 增加商品数量
     */
    onIncreaseCount: function(e) {
        const index = e.currentTarget.dataset.index;
        const { cartItems } = this.data;
        
        cartItems[index].count++;
        cartItems[index].subtotal = cartItems[index].price * cartItems[index].count;
        
        this.setData({ cartItems });
        this.calculateTotal();
    },

    /**
     * 减少商品数量
     */
    onDecreaseCount: function(e) {
        const index = e.currentTarget.dataset.index;
        const { cartItems } = this.data;
        
        if (cartItems[index].count > 1) {
            cartItems[index].count--;
            cartItems[index].subtotal = cartItems[index].price * cartItems[index].count;
            
            this.setData({ cartItems });
            this.calculateTotal();
        } else {
            // 如果数量为1，询问是否删除
            wx.showModal({
                title: '提示',
                content: '是否删除该商品？',
                success: (res) => {
                    if (res.confirm) {
                        this.onDeleteItem(index);
                    }
                }
            });
        }
    },

    /**
     * 删除商品
     */
    onDeleteItem: function(index) {
        const { cartItems } = this.data;
        cartItems.splice(index, 1);
        this.setData({ cartItems });
        this.calculateTotal();

        if (cartItems.length === 0) {
            wx.showToast({
                title: '购物车已清空',
                icon: 'none',
                duration: 1500
            });
        }
    },

    /**
     * 手动输入数量
     */
    onInputCount: function(e) {
        const index = e.currentTarget.dataset.index;
        const value = parseInt(e.detail.value);
        const { cartItems } = this.data;

        if (value > 0) {
            cartItems[index].count = value;
            cartItems[index].subtotal = cartItems[index].price * cartItems[index].count;
            
            this.setData({ cartItems });
            this.calculateTotal();
        } else {
            wx.showToast({
                title: '数量必须大于0',
                icon: 'none'
            });
            // 恢复原值
            this.setData({ cartItems });
        }
    },


    /**
     * 提交订单
     */
    onOrder: function() {
        const { cartItems, totalPrice, storeId, selectedAddress, deliveryTime } = this.data;
        
        if (cartItems.length === 0) {
            wx.showToast({
                icon: 'none',
                title: "购物车为空"
            });
            return;
        }

        if (!selectedAddress) {
            wx.showToast({
                icon: 'none',
                title: "请选择收货地址"
            });
            return;
        }

        if (!deliveryTime) {
            wx.showToast({
                icon: 'none',
                title: "请选择送达时间"
            });
            return;
        }

        wx.showModal({
            title: '确认下单',
            content: `共 ${cartItems.length} 种商品，总计 ${(totalPrice / 100).toFixed(2)} 元\n送达时间: ${deliveryTime.label}`,
            success: (sm) => {
                if (sm.confirm) {
                    const orderData = {
                        store_id: storeId,
                        goods: cartItems,
                        total_price: totalPrice,
                        total_count: this.data.totalCount,
                        user_address_id: selectedAddress.user_address_id,
                        delivery_date: deliveryTime.time,
                    };

                    fetch({
                        url: `${app.globalData.baseApiUrl}/order`,
                        method: "post",
                        data: orderData,
                    }).then((res) => {
                        console.log('Order created:', res);
                        wx.showToast({
                            title: '下单成功',
                            icon: 'success'
                        });
                        
                        // 延迟跳转到订单列表或返回上一页
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 1500);
                    }).catch((err) => {
                        console.error('Order failed:', err);
                        wx.showToast({
                            title: '下单失败',
                            icon: 'none'
                        });
                    });
                }
            }
        });
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
        // 从地址管理页面返回时重新加载地址
        if (this.data.addressList.length === 0) {
            this.loadAddressList();
        }
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

    }
})