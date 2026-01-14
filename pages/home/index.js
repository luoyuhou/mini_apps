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
      { id: 8, name: '更多', icon: '../../static/img/more.png', disabled: true }
    ],
    // 轮播图数据，初始为空，展示时从后端拉取
    banners: [],
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
    this.loadBanners();
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

  // 加载首页 feed 示例数据（与轮播无关）
  loadData: function () {},

  // 从 open-api 加载首页轮播图
  loadBanners: function () {
    const that = this;
    fetch({
      url: `${app.globalData.baseApiUrl}/wx/home/banners`,
      method: 'GET',
      data: {}
    }).then((res) => {
      const list = (res.data || []).map((item, index) => {
        return {
          id: item.banner_id || item.id || index,
          image: item.image_url,
          title: item.title,
          description: item.description,
        };
      });
      that.setData({
        banners: list
      });
    }).catch((error) => {
      console.error('加载轮播图失败:', error);
    });
  },

  onTriggleScan: function() {
    const that = this;
    
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        console.log('扫码成功:', res);
        const scanResult = res.result;
        
        try {
          // 解析二维码内容，提取 qrCodeId
          let qrCodeId = '';
          
          // 情况1: 扫描结果是 JSON 字符串
          try {
            const jsonData = JSON.parse(scanResult);
            if (jsonData.qrCodeId) {
              qrCodeId = jsonData.qrCodeId;
              console.log('从 JSON 解析得到 qrCodeId:', qrCodeId);
            }
          } catch (e) {
            // 不是 JSON，继续尝试其他格式
          }
          
          // 情况2: URL 参数格式 (http://domain/page?qrCodeId=xxx)
          if (!qrCodeId && scanResult.includes('qrCodeId=')) {
            try {
              const url = new URL(scanResult);
              qrCodeId = url.searchParams.get('qrCodeId');
              console.log('从 URL 参数解析得到 qrCodeId:', qrCodeId);
            } catch (e) {
              console.error('URL 解析失败:', e);
            }
          }
          
          // 情况3: 路径格式 (http://domain/qr-login/xxx)
          if (!qrCodeId && scanResult.includes('qr-login/')) {
            const parts = scanResult.split('qr-login/');
            if (parts.length > 1) {
              qrCodeId = parts[1].split('?')[0]; // 去掉可能的查询参数
              console.log('从路径解析得到 qrCodeId:', qrCodeId);
            }
          }
          
          // 情况4: 纯 UUID 格式
          if (!qrCodeId) {
            // 检查是否是 UUID 格式 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidPattern.test(scanResult)) {
              qrCodeId = scanResult;
              console.log('直接使用 UUID:', qrCodeId);
            }
          }
          
          if (!qrCodeId) {
            console.error('无法解析二维码内容:', scanResult);
            wx.showToast({
              title: '无效的二维码',
              icon: 'none',
              duration: 2000
            });
            return;
          }
          
          console.log('最终解析得到 qrCodeId:', qrCodeId);
          
          // 获取用户的 openid
          const openid = wx.getStorageSync('openid');
          if (!openid) {
            wx.showToast({
              title: '请先登录小程序',
              icon: 'none',
              duration: 2000
            });
            // 跳转到登录页
            wx.navigateTo({
              url: '/pages/login/index',
            });
            return;
          }
          
          // 1. 先标记为已扫描
          that.markQrCodeAsScanned(qrCodeId, openid);
          
        } catch (error) {
          console.error('解析二维码失败:', error);
          wx.showToast({
            title: '二维码格式错误',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('扫码失败:', err);
        if (err.errMsg !== 'scanCode:fail cancel') {
          wx.showToast({
            title: '扫码失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  
  /**
   * 标记二维码为已扫描
   */
  markQrCodeAsScanned: function(qrCodeId, openid) {
    const that = this;
    
    wx.showLoading({
      title: '处理中...',
    });
    
    fetch({
      url: `${config.baseApiUrl}/auth/qr-code/scan`,
      method: 'POST',
      data: {
        qrCodeId: qrCodeId,
        openid: openid
      }
    }).then((response) => {
      wx.hideLoading();
      console.log('标记已扫描成功:', response);
      
      // 显示确认对话框
      wx.showModal({
        title: '确认登录',
        content: '是否确认登录网页端？',
        confirmText: '确认登录',
        cancelText: '取消',
        success: (modalRes) => {
          if (modalRes.confirm) {
            // 用户点击确认，调用确认登录接口
            that.confirmQrLogin(qrCodeId, openid);
          } else {
            // 用户取消，提示已取消
            wx.showToast({
              title: '已取消登录',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }).catch((error) => {
      wx.hideLoading();
      console.error('标记已扫描失败:', error);
      wx.showToast({
        title: error.message || '操作失败，请重试',
        icon: 'none',
        duration: 2000
      });
    });
  },
  
  /**
   * 确认二维码登录
   */
  confirmQrLogin: function(qrCodeId, openid) {
    wx.showLoading({
      title: '登录中...',
    });
    
    fetch({
      url: `${config.baseApiUrl}/auth/qr-code/confirm`,
      method: 'POST',
      data: {
        qrCodeId: qrCodeId,
        openid: openid
      }
    }).then((response) => {
      wx.hideLoading();
      console.log('确认登录成功:', response);
      
      wx.showToast({
        title: '网页端登录成功',
        icon: 'success',
        duration: 2000
      });
    }).catch((error) => {
      wx.hideLoading();
      console.error('确认登录失败:', error);
      wx.showToast({
        title: error.message || '登录失败，请重试',
        icon: 'none',
        duration: 2000
      });
    });
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
