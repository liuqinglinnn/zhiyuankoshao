Page({
  data: {
    openid: "",
    classifyarray: ['社会团体', '基⾦会', '社会服务机构', '党政机关', '事业单位', '群团组织', '乡镇街道备案', '基层⾃治性组织', '⾼校,中⼩学等学校机构',],
    index1: 0,
    name: "",
    address: "",
    reason: "",
    realname: ""
  },
  onLoad(options) {
    let that = this
    this.setData({ openid: options.openid })
  },
  onReady() { },
  ClassifyChange: function (e) { this.setData({ index1: e.detail.value }) },
  //输入框值
  InputValue(e) {
    console.log(e);
    let classify = e.currentTarget.dataset.data
    if (classify == "name") { this.setData({ name: e.detail.value }) }
    if (classify == "address") { this.setData({ address: e.detail.value }) }

  },
  Reason(e) {
    this.setData({ reason: e.detail.value })
  },
  Submit(e) {
    let that = this
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getUserInfo',
      data: { openid: that.data.openid },
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        wx.request({
          url: 'https://www.zhiyuankoushao.top/updateUserInfo',
          data: {
            workplace: that.data.name,
            openid: res.data.openid,
            realname: res.data.realname,
            sex: res.data.sex,
            birth: res.data.birth,
            headpic: res.data.headpic,
            nickname: res.data.nickname,
            age: res.data.age,
            poutlook: res.data.poutlook,
            phonenum: res.data.phonenum,
            mail: res.data.mail,
            work: res.data.work,
            highgrade: res.data.highgrade,
            address: res.data.address,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: (res) => {
            console.log(res);
            wx.showToast({
              title: '机构认证成功',
              icon: 'success',
              duration: 2500,
            });
          },
          fail: () => { },
        });
      },
      fail: () => { console.log("获取个人信息失败"); },
    });
  }

})