Page({
  data: {
    openid: "",
    activity: "",
    team: [],
    picture0: "",
    picture1: "",
    picture2: "",
    picture3: "",
    picture4: "",
    pan: 0
  },

  onLoad(options) {
    let idx = options.id
    let that = this;
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ 'openid': res.data })
      },
      fail: () => { },
    })

    wx.request({
      url: 'https://www.zhiyuankoushao.top/getactivityByid',
      data: { id: idx },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let act = res.data;
        console.log('huodon', act);
        wx.request({
          url: 'https://www.zhiyuankoushao.top/activityStart',
          data: {
            openid: 'okb8W5DmtBIhkw_wShC2bGkYAerU',
            activityid: idx,
            lat1: 1.1,
            lng1: 1.0,
            lat2: 1.100000000000001,
            lng2: 1.00000000000000001
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            //判断有没有开始
            if (res.data.error == "活动还没开始，无法进行签到") {
              that.setData({ pan: 0 })
            }
            else if (res.data.error == "活动已经结束,无法进行签到") {
              that.setData({ pan: 0 })
            }
            else {
              //判断有没有签到
              wx.getStorage({
                key: 'act' + idx,
                success: (res) => {
                  if (res.data == 'qiandaochenggong') { that.setData({ pan: 2 }) }
                  if (res.data == 'qiantuichenggong') { that.setData({ pan: 3 }) }
                  if (res.data == 'xianshang') {
                    that.setData({ pan: 4 })
                  }
                },
                fail: (err) => { console.log(err); that.setData({ pan: 1 }) },
                complete: () => { }
              });
            }
          },
          fail: (err) => { console.log(err); },
          complete: () => { }
        });
        if (act.mode == "线上") { act.placeactually = '线上' }
        that.setData({ activity: act })
        for (let k = 0; k <= 4; k++) {
          wx.request({
            url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
            data: { id: '1000' + k },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              let tem = 'picture' + (res.data.url[42])
              console.log(tem,res.data.url[42], res.data.url);
              that.setData({ [tem]: res.data.url })
            },
            fail: () => { },
            complete: () => { }
          });
        }
        if (act.mode == "线下") {
          let act2 = 'activity.placeactually';
          let a = res.data.place.split(/[-]+/);
          let string = a[0] + a[1];
          that.setData({ [act2]: string })
        }

      },
      fail: () => { },
      complete: () => {
        wx.request({
          url: 'https://www.zhiyuankoushao.top/getUserInfo',
          data: { openid: that.data.activity.sponsor },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log(res);
            that.setData({ 'activity.realname': res.data.realname, 'activity.sopenid': res.data.openid, 'activity.phonenum': res.data.phonenum })
          },
          fail: () => { },
          complete: () => { }
        });
      }
    });
  },

  onReady() {

  },

  onShow() {

  },
  chatsponsor(e) {
    console.log(e);
    console.log(this.data.activity.sopenid);
    wx.navigateTo({
      url: '../Chat/Chat?oppositename=' + this.data.activity.sopenid,
      success: (res) => { },
      fail: () => { },
      complete: () => { }
    });
  },
  qiandao() {
    let that = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        let a = that.data.activity.place.split(/[-]+/);
        console.log(a);
        let lat = a[3];
        let lon = a[5];
        console.log("当前位置的经纬度为：", res.latitude, res.longitude, res);
        wx.request({
          url: 'https://www.zhiyuankoushao.top/activityStart',
          data: {
            openid: that.data.openid,
            activityid: that.data.activity.id,
            lat1: lat,
            lng1: lon,
            lat2: res.latitude,
            lng2: res.longitude
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log(res);
            if (res.data.error == "超出签到范围，请在活动范围内进行签到") {
              wx.showToast({
                title: '请在范围内签到',
                icon: 'error',
                duration: 1500,
                mask: false,
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
              });
            }
            if (res.data.success == "签到成功") {
              if (that.data.activity.place == '线上') {
                that.setData({ pan: 4 })
                wx.setStorage({
                  key: 'act' + that.data.activity.id,
                  data: 'xianshang',
                  success: (result) => {
                    wx.showToast({
                      title: '请等待对方确认',
                      icon: 'success',
                      duration: 1500,
                      mask: false,
                      success: (result) => { },
                      fail: () => { },
                      complete: () => { }
                    });
                  },
                  fail: () => { },
                  complete: () => { }
                });
              }
              else {
                that.setData({ pan: 2 })
                wx.setStorage({
                  key: 'act' + that.data.activity.id,
                  data: 'qiandaochenggong',
                  success: (result) => {
                    wx.showToast({
                      title: '签到成功',
                      icon: 'success',
                      duration: 1500,
                      mask: false,
                      success: (result) => { },
                      fail: () => { },
                      complete: () => { }
                    });
                  },
                  fail: () => { },
                  complete: () => { }
                });
              }
            }
          },
          fail: () => { },
          complete: () => { }
        });
      }
    })
  },
  qiantui() {
    let that = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        let a = that.data.activity.place.split(/[-]+/);
        console.log(a);
        let lat = a[3];
        let lon = a[5];
        console.log("当前位置的经纬度为：", res.latitude, res.longitude, res);
        wx.request({
          url: 'https://www.zhiyuankoushao.top/activityEnd',
          data: {
            openid: that.data.openid,
            activityid: that.data.activity.id,
            lat1: lat,
            lng1: lon,
            lat2: res.latitude,
            lng2: res.longitude
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log(res);
            if (res.data.error == "超出签到范围，请在活动范围内进行签到") {
              wx.showToast({
                title: '请在范围内签退',
                icon: 'error',
                duration: 1500,
                mask: false,
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
              });
            }
            if (res.data.success == "签到成功") {
              wx.showToast({
                title: '签退成功',
                icon: 'success',
                duration: 1500,
                mask: false,
                success: (result) => {
                  that.setData({ pan: 2 })
                  wx.setStorage({
                    key: 'act' + that.data.activity.id,
                    data: 'qiandaochenggong',
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
          fail: () => { },
          complete: () => { }
        });
      }
    })
  }
})