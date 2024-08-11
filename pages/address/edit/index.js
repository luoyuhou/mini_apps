// pages/address/edit/index.js
const app = getApp();
const fetch = require('../../../utils/util').fetch;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_address_id: null,
        recipient: null,
        phone: null,
        address: null,

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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options);
        const { user_address_id } = options;
        if (!user_address_id) {
            wx.showToast({
                icon: 'error',
                title: '未获取到地址ID',
            });

            wx.navigateBack();
            return;
        }

        fetch({ url: `${app.globalData.baseApiUrl}/wx/user/address/${user_address_id}`, method: 'get' })
        .then((userAddress) => {
            console.log("address res", userAddress);
            this.setData({
                user_address_id,
                recipient: userAddress?.data?.recipient,
                phone: userAddress?.data?.phone,
                address: userAddress?.data?.address,
            });
            const { province: provinceCode, city: cityCode, area: areaCode, town: townCode } = userAddress?.data ?? {};
            
            // load
            fetch({ url: `${app.globalData.baseApiUrl}/general/province`, method: 'get' })
            .then((res) => {
                console.log('province load', res);
                const list = Array.isArray(res) ? res : [];
                const find = list.find((v) => v.code === provinceCode);
                this.setData({
                    provinces: list,
                    province: find ?? null,
                });
            })
            .catch((err) => wx.showToast({
                icon: 'error',
                title: err.message,
            }));

            fetch({ url: `${app.globalData.baseApiUrl}/general/province?pid=${provinceCode}`, method: 'get' })
            .then((res) => {
                const list = Array.isArray(res) ? res : [];
                const find = list.find((v) => v.code === cityCode);
                this.setData({
                    cities: list,
                    city: find ?? null,
                });
            })
            .catch((err) => wx.showToast({
                icon: 'error',
                title: err.message,
            }));

            fetch({ url: `${app.globalData.baseApiUrl}/general/province?pid=${cityCode}`, method: 'get' })
            .then((res) => {
                const list = Array.isArray(res) ? res : [];
                const find = list.find((v) => v.code === areaCode);
                this.setData({
                    areas: list,
                    area: find ?? null,
                });
            })
            .catch((err) => wx.showToast({
                icon: 'error',
                title: err.message,
            }));

            fetch({ url: `${app.globalData.baseApiUrl}/general/province?pid=${areaCode}`, method: 'get' })
            .then((res) => {
                const list = Array.isArray(res) ? res : [];
                const find = list.find((v) => v.town === townCode);
                this.setData({
                    towns: list,
                    town: find ?? null,
                });
            })
            .catch((err) => wx.showToast({
                icon: 'error',
                title: err.message,
            }));
        })
        .catch((err) => {
            wx.showToast({
                icon: 'error',
                title: err.message,
            });
            console.log("err", err.message);
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
            area: null,
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
            area: null,
            town: null,
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
            town: null,
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
        const find = this.data.towns.find((p) => p.town === e.currentTarget.dataset?.town);

        this.setData({
            town: find ?? null,
            showTownList: !this.data.showTownList,
        })
    },

    formSubmit: function(e) {
        const { recipient, phone, address } = e.detail.value ?? {};

        if(!recipient) {
            wx.showToast({
                icon: "error",
                title: "收件人 为必填",
            });
            return;
        }

        if(!phone) {
            wx.showToast({
                icon: "error",
                title: "电话 为必填",
            });
            return;
        }

        if (!address) {
            wx.showToast({
                icon: "error",
                title: "收件地址 为必填",
            });
            return;
        }

        const { province, city, area, town, addressIsDefault, user_address_id } = this.data;

        if(!province) {
            wx.showToast({
                icon: "error",
                title: "省 / 市 必填",
            });
            return;
        }
        if(!city) {
            wx.showToast({
                icon: "error",
                title: "市 / 区 为必填",
            });
            return;
        }
        if(!area) {
            wx.showToast({
                icon: "error",
                title: "县市 / 地区 为必填",
            });
            return;
        }
        if(!town) {
            wx.showToast({
                icon: "error",
                title: "城镇 / 街道 为必填",
            });
            return;
        }
        const payload = {
            recipient,
            phone,
            address,
            province: province.code,
            city: city.code,
            area: area.code,
            town: town.town,
            is_default: addressIsDefault,
        };

        wx.showToast({
            icon: "loading",
            title: '更新收货地址',
        })
        this.setData({
            submitting: true,
        });

        fetch({  url: `${app.globalData.baseApiUrl}/wx/user/address/${user_address_id}`, method: 'put', data: payload })
        .then((res) => {
            wx.showToast({
                icon: 'success',
                title: '更新成功',
            });
            wx.navigateTo({
                url: '../index/index',
            });
        })
        .catch((err) => {
            wx.showModal({
                title: "更新地址失败",
                content: JSON.stringify(err.message),
            })
        })
        .finally(() => {
            this.setData({
                submitting: false,
            });
        });
    },
})