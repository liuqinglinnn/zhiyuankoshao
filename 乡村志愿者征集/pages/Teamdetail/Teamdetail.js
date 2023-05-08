Page({
  data: {
    openid: "",
    activity: "",
    team: [],
    pictures: [],
    images: ['/icon/flag.png', '/icon/mine.png', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKyR0dB1kpACIRQlBCcHOQo5aibAn2HuhTh62woiaQfF3rrHuXRTywyCIm0eqkVgJZw7HWu0ibFFJ56w/132', '/icon/arrow-down.png']
  },

  onLoad(options) {
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ 'openid': res.data })
      },
      fail: () => { },
    })
    console.log(options, 222);
    let idx = options.id
    let that = this;
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getactivityByid',
      data: { id: idx },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res);
        let act = res.data;
        if (act.mode == "线上") { act.placeactually = '线上' }
        that.setData({ activity: act })
        let i;
        let teamarr = []
        let picarr = []
        wx.request({
          url: 'https://www.zhiyuankoushao.top/getTeamMemberMsg',
          data: {
            activityid: res.data.id,
            teamNumber: 1
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log(res, '这是队伍');
            teamarr.push(res.data);
          },
          fail: () => { },
          complete: () => { that.setData({ team: teamarr }) }
        });
        let k;
        for (k = 0; k < 3; k++) {
          wx.request({
            url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
            data: { id: res.data.id + '-' + k },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              console.log(res, '这是图片');
              picarr.push(res.data.url)
            },
            fail: () => { },
            complete: () => { that.setData({ pictures: picarr }) }
          });
        }
        console.log(teamarr, picarr);
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
  // addnewteam(e) {
  //   console.log(e);
  //   let len = this.data.team.length
  //   wx.request({
  //     url: 'http://106.13.204.79:8080/asignforTeamMember',
  //     data: {
  //       openid: this.data.openid,
  //       activityid: this.data.activity.id,
  //       teamNumber: len

  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: (res) => {
  //       console.log(res);
  //     },
  //     fail: () => { },
  //     complete: () => { }
  //   });

  // },

  // addteam(e) {
  //   let teamid = e.currentTarget.dataset.teamid
  //   console.log(teamid, this.data.openid, this.data.activity.id, teamid);
  //   wx.request({
  //     url: 'http://106.13.204.79:8080/asignforTeamMember',
  //     data: {
  //       openid: this.data.openid,
  //       activityid: this.data.activity.id,
  //       teamNumber: teamid + 1
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: (res) => {
  //       console.log(res);
  //       if (res.data.error == "用户已经加入队伍，不要重复加入") {
  //         wx.showToast({
  //           title: '该活动您已报名',
  //           icon: 'error',
  //           duration: 1500,
  //           success: (res) => { },
  //         });
  //       }
  //       if (res.data.error == "队伍人数已经满") {
  //         wx.showToast({
  //           title: '队伍人数已满',
  //           icon: 'error',
  //           duration: 1500,
  //           success: (res) => { },
  //         });
  //       }
  //       if (res.data.success == "添加成功") {
  //         wx.requestSubscribeMessage({
  //           tmplIds: ['Mq-b6Yz5H76RViYPsfqP5iAN40Yf3e-TseCXoD6MVgs'],
  //           success(res) {
  //             console.log(res);
  //             wx.request({
  //               url: 'http://106.13.204.79:8080/sendsubScribMessageToUser?touser=okb8W5DmtBIhkw_wShC2bGkYAerU&activityid=1',
  //               data: {},
  //               header: {
  //                 'content-type': 'application/x-www-form-urlencoded'
  //               },
  //               method: 'POST',
  //               dataType: 'json',
  //               responseType: 'text',
  //               success: (res) => {
  //                 console.log(res);
  //               },
  //               fail: () => { },
  //               complete: () => { }
  //             });
  //           }
  //         })
  //         wx.showToast({
  //           title: '添加成功',
  //           icon: 'success',
  //           duration: 1500,
  //           success: (res) => {
  //             console.log('aaa');
  //           },
  //         });
  //       }

  //     },
  //     fail: () => { },
  //     complete: () => { }

  //   })
  // },
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
  baoming(e) {
    console.log(e);
    let that = this
    const query = wx.createSelectorQuery()
    query.select('#huodongbaoming').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
      let h = res[1].scrollHeight;
      wx.pageScrollTo({
        scrollTop: h,
        duration: 1000
      })
    })
  },
  qiandao() {
    wx.navigateTo({
      url: '../Qiandao/Qiandao?id=' + this.data.activity.id,
      success: (res) => { },
      fail: () => { },
      complete: () => { }
    });
  },
  siliao(e) {
    console.log(e);
    wx.navigateTo({
      url: '../Chat/Chat?oppositename=' + e.currentTarget.dataset.eid,
      success: (res) => { },
      fail: () => { },
      complete: () => { }
    });
  },
  qunliao(e) {
    wx.navigateTo({
      url: '../Qunliao/Qunliao',
      success: (res) => { },
      fail: () => { },
      complete: () => { }
    });
  }
})