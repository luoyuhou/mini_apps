import moment from 'moment';

moment.locale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm:ss",
  }
});

const formatDate = date => {
  return moment(date).format();
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const fetch = ({ url, method, data }) => {
  console.log('url=', url);
  const token = wx.getStorageSync('token');
  const sid = wx.getStorageSync('connect.sid');

  // console.log('fetch token', token);
  console.log('fetch data', data);
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header: {
        'content-type': 'Application/json',
        'no-redirect': true,
        'cookie': `token=${token};connect.sid=${sid}`,
      },
      data: data,
      success: (res) => {
        console.log('fetch success', res);
        if (res.statusCode !== 200) {
          reject(res.data);
        }
        if (res && Array.isArray(res.cookies) && res.cookies.length) {
          res.cookies.forEach((str) => {
            const cookieInfo = str.split(";");
            const key = cookieInfo[0].split("=");
            wx.setStorageSync(key[0], key[1])
          })
        }
        resolve(res.data);
      },
      fail: (e) => {
        console.log('error', e.message);
        reject(e.message);
      },
      complete: (com) => {
        console.log("complete", com);
      }
    }).onHeadersReceived((result) => {
      console.log("header received", result);
      console.log('location', result.header.location)
    })
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  fetch: fetch
}
exports.formatDate = formatDate;
