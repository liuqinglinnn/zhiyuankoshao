const app = getApp()
Page({
  data: {
    user: { username: "", userpicture: "", userid: "" },//用户本人
    oppositeuser: { oppositeusername: "lql", oppositeuserid: "ceshi" },//对话用户
    src: ["https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKyR0dB1kpACIRQlBCcHOQo5aibAn2HuhTh62woiaQfF3rrHuXRTywyCIm0eqkVgJZw7HWu0ibFFJ56w/132", "/icon/arrow-up.png",],
    message: [],//消息记录
    // { message: '大家都到了吗，来的扣下1', name1: 'ceshi', name2: '', }, { message: '111队长我到了', name1: 'ceshi', name2: '', }
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
    let that = this;
    // 获取用户信息
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ 'user.userid': res.data })
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

      },
      fail: () => { },
      complete: () => { }
    })
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
  //发送消息
  sendMessage(e) {
    let oppositeuser = this.data.oppositeuser.oppositeuserid
    let myname = this.data.user.userid
    let sendmes = this.data.inputvalue
    let message = this.data.message
    let that = this
    console.log(sendmes);
    if (sendmes != null) {
      console.log('消息发送成功');
      let newmessage = {
        'message': sendmes, 'time': new Date(),
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
