const app = getApp()
Page({
  data: {
    user: { username: "", userpicture: "", userid: "" },//用户本人
    oppositeuser: { oppositeusername: "志愿口哨", oppositeuserpicture: "/icon/mine.png", oppositeuserid: "" },//对话用户
    message: [],//消息记录
    scrollTop: 0,
    scrollid: 0,
    totalCount: 0, //查询总页数
    page: 0, //分页查询当前页
    pagenum: 10,//每页信息个数
    scrollHeight: '500px',//消息页面的高度
    inputvalue: null,//输入框的值
    triggered: true,//下拉刷新
    heights: 0,
  },
  onLoad(options) {
    let oppositeuserid = options.oppositename//对话用户
    let that = this;
    this.setData({ 'oppositeuser.oppositeuserid': oppositeuserid })
    // 获取用户信息
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ 'user.userid': res.data })
        wx.request({
          url: 'https://www.zhiyuankoushao.top/updateMsg',
          data: {
            myopenid: oppositeuserid,
            youropenid: res.data
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log(res, 44);
          },
          fail: () => { },
          complete: () => { }
        });
        wx.request({
          url: 'https://www.zhiyuankoushao.top/getUserInfo',
          data: { openid: oppositeuserid },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log('zheshiduimian', res);
            that.setData({ 'oppositeuser.oppositeusername': res.data.nickname, 'oppositeuser.oppositeuserpicture': res.data.headpic })
            that.initWebSocket()
            that.getHistory()
            console.log(res, 222);
            wx.getStorage({
              key: 'username',
              success: (res) => {
                that.setScrollHeight()
                that.setData({ 'user.username': res.data })
                wx.getStorage({
                  key: 'userpicture',
                  success: (res) => {
                    that.setData({ 'user.userpicture': res.data })
                  }
                })
              }
            })
            wx.setNavigationBarTitle({
              title: res.data.nickname,    //页面标题
              success: () => {
              },
              fail: () => {
              },
            })
          },
          fail: () => { },
        });

      },
      fail: () => { },
      complete: () => { }
    })
  },
  //websocket初始化
  initWebSocket() {
    let that = this;
    let myname = this.data.user.userid;//本人
    //建立连接
    wx.connectSocket({
      url: 'wss://www.zhiyuankoushao.top/WebSocket/' + myname,
      success(res) {
        console.log('连接成功')
      },
      fail() {
        console.log('连接失败')
      },
    })
    //监听连接开启
    wx.onSocketOpen(function () {
      console.log('监听到连接开启');
    })
    //监听连接关闭
    wx.onSocketClose(function () {
      console.log('监听到连接关闭')
    })
    //接收服务器消息
    wx.onSocketMessage(function (res) {
      console.log(res, '服务器接收到消息');
      let mes = that.data.message;
      let string = ""
      for (let i = 10; i < res.data.length - 2; i++) {
        string = string + res.data[i];
      }
      let a = string.split(/[,=']+/);
      console.log(111, a);
      let newmes = { 'id': a[1], 'name1': a[3], 'name2': a[5], 'message': a[7], 'msgstatus': a[9], 'time': a[11] };
      console.log(newmes);
      if (a[7] != "onopen调用，连接成功") {
        mes.push(newmes);
        that.setData({ message: mes })
        setTimeout(scrollBottom(), 100)
      }
    })
  },
  // 获取历史消息
  getHistory() {
    let that = this;
    let myname = this.data.user.userid;//本人
    let oppositename = this.data.oppositeuser.oppositeuserid;//对面
    let request = wx.request({
      url: 'https://www.zhiyuankoushao.top/getMessage',
      data: {
        myname: myname,
        name: oppositename,
        page: that.data.page,
        pagesize: that.data.pagenum
      },
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res);
        let message = that.data.message;//历史记录
        for (let i = 0; i < res.data.length; i++) {
          message.unshift(res.data[i]);
        }
        that.setData({ message: message })
      }
    });
  },

  // 滚动到底部
  scrollBottom() {
    let message = this.data.message
    let that = this
    let scrollid = message.length - 1
    let a = "#num" + scrollid
    console.log(a);
    const query = wx.createSelectorQuery()
    query.select(a).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
      let h = res[1].scrollHeight;
      that.setData({ heights: h })
      console.log("设置高度成功", h);
      wx.pageScrollTo({
        scrollTop: h,
        duration: 1000
      })
    })
  },
  // 设置滚动区域的高度
  setScrollHeight() {
    let windowHeights = wx.getSystemInfoSync().windowHeight;
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    let Bodyheight = windowHeights * 750 / windowWidth
    let scrollHeight = (Bodyheight - 150) + 'rpx';//消息页面的高度
    this.setData({ scrollHeight: scrollHeight })
  },

  // 自定义下拉刷新
  onPullDownRefresh() {
    let page = this.data.page + 1
    this.setData({
      page: page
    })
    setTimeout(() => {
      this.getHistory()
      wx.stopPullDownRefresh();
    }, 1000);
  },
  //发送消息
  sendMessage(e) {
    let oppositeuser = this.data.oppositeuser.oppositeuserid
    let myname = this.data.user.userid
    let sendmes = this.data.inputvalue;//发送的消息
    let message = this.data.message
    let that = this
    console.log(sendmes);
    if (sendmes != null) {
      //判断对方是否离线
      wx.request({
        url: 'https://www.zhiyuankoushao.top/getConnectUser',
        success: (res) => {
          let onlineuser = res.data;
          console.log(res, '在线');
          let pan = onlineuser.includes(oppositeuser);//判断用户是否在线
          if (pan == true)//对方在线
          {
            wx.request({
              url: 'https://www.zhiyuankoushao.top/sendmessage',
              data: {
                myname: myname,
                name: oppositeuser,
                message: sendmes,
              },
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: (res) => {
                console.log('在线消息发送成功', res);
                let newmessage = {
                  'message': sendmes, 'time': new Date(), 'msgstatus': 1,
                  'name1': myname,
                  'name2': oppositeuser
                };//新消息
                message.push(newmessage);
                that.setData({
                  message: message,
                  inputvalue: null,
                  showemotion: false,
                })
                that.scrollBottom()
              },
              fail: () => { console.log("在线消息发送失败") },
            })
          }
          if (pan == false) {
            wx.request({
              url: 'https://www.zhiyuankoushao.top/sendofflineMsg',
              data: {
                myname: myname,
                name: oppositeuser,
                message: sendmes,
              },
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: (res) => {
                console.log('离线消息发送成功', res);
                let newmessage = {
                  'message': sendmes, 'time': new Date(), 'msgstatus': 0,
                  'name1': myname,
                  'name2': oppositeuser
                };//新消息
                message.push(newmessage);
                that.setData({
                  message: message,
                  inputvalue: null,
                  showemotion: false,
                })
                that.scrollBottom()
              },
              fail: () => { console.log("离线消息发送失败") },
            })
          }
        },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请输入消息',
        icon: 'error',
        duration: 1000,
      });
    }
  },
  //输入框值改变
  InputMessage(e) {
    this.setData({ inputvalue: e.detail.value, })
  },
  //返回
  onUnload() {
    wx.closeSocket();
    console.log('连接断开');
  },
  fasongtupian(e) {
    let oppositeuser = this.data.oppositeuser.oppositeuserid
    let myname = this.data.user.userid
    let message = this.data.message
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: res => {
        let newmessage = {
          'message': res.tempFiles[0].tempFilePath, 'time': new Date(),
          'name1': myname,
          'name2': oppositeuser
        };
        message.push(newmessage);
        that.setData({
          message: message,
          inputvalue: null,
          showemotion: false,
        })
        that.scrollBottom()
      }
    })

  }
})


