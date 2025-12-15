// pages/home/index.js
const app = getApp();
const fetch = require('../../utils/util').fetch;
const config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    data: [],
    profile: {},
    baseUrl: "",
    location: "定位中...",
    latitude: null,
    longitude: null,
    categories: [
      { id: 2, name: '外卖', icon: 'emoji', emoji: '🏠' },
      { id: 3, name: '超市', icon: 'emoji', emoji: '🛒' },
      { id: 4, name: '水果', icon: 'emoji', emoji: '🍊' },
      { id: 5, name: '买菜', icon: 'emoji', emoji: '🥬' },
      { id: 6, name: '医药', icon: 'emoji', emoji: '💊' },
      { id: 7, name: '鲜花', icon: 'emoji', emoji: '💐' },
      { id: 8, name: '更多', icon: '../../static/img/home.png', disabled: true }
    ],
    banners: [
      { id: 1, image: '../../static/img/car.jpg' },
      { id: 2, image: '../../static/img/store_brief.png' },
      { id: 3, image: '../../static/img/car.jpg' }
    ],
    stores: [
      { id: 1, name: '美味餐厅', image: '../../static/img/store_brief.png', rating: 4.8, sales: 1200, avgPrice: 35, deliveryFee: 5 },
      { id: 2, name: '便利超市', image: '../../static/img/store_brief.png', rating: 4.9, sales: 850, avgPrice: 20, deliveryFee: 3 },
      { id: 3, name: '水果鲜生', image: '../../static/img/store_brief.png', rating: 4.7, sales: 650, avgPrice: 25, deliveryFee: 4 },
      { id: 4, name: '特色小吃', image: '../../static/img/store_brief.png', rating: 4.6, sales: 520, avgPrice: 18, deliveryFee: 3 },
      { id: 5, name: '快餐连锁', image: '../../static/img/store_brief.png', rating: 4.8, sales: 980, avgPrice: 30, deliveryFee: 5 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation();
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
    this.setData({
      profile: app.globalData.userInfo
    });
    this.loadData();
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
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadData: function () {
    const data = [
      { id: 1, meChecked: false, good: 1, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 2, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 3, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 4, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 5, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' },
      { id: 6, username: 'jack', avatar: "https://img2.baidu.com/it/u=441072932,880591356&fm=26&fmt=auto&gp=0.jpg", createDate: new Date(), message: '春眠不觉晓，处处闻啼鸟。', url: 'https://vd3.bdstatic.com/mda-mgp4rpu14uanfd27/sc/cae_h264/1627097538537122138/mda-mgp4rpu14uanfd27.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1627124754-0-0-9b815f8a01b0278d8db0aad02a771d0f&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000165_2' }
    ];
    this.setData({
      index: this.data.index + 1,
      data: this.data.data.concat(data)
    })
  },

  onTriggleScan: function() {
    console.log('----------');
    wx.scanCode({
      // onlyFromCamera: true,
      success: (res) => {
        console.log('scan res', res);
        fetch({
          url: res.result
        }).then((res) => {
          console.log('res', res);
        })
      }
    })
  },

  onRecharge: function() {
    wx.navigateTo({
      url: '../order/index',
    })
  },

  onSearch: function() {
    wx.navigateTo({
      url: '../store/index',
    })
  },

  onCategoryClick: function(e) {
    const id = e.currentTarget.dataset.id;
    const disabled = e.currentTarget.dataset.disabled;
    
    // 如果是禁用的按钮，直接返回不执行跳转
    if (disabled) {
      return;
    }
    
    wx.navigateTo({
      url: '../store/index?category=' + id,
    })
  },

  onStoreClick: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/index?storeId=' + id,
    })
  },

  onQuickEntry: function(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'chat') {
      wx.navigateTo({
        url: '../chat/index',
      })
    } else if (type === 'order') {
      wx.navigateTo({
        url: '../order-list/order-list',
      })
    }
  },

  // 获取用户位置（自动定位）
  getUserLocation: function() {
    const that = this;
    
    wx.getLocation({
      type: 'gcj02', // 使用国测局坐标系
      success: function(res) {
        console.log('获取位置成功:', res);
        const latitude = res.latitude;
        const longitude = res.longitude;
        
        that.setData({
          latitude: latitude,
          longitude: longitude
        });
        
        // 调用逆地址解析
        that.reverseGeocoder(latitude, longitude);
      },
      fail: function(err) {
        console.error('获取位置失败:', err);
        that.setData({
          location: '北京市朝阳区'
        });
      }
    });
  },

  // 逆地址解析（经纬度转地址）
  reverseGeocoder: function(latitude, longitude) {
    const that = this;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: latitude + ',' + longitude,
        key: config.tencentMapKey, // 从配置文件读取
        get_poi: 1 // 返回POI（兴趣点）信息
      },
      success: function(result) {
        console.log('逆地址解析结果:', result);
        if (result.data.status === 0) {
          const data = result.data.result;
          let locationText = '';
          
          // 优先使用POI信息（如商场、小区名称）
          if (data.pois && data.pois.length > 0) {
            // 取最近的POI点
            locationText = data.pois[0].title;
          } 
          // 其次使用地址组件
          else if (data.address_component) {
            const addr = data.address_component;
            // 组合：区 + 街道 或 区 + 村/镇
            if (addr.street) {
              locationText = addr.district + addr.street;
            } else if (addr.town || addr.village) {
              locationText = addr.district + (addr.town || addr.village);
            } else {
              locationText = addr.city + addr.district;
            }
          }
          // 最后使用格式化地址
          else if (data.formatted_addresses && data.formatted_addresses.recommend) {
            locationText = data.formatted_addresses.recommend;
          }
          
          // 限制显示长度
          if (locationText.length > 15) {
            locationText = locationText.substring(0, 15) + '...';
          }
          
          that.setData({
            location: locationText || '当前位置'
          });
        } else {
          console.error('逆地址解析失败:', result.data);
          that.setData({
            location: '定位失败'
          });
        }
      },
      fail: function(err) {
        console.error('请求逆地址解析失败:', err);
        that.setData({
          location: '定位失败'
        });
      }
    });
  },

  // 点击位置，选择新位置
  onLocationClick: function() {
    const that = this;
    wx.chooseLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      success: function(res) {
        console.log('选择位置成功:', res);
        
        // 优先使用用户选择的位置名称
        let locationText = res.name || res.address;
        
        // 如果没有名称，使用逆地址解析
        if (!locationText) {
          that.reverseGeocoder(res.latitude, res.longitude);
        } else {
          // 简化显示
          if (locationText.length > 15) {
            locationText = locationText.substring(0, 15) + '...';
          }
          that.setData({
            location: locationText,
            latitude: res.latitude,
            longitude: res.longitude
          });
        }
        
        // 更新经纬度
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: function(err) {
        console.error('选择位置失败或取消:', err);
      }
    });
  }
})