Page({
  data: {
    openid: "",
    page: 0,//活动分页查询第几页    
    pagesize: 100,//活动分页查询每页需要多少个
    longitude: 0, //经度
    latitude: 0, //纬度
    inputvalue: "",
    showmap: 2,
    activity: [],//活动列表
    markers: [],//标志
    classfiyswitch: 0,//分类开关
    classify2: ['困难帮扶', '劳动助农', '⼉童教育', '⽭盾协调', '⽣态助⼒', '⽂明宣传', '海报制作', '线上课堂', '解决方案', '推文制作', '其他',],
    index2: -1,
    classify3: ['即将开始', '距离最近'],
    index3: -1,
    classifyaddress: "",
    polyline: [{
      points: [],
      color: "#FA6400",//线条的颜色
      width: 10,//宽度
      arrowLine: true,//是否带箭头
      borderWidth: 2//线的边框宽度，还有很多参数，请看文档 
    }]

  },
  onLoad(options) {
    let that = this
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ openid: res.data })
        wx.getLocation({
          type: "gcj02",
          success: function (res) {
            console.log("当前位置的经纬度为：", res.latitude, res.longitude, res);
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
            })
          }
        })
        wx.request({
          url: 'https://www.zhiyuankoushao.top/getMyactivity',
          data: {
            openid: res.data
          },
          method: 'GET',
          success: (res) => {
            console.log(res);
            let arrlist = res.data.list
            that.setData({ activity: arrlist })
            for (let i = 0; i < arrlist.length; i++) {
              wx.request({
                url: 'https://www.zhiyuankoushao.top/getactivityByid',
                data: { id: arrlist[i].activityid },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                  console.log(res, '根据id获取活动');
                  let acti = res.data;
                  let actli = 'activity[' + i + ']';
                  let la = 'markers[' + i + '].latitude'
                  let lo = 'markers[' + i + '].longitude'
                  let ic = 'markers[' + i + '].iconPath'
                  let width = 'markers[' + i + '].width'
                  let height = 'markers[' + i + '].height'
                  let idx = 'markers[' + i + '].id'
                  if (acti.mode == "线下") {
                    let a = acti.place.split(/[-]+/);
                    let string = a[0] + a[1];
                    let string2
                    if (string.length > 12) {
                      string2 = "";
                      for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
                      string2 = string2 + '...';
                      console.log(string2);
                    }
                    acti.placeactually = string;
                    acti.place = string2;
                    that.setData({ [actli]: acti })
                    let latitude = parseFloat(a[3])
                    let longitude = parseFloat(a[5])
                    console.log(latitude, longitude, 'list近卫笃');
                    that.setData({ [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data.id })
                  }
                  if (acti.mode == "线上") {
                    acti.placeactually = '线上';
                    acti.place = '线上';
                    that.setData({ [actli]: acti })
                    that.setData({ [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data.id })
                  }
                  let arrp = [];
                  wx.request({
                    url: 'https://www.zhiyuankoushao.top/checkAllAsign',
                    data: { activityid: arrlist[i].id },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (result) => {
                      let ap = 'activity[' + i + '].asginnum'
                      console.log(result);
                      that.setData({
                        [ap]: result.data.asginNumber
                      })
                    },
                    fail: () => { },
                    complete: () => { }
                  });
                  wx.request({
                    url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
                    data: { id: arrlist[i].id + '-1' },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (res) => {
                      console.log(res, 'picture', res.data.url);
                      let pic = 'activity[' + i + '].picture';
                      arrp.push(res.data.url)
                      that.setData({ [pic]: arrp })
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
        });
      },
      fail: () => { },
      complete: () => { }
    });
  },
  //地图放大缩小事件触发
  bindregionchange(e) {
    console.log('=bindregiοnchange=', e)
    console.log(this.data.markers);
  },
  //点击地图事件，有经纬度信息返回
  bindtapMap(e) {
    console.log('=bindtapMap=', e)
  },
  showdetail(e) {
    //签到事件
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let idx = { id: id }
    let size = this.data.activity.findIndex(item => item.id === idx.id);
    wx.navigateTo({
      url: '../Qiandao/Qiandao?id=' + this.data.activity[size].id,
      success: (res) => { },
      fail: () => { },
    });
  },
  showmap(e) {
    this.setData({ showmap: this.data.showmap + 1 })
  },
  markertap(e) {
    console.log(e, '标记点');
    let markid = e.detail.markerId
    this.openMap(markid)
  },
  openMap(idxx) {
    let idx = { id: idxx }
    let size = this.data.activity.findIndex(item => item.id === idx.id);
    let name = this.data.activity[size].placeactually.split(/[-]+/);
    console.log();
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res.latitude);
        console.log(res.longitude);
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 28, // 缩放比例
          name: name[0],
          address: name[0]
        })
      }
    })
  }

})





