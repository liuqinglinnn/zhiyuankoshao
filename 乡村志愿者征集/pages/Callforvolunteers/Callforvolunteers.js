Page({
  data: {
    openid: "",
    title: null,//活动标题
    startdate: '2022-09-01',//活动开始日期
    starttime: '08:00', //活动开始时间
    enddate: '2022-09-01',//活动结束日期
    endtime: '21:00',//活动结束时间
    mode: ['线下', '线上'],//模式
    index1: 0,
    qiandao: [500, 1000, 2000, 3000, 4000, 5000],//签到范围
    index2: 0,
    classify1: ['困难帮扶', '劳动助农', '⼉童教育', '⽭盾协调', '⽣态助⼒', '⽂明宣传', '其他'],//线下活动类别
    index3: 0,
    classify2: ['海报制作', '线上课堂', '解决方案', '推文制作', '其他'],//线上活动类别
    index4: 0,
    content: null,//活动内容
    teamswitch: true,//小队模式
    checkswitch: true,//审核模式
    teamnum: 1,//小队数量
    teampnum: 0,//小队每队数量
    activitynum: 0,//活动人数
    place: null,//活动地点
    organization: "",//机构
    jinweidu: "",// 经纬度
    addressheight: '75rpx',
    picture: [],//活动图片
  },
  onLoad(options) {
    let that = this
    console.log(that.data.picture, options);
    that.setData({ organization: options.organization })
    //获取openid
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        console.log(res);
        that.setData({ openid: res.data })
        that.Getsavedata()
      },
      fail: () => { },
    })

  },
  ActivityTitle(e) { this.setData({ title: e.detail.value }) },
  StartdateChange(e) { this.setData({ startdate: e.detail.value }) },
  EnddateChange(e) { this.setData({ enddate: e.detail.value }) },
  StartTimeChange(e) { this.setData({ starttime: e.detail.value }) },
  EndTimeChange(e) { this.setData({ endtime: e.detail.value }) },
  ModeChange(e) { this.setData({ index1: e.detail.value }) },
  QiandaoChange(e) { this.setData({ index2: e.detail.value }) },
  Classify1Change(e) { this.setData({ index3: e.detail.value }) },
  Classify2Change(e) { this.setData({ index4: e.detail.value }) },
  ActivityContent(e) { this.setData({ content: e.detail.value }) },
  Teamswitch(e) { this.setData({ teamswitch: e.detail.value }) },
  Checkswitch(e) { this.setData({ checkswitch: e.detail.value }) },
  Teamnum(e) { this.setData({ teamnum: e.detail.value }) },
  Teampnum(e) { this.setData({ teampnum: e.detail.value }) },
  Activitynum(e) { this.setData({ activitynum: e.detail.value }) },
  //选择地点
  Chooseaddress(e) {
    let that = this
    wx.chooseLocation({
      type: 'gcj02',
      success(res) {
        console.log('dizhi', res);
        const latitude = res.latitude
        const longitude = res.longitude
        const name = res.name
        const address = res.address
        let string = address + '-' + name
        let jinweidu = 'latitude' + '-' + latitude + '-' + 'longitude' + '-' + longitude
        that.setData({ place: string, jinweidu: jinweidu, addressheight: '350rpx' })
      }
    })
  },
  //上传图片
  UpLoadPicture(e) {
    let that = this;
    console.log(e);
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: res => {
        console.log(res, '图片链接');
        that.setData({ picture: res.tempFiles })
      }
    })
  },
  //上传活动
  UpLoadActivity(e) {

    let that = this
    let teamswitch = this.data.teamswitch == true ? 0 : 1;
    let checkswitch = this.data.checkswitch == true ? 0 : 1;
    let allnum = 0;
    let teamnum = that.data.teamnum;
    let place = this.data.place + '-' + this.data.jinweidu;
    if (that.data.index1 == 1) { place = '' }
    if (teamswitch == 1) { allnum = this.data.activitynum; teamnum = 1; }
    else { allnum = this.data.teamnum * this.data.teampnum; }
    let classify = this.data.index1 == 0 ? this.data.classify1[this.data.index3] : this.data.classify2[this.data.index4]

    if (allnum != 0) {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/postActivity',
        // url: 'http://106.13.204.79:8080/postActivity?head=' + that.data.title + '&place=' + place + '&starttime=' + that.data.startdate + '-' + that.data.starttime + '&endtime=' + that.data.enddate + '-' + that.data.endtime + '&sponsor=' + that.data.openid + '&mode=' + that.data.mode[that.data.index1] + '&numofmate=' + that.data.teamnum + '&mechanism=' + '福州市政f' + '&content=' + that.data.content + '&allnum=' + allnum + '&classify1=' + classify + '&teamswitch=' + teamswitch + '&checkswitch=' + checkswitch + '&qiandao=' + that.data.qiandao[that.data.index2],
        data: {
          head: that.data.title,
          starttime: that.data.startdate + ' ' + that.data.starttime,
          endtime: that.data.enddate + ' ' + that.data.endtime,
          mode: that.data.mode[that.data.index1],
          sponsor: that.data.openid,
          teamswitch: teamswitch,
          checkswitch: checkswitch,
          mechanism: that.data.organization,
          content: that.data.content,
          numofmate: teamnum,
          qiandao: that.data.qiandao[that.data.index2],
          classify1: classify,
          allnum: allnum,
          place: place,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: (res) => {
          console.log(res);
          let picture = that.data.picture
          if (res.data.error != "发布失败，请重新尝试") {
            let i;
            wx.uploadFile({
              filePath: picture[0].tempFilePath,
              name: 'file',
              formData: { 'id': res.data.id + '-0' },
              url: 'https://www.zhiyuankoushao.top/uploadactivitypic',
              success: res => {
                console.log(res, "上传图片成功");
              },
              fail: () => { },
            })
            wx.uploadFile({
              filePath: picture[1].tempFilePath,
              name: 'file',
              formData: { 'id': res.data.id + '-1' },
              url: 'https://www.zhiyuankoushao.top/uploadactivitypic',
              success: res => {
                console.log(res, "上传图片成功");
              },
              fail: () => { },
            })
            wx.uploadFile({
              filePath: picture[2].tempFilePath,
              name: 'file',
              formData: { 'id': res.data.id + '-2' },
              url: 'https://www.zhiyuankoushao.top/uploadactivitypic',
              success: res => {
                console.log(res, "上传图片成功");
              },
              fail: () => { },
            })
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2500,
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 2000);

          }
          else {
            wx.showToast({
              title: '发布失败',
              icon: 'error',
              duration: 2500,
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '发布失败',
            icon: 'error',
            duration: 2500,
          });
        },
      });
    }
    else {
      wx.showToast({
        title: '请输入活动人数',
        icon: 'error',
        duration: 2500,
      });
    }

  },
  //保存记录
  Savedata(e) {
    let a = ['title', 'startdate', 'starttime', 'enddate', 'enddate', 'endtime', 'index1', 'index2', 'index3', 'index4'
      , 'content', 'teamswitch', 'checkswitch', 'teamnum', 'teampnum', 'activitynum', 'place', 'jinweidu'
      , 'addressheight']
    let b = [this.data.title, this.data.startdate, this.data.starttime, this.data.enddate, this.data.enddate, this.data.endtime, this.data.index1, this.data.index2, this.data.index3, this.data.index4
      , this.data.content, this.data.teamswitch, this.data.checkswitch, this.data.teamnum, this.data.teampnum, this.data.activitynum, this.data.place, this.data.jinweidu
      , this.data.addressheight]
    for (let i = 0; i < a.length; i++) {
      wx.setStorage({
        key: a[i],
        data: b[i]
      })
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500,
    });
  },
  //获取保存记录
  Getsavedata(e) {
    let that = this;
    let a = ['title', 'startdate', 'starttime', 'enddate', 'enddate', 'endtime', 'index1', 'index2', 'index3', 'index4'
      , 'content', 'teamswitch', 'checkswitch', 'teamnum', 'teampnum', 'activitynum', 'place', 'jinweidu'
      , 'addressheight']
    for (let i = 0; i < a.length; i++) {
      wx.getStorage({
        key: a[i],
        success(res) {
          let b = a[i];
          that.setData({ [b]: res.data })
        },
        fail() { }
      })
    }

  }
})