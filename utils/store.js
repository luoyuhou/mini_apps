const saveStorageSync = (key, value, serializable = false) => {
    wx.setStorageSync(key, (serializable && JSON.stringify(value)) || value);
}

const getStorageSync = (key, serializable = false) => {
    const val = wx.getStorageSync(key);
    if (!serializable) {
        return val;
    }
    try {
        return JSON.parse(val);
    } catch {
        return undefined;
    }
}

const removeStorageSync = (key) => {
    wx.removeStorageSync(key)
}
module.exports = { saveStorageSync, getStorageSync, removeStorageSync };