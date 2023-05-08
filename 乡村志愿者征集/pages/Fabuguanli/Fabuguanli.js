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
        for (i = 0; i < res.data.numofmate; i++) {
          wx.request({
            url: 'https://www.zhiyuankoushao.top/getTeamMemberMsg',
            data: {
              activityid: res.data.id,
              teamNumber: i + 1
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
        }
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
  //     url: 'https://www.zhiyuankoushao.top/asignforTeamMember',
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

  addteam(e) {
    let that = this
    if (this.data.openid != "") {
      let teamid = e.currentTarget.dataset.teamid
      console.log(teamid, this.data.openid, this.data.activity.id, teamid);
      wx.request({
        url: 'https://www.zhiyuankoushao.top/asignforTeamMember',
        data: {
          openid: this.data.openid,
          activityid: this.data.activity.id,
          teamNumber: 1
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          console.log(res);
          if (res.data.error == "用户已经加入队伍，不要重复加入") {
            wx.showToast({
              title: '该活动您已报名',
              icon: 'error',
              duration: 1500,
              success: (res) => { },
            });
          }
          if (res.data.error == "队伍人数已经满") {
            wx.showToast({
              title: '队伍人数已满',
              icon: 'error',
              duration: 1500,
              success: (res) => { },
            });
          }
          if (res.data.success == "添加成功") {
            wx.requestSubscribeMessage({
              tmplIds: ['Mq-b6Yz5H76RViYPsfqP5iAN40Yf3e-TseCXoD6MVgs'],
              success(res) {
                console.log(res);
                wx.request({
                  url: 'https://www.zhiyuankoushao.top/sendsubScribMessageToUser?touser=okb8W5DmtBIhkw_wShC2bGkYAerU&activityid=1',
                  data: {},
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: (res) => {
                    console.log(res);
                    that.onLoad({ id: that.data.activity.id })
                  },
                  fail: () => { },
                  complete: () => { }
                });
              }
            })
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500,
              success: (res) => {
                console.log('aaa');

              },
            });
          }

        },
        fail: () => { },
        complete: () => { }
      })
    }
    else {
      wx.getUserProfile({
        desc: '获取你的头像，用户名等信息',
        success: (res) => {
          console.log(res);
          let nick = res.userInfo.nickName;
          let headpic = res.userInfo.avatarUrl;
          wx.setStorage({
            key: 'username',
            data: res.userInfo.nickName,
            success: (res) => { console.log("用户名加入缓存"); },
          });
          wx.setStorage({
            key: 'userpicture',
            data: res.userInfo.avatarUrl,
            success: (res) => { console.log("头像加入缓存"); },
          });
          //获取code
          wx.login({
            success: function (res) {
              console.log(res.code)//code
              wx.request({
                url: `https://www.zhiyuankoushao.top/login`,
                data: { code: res.code, },
                method: "GET",
                success(res) {
                  console.log(res.data)
                  let id = res.data.openid
                  wx.setStorage({
                    key: 'openid',
                    data: res.data.openid,
                    success: (res) => {
                      wx.request({
                        url: 'https://www.zhiyuankoushao.top/addUser',
                        data: {
                          openid: id,
                          realname: " ",
                          headpic: headpic,
                          nickname: nick,
                          workplace: "无",
                        },
                        method: 'POST',
                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                        success: (res) => { },
                        fail: () => { },
                      });
                    },
                  });
                  that.setData({ openid: res.data.openid, })
                }
              })
            }
          })
        }
      })
    }
  },
  chatsponsor(e) {
    let that = this
    if (this.data.openid != "") {
      console.log(e);
      console.log(this.data.activity.sopenid);
      wx.navigateTo({
        url: '../Chat/Chat?oppositename=' + this.data.activity.sopenid,
        success: (res) => { },
        fail: () => { },
        complete: () => { }
      });

    }
    else {
      wx.getUserProfile({
        desc: '获取你的头像，用户名等信息',
        success: (res) => {
          console.log(res);
          let nick = res.userInfo.nickName;
          let headpic = res.userInfo.avatarUrl;
          wx.setStorage({
            key: 'username',
            data: res.userInfo.nickName,
            success: (res) => { console.log("用户名加入缓存"); },
          });
          wx.setStorage({
            key: 'userpicture',
            data: res.userInfo.avatarUrl,
            success: (res) => { console.log("头像加入缓存"); },
          });
          //获取code
          wx.login({
            success: function (res) {
              console.log(res.code)//code
              wx.request({
                url: `https://www.zhiyuankoushao.top/login`,
                data: { code: res.code, },
                method: "GET",
                success(res) {
                  console.log(res.data)
                  let id = res.data.openid
                  wx.setStorage({
                    key: 'openid',
                    data: res.data.openid,
                    success: (res) => {
                      wx.request({
                        url: 'https://www.zhiyuankoushao.top/addUser',
                        data: {
                          openid: id,
                          realname: " ",
                          headpic: headpic,
                          nickname: nick,
                          workplace: "无",
                        },
                        method: 'POST',
                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                        success: (res) => { },
                        fail: () => { },
                      });

                    },
                  });
                  that.setData({ openid: res.data.openid, })
                }
              })
            }
          })
        }
      })

    }
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
  mingdandaochu() {
    wx.downloadFile({
      url: '', //仅为示例，并非真实的资源
      success(res) {
        console.log(res);
      }
    })
  },
  qunliao() {
    wx.navigateTo({
      url: '../Qunliao/Qunliao',
      success: (res) => { },
      fail: () => { },
      complete: () => { }
    });
  }
})