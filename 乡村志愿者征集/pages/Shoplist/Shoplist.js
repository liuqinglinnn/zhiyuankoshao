Page({
  data: {
    coin: 0,
    pictures: [],
    goods: [{ i: 0, name: '志愿时长证明书', coin: 2000 }, { i: 1, name: '志愿口哨帆布袋', coin: 2000 }, { i: 2, name: '志愿口哨保温杯', coin: 3000 }, { i: 3, name: '志愿口哨晴雨伞', coin: 3000 }, { i: 4, name: '《乡村振兴战略》', coin: 5000 }]
  },
  onLoad(options) {
    let that = this;
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ 'userInfo.useropenid': res.data })
        wx.getStorage({
          key: 'userpicture',
          success: (res) => {
            that.setData({ 'userInfo.userpicture': res.data })
            wx.getStorage({
              key: 'username',
              success: (res) => {
                that.setData({ 'userInfo.username': res.data })
                that.ShowUser()
              },
              fail: () => { },
            })
          },
          fail: () => { },
        })
      },
      fail: () => { },
    })
    let picarr = [];
    for (let i = 1; i <= 5; i++) {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
        data: { id: '10000' + i },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          console.log(res, '这是图片', res.data.url[43]);
          picarr[res.data.url[43] - 1] = res.data.url
        },
        fail: () => { },
        complete: () => { that.setData({ pictures: picarr }), console.log(picarr, i); }
      });
    }
  },
  //用户信息显示
  ShowUser() {
    let that = this
    console.log(2222, this.data.userInfo.useropenid);
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getUserInfo',
      data: { openid: this.data.userInfo.useropenid },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res, "获取个人信息成功");
        if (res.data.coin != null) { that.setData({ coin: res.data.coin }) }

      },
      fail: () => { },
    });
  },
  jilu() {
    wx.showToast({
      title: '无兑换记录',
      icon: 'error',
      duration: 1500,
      mask: false,
      success: (res) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  buy(e) {
    console.log(e);
    let that = this;
    let cost = e.currentTarget.dataset.item
    if (this.data.coin < cost) {
      wx.showToast({
        title: '志愿币不足',
        icon: 'error',
        duration: 1500,
        mask: false,
        success: (res) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }
    else {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/buyThing',
        data: {
          openid: that.data.userInfo.useropenid,
          coin: cost
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          wx.showToast({
            title: '兑换成功，3日内发货至您的个人地址',
            icon: 'none',
            image: '',
            duration: 5000,
            mask: false,
            success: (result) => {
            },
            fail: () => { },
            complete: () => { }
          });
        },
        fail: () => { },
        complete: () => { }
      });
    }
  },
  gonglue() {
    wx.navigateTo({
      url: '../Gonglue/Gonglue',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  }
})