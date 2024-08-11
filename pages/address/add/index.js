// pages/address/add/index.js
const app = getApp();
const fetch = require('../../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // province
        province: null,
        provinces: [],
        showProvinceList: false,

        // city
        city: null,
        cities: [],
        showCitiesList: false,

        // area
        area: null,
        areas: [],
        showAreaList: false,

        // town
        town: null,
        towns: [],
        showTownList: false,

        addressIsDefault: true,
        submitting: false,
    },

    switchChange(e) {
        this.setData({
            addressIsDefault: e.detail.value,
        });
    },
    
    topShowProvinces() {
        this.setData({
            showProvinceList: !this.data.showProvinceList,
        });
    },

    chooseProvince(e) {
        const find = this.data.provinces.find((p) => p.code === e.currentTarget.dataset?.code);

        if (find.code === this.data.province?.code) {
            this.setData({
                showTownList: !this.data.showTownList,
            });
            return;
        }

        this.setData({
            province: find ?? null,
            city: null,
            town: null,
            showProvinceList: !this.data.showProvinceList,
            showCitiesList: false,
            showTownList: false,
        });

        fetch({ url: `${app.globalData.baseApiUrl}/general/province?pid=${find.code}`, method: 'get' })
        .then((res) => {
            this.setData({
                cities: Array.isArray(res) ? res : [],
            });
        })
        .catch((err) => wx.showToast({
            icon: 'error',
            title: err.message,
        }));
    },

    topShowCity() {
        this.setData({
            showCitiesList: !this.data.showCitiesList,
        });
    },

    chooseCity(e) {
        const find = this.data.cities.find((p) => p.code === e.currentTarget.dataset?.code);

        if (find.code === this.data.province?.code) {
            this.setData({
                showCitiesList: !this.data.showCitiesList,
            });
            return;
        }

        this.setData({
            city: find ?? null,
            showCitiesList: !this.data.showCitiesList,
            showTownList: false,
        });

        fetch({ url: `${app.globalData.baseApiUrl}/general/province?pid=${find.code}`, method: 'get' })
        .then((res) => {
            this.setData({
                areas: Array.isArray(res) ? res : [],
            });
        })
        .catch((err) => wx.showToast({
            icon: 'error',
            title: err.message,
        }));
    },

    topShowArea() {
        this.setData({
            showAreaList: !this.data.showAreaList,
        });
    },

    chooseArea(e) {
        const find = this.data.areas.find((p) => p.code === e.currentTarget.dataset?.code);

        this.setData({
            area: find ?? null,
            showAreaList: !this.data.showAreaList,
        });

        fetch({ url: `${app.globalData.baseApiUrl}/general/province?pid=${find.code}`, method: 'get' })
        .then((res) => {
            this.setData({
                towns: Array.isArray(res) ? res : [],
            });
        })
        .catch((err) => wx.showToast({
            icon: 'error',
            title: err.message,
        }));
    },

    topShowTown() {
        this.setData({
            showTownList: !this.data.showTownList,
        });
    },

    chooseTown(e) {
        const find = this.data.towns.find((p) => p.code === e.currentTarget.dataset?.code);

        this.setData({
            town: find ?? null,
            showTownList: !this.data.showTownList,
        })
    },

    formSubmit: function(e) {
        const { recipient, phone } = e.detail.value ?? {};

        if(!recipient) {
            wx.showToast({
                icon: "error",
                title: "收件人 为必填字段",
            });
            return;
        }

        if(!phone) {
            wx.showToast({
                icon: "error",
                title: "电话 为必填字段",
            });
            return;
        }

        const { province, city, area, town, is_default } = this.data;

        if(!province) {
            wx.showToast({
                icon: "error",
                title: "省 / 市 必填字段",
            });
            return;
        }
        if(!city) {
            wx.showToast({
                icon: "error",
                title: "市 / 区 为必填字段",
            });
            return;
        }
        if(!area) {
            wx.showToast({
                icon: "error",
                title: "县市 / 地区 为必填字段",
            });
            return;
        }
        if(!town) {
            wx.showToast({
                icon: "error",
                title: "城镇 / 街道 为必填字段",
            });
            return;
        }
        const payload = {
            recipient,
            phone,
            province: province.code,
            city: city.code,
            area: area.code,
            town: town.code,
            is_default,
        };

        wx.showToast({
            icon: "loading",
            title: '创建新的收货地址',
        })
        this.setData({
            submitting: true,
        });

        fetch({})
        .then()
        .catch()
        .finily();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        fetch({ url: `${app.globalData.baseApiUrl}/general/province`, method: 'get' })
        .then((res) => {
            this.setData({
                provinces: Array.isArray(res) ? res : [],
            });
        })
        .catch((err) => wx.showToast({
            icon: 'error',
            title: err.message,
        }))
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

    }
})