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

const fetch = (url, method, payload, success, fail) => {
  wx.request({
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
    success,
    fail
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
