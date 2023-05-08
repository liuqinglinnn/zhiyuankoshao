Page({
  data: {
    userInfo: { useropenid: "", username: "登录", userpicture: "/icon/mine.png", userlevel: 0 },//用户信息
    Organize: ""
  },
  onLoad() {

  },
  onShow() {
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
  },
  //登录
  Userlogin(e) {
    let that = this;
    if (that.data.userInfo.useropenid == "") {
      wx.getUserProfile({
        desc: '获取你的头像，用户名等信息',
        success: (res) => {
          console.log(res);
          let nick = res.userInfo.nickName;
          let headpic = res.userInfo.avatarUrl;
          that.setData({
            'userInfo.username': res.userInfo.nickName, 'userInfo.userpicture': res.userInfo.avatarUrl
          })
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
                  that.setData({ 'userInfo.useropenid': res.data.openid, })
                }
              })
            }
          })
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../Level/Level',
        success: (res) => { },
        fail: () => { },
      });
    }
  },
  //发布活动
  Callforvolunteer() {
    if (this.data.Organize != "") {
      wx.navigateTo({
        url: '../Callforvolunteers/Callforvolunteers?organization=' + this.data.Organize,
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请完成机构认证',
        icon: 'error',
        duration: 1500,
        success: (res) => { },
        fail: () => { },
      });
    }
  },
  //用户信息显示
  ShowUser() {
    let that = this
    console.log(2222, this.data.userInfo.useropenid);
    let request = wx.request({
      url: 'https://www.zhiyuankoushao.top/getUserInfo',
      data: { openid: this.data.userInfo.useropenid },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res, "获取个人信息成功");
        if (res.data.level == null) { that.setData({ Organize: res.data.workplace, 'userInfo.userlevel': 0 }) }
        else { that.setData({ Organize: res.data.workplace, 'userInfo.userlevel': res.data.level }) }
      },
      fail: () => { },
    });
  },
  //个人认证
  UserInformation() {
    if (this.data.userInfo.useropenid != "") {
      wx.navigateTo({
        url: '../UserInformation/UserInformation?openid=' + this.data.userInfo.useropenid,
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        success: (res) => { },
        fail: () => { },
      });
    }
  },
  Organize(e) {
    console.log(e);
    if (this.data.userInfo.useropenid != "") {
      wx.navigateTo({
        url: '../UserOrganize/UserOrganize?openid=' + this.data.userInfo.useropenid,
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        success: (res) => { },
        fail: () => { },
      });
    }
  },
  //我的活动
  MyActivity() {
    if (this.data.userInfo.useropenid != '') {
      wx.navigateTo({
        url: '../MyActivity/MyActivity?openid=' + this.data.userInfo.useropenid,
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        success: (res) => { },
        fail: () => { },
      });
    }
  },
  huodong() {
    if (this.data.userInfo.useropenid != "") {
      wx.navigateTo({
        url: '../MyActivity/MyActivity',
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }
  },
  wofabudehuodong() {
    if (this.data.userInfo.useropenid != "") {
      wx.navigateTo({
        url: '../Fabudehuodong/Fabudehuodong',
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }
  },
  tuichudenglu() {
    let that = this
    if (this.data.userInfo.useropenid != "") {
      wx.clearStorage();
      wx.showToast({
        title: '退出登录成功',
        icon: 'success',
        duration: 1500,
        mask: false,
        success: (result) => {
          that.setData({
            userInfo: { useropenid: "", username: "登录", userpicture: "/icon/mine.png", userlevel: 0 },
            Organize: ""
          })
        },
        fail: () => { },
        complete: () => { }
      });

    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }
  },
  lianxi(e) {
    wx.showToast({
      title: '',

      image: '',
      duration: 1500,
      mask: false,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    wx.showToast({
      title: 'qq邮箱2857842743@qq.com',
      icon: 'none',
      duration: 1500,
      mask: false,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },

  shenhe() {
    if (this.data.userInfo.useropenid != "") {
      wx.navigateTo({
        url: '../Shenhe/Shenhe',
        success: (res) => { },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }
  }
})