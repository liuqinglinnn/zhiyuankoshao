Page({
  data: {
    pictures: [],
    userInfo: { useropenid: "", username: "请先登录", userpicture: "/icon/mine.png", userlevel: 1, useraddress: "我的位置" },//用户信息
  },
  onLoad(options) {
    let that = this;
    let i;
    let picarr = [];
    for (i = 5; i <= 7; i++) {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
        data: { id: '100' + i },
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
      fail: () => {
        that.setData({
          userInfo: { useropenid: "", username: "请先登录", userpicture: "/icon/mine.png", userlevel: 1, useraddress: "我的位置" },//用户信息
        })
      },
    })

  },
  enter(e) {
    wx.navigateTo({
      url: '../Activitylist/Activitylist',
      success: (res) => { },
      fail: () => { },
    });
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
        if (res.data.level != null && res.data.level != 0) {
          console.log(res.data.level, 222);
          that.setData({ 'userInfo.userlevel': res.data.level })
        }
      },
      fail: () => { },
    });
  },
  myactivity(e) {
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
  shoplist(e) {
    wx.navigateTo({
      url: '../Shoplist/Shoplist',
      success: (res) => { },
      fail: () => { },
    });
  },
  level() {
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
                  let oid = res.data.openid
                  wx.setStorage({
                    key: 'openid',
                    data: res.data.openid,
                    success: (res) => {
                      wx.request({
                        url: 'https://www.zhiyuankoushao.top/addUser',
                        data: {
                          openid: oid,
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
  team() {
    if (this.data.userInfo.useropenid != "") {
      wx.navigateTo({
        url: '../Team/Team',
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
  address() {
    let that = this;
    wx.choosePoi({
      success: (res) => {
        console.log(res);
        if (res.city != "") {
          that.setData({ 'userInfo.useraddress': res.city })
        }
        if (res.address != "") {
          // let a = .split(/[-]+/);
          // console.log(a);
          that.setData({ 'userInfo.useraddress': res.name })
        }
      },
      fail: () => { console.log('shibai'); },
      complete: () => { }
    })
  }
});