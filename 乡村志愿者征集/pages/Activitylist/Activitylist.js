Page({
  data: {
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
  },
  onLoad(options) {

  },
  onShow() {
    let that = this
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
      url: 'https://www.zhiyuankoushao.top/getAllactivity',
      data: {
        page: this.data.page,
        pagesize: this.data.pagesize,
      },
      method: 'GET',
      success: (res) => {
        console.log('huodongliebiea', res);
        that.setData({ activity: res.data })
        let p = 0
        for (let i = 0; i < res.data.length; i++) {
          let arr = [];
          wx.request({
            url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
            data: { id: res.data[i].id + '-1' },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              console.log(res, 'picture', res.data.url);
              let pic = 'activity[' + i + '].picture';
              arr.push(res.data.url)
              that.setData({ [pic]: arr })
            },
            fail: () => { },
            complete: () => { }
          });
          let act = 'activity[' + i + '].place';
          let act2 = 'activity[' + i + '].placeactually';
          let la = 'markers[' + i + '].latitude'
          let lo = 'markers[' + i + '].longitude'
          let ic = 'markers[' + i + '].iconPath'
          let width = 'markers[' + i + '].width'
          let height = 'markers[' + i + '].height'
          let idx = 'markers[' + i + '].id'
          let request = wx.request({
            url: 'https://www.zhiyuankoushao.top/checkAllAsign',
            data: { activityid: res.data[i].id },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
              let ap = 'activity[' + p + '].asginnum'
              console.log(result);
              that.setData({
                [ap]: result.data.asginNumber
              })
              p = p + 1
            },
            fail: () => { },
            complete: () => { }
          });
          if (res.data[i].mode == "线下") {
            console.log('xianxhuodong+1');
            let a = res.data[i].place.split(/[-]+/);
            console.log(111, a);
            let string = a[0] + a[1];
            let string2
            if (string.length > 12) {
              string2 = "";
              for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
              string2 = string2 + '...';
              console.log(string2);
            }
            let latitude = parseFloat(a[3])
            let longitude = parseFloat(a[5])
            console.log(latitude, longitude, 'list近卫笃');
            that.setData({ [act2]: string, [act]: string2, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data[i].id })
          }
          if (res.data[i].mode == "线上") {
            console.log('xianshanghuodong+1');
            that.setData({ [act2]: '线上', [act]: '线上', [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data[i].id })
          }
        }
      },
      fail: () => { },
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
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let idx = { id: id }
    let size = this.data.activity.findIndex(item => item.id === idx.id);
    wx.navigateTo({
      url: '../Activitydetail/Activitydetail?id=' + this.data.activity[size].id,
      success: (res) => { },
      fail: () => { },
    });
  },
  inputevent(e) {
    console.log(e);
    this.setData({ inputvalue: e.detail.value })
    let that = this
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getActivityByHead?head=' + e.detail.value,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res);
        let arr = [];
        if (res.data.length == 0) {
          console.log('哈哈哈哈');
          that.setData({ activity: arr })
        }
        let actarr = res.data
        for (let i = 0; i < res.data.length; i++) {
          wx.request({
            url: 'https://www.zhiyuankoushao.top/getactivityByid',
            data: { id: res.data[i].id },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              let temp = res.data;
              let la = 'markers[' + i + '].latitude'
              let lo = 'markers[' + i + '].longitude'
              let ic = 'markers[' + i + '].iconPath'
              let width = 'markers[' + i + '].width'
              let height = 'markers[' + i + '].height'
              let idx = 'markers[' + i + '].id'
              if (res.data.mode == "线下") {
                console.log('xianxhuodong+1');
                let a = res.data.place.split(/[-]+/);
                console.log(111, a);
                let string = a[0] + a[1];
                let string2
                if (string.length > 12) {
                  string2 = "";
                  for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
                  string2 = string2 + '...';
                  console.log(string2);
                }
                let latitude = parseFloat(a[3])
                let longitude = parseFloat(a[5])
                console.log(latitude, longitude, 'list近卫笃');
                temp.place = string2;
                temp.placeactually = string;
                arr.push(temp);
                console.log(arr);
                that.setData({
                  activity: arr, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data.id
                })
              }
              if (res.data.mode == "线上") {
                console.log('xianshanghuodong+1');
                temp.place = '线上';
                temp.placeactually = '线上';
                arr.push(temp);
                that.setData({ activity: arr, [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data.id })
              }
              let arrp = [];
              wx.request({
                url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
                data: { id: actarr[i].id + '-1' },
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
              wx.request({
                url: 'https://www.zhiyuankoushao.top/checkAllAsign',
                data: { activityid: actarr[i].id },
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
            }
          });

        }
      },
      fail: () => { },
      complete: () => { }
    });
  },
  cancelsearch(e) {
    let that = this
    this.setData({ inputvalue: "" })
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getAllactivity',
      data: {
        page: this.data.page,
        pagesize: this.data.pagesize,
      },
      method: 'GET',
      success: (res) => {
        console.log(res);
        that.setData({ activity: res.data })
        for (let i = 0; i < res.data.length; i++) {
          let arr = [];
          wx.request({
            url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
            data: { id: res.data[i].id + '-1' },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              console.log(res, 'picture', res.data.url);
              let pic = 'activity[' + i + '].picture';
              arr.push(res.data.url)
              that.setData({ [pic]: arr })
            },
            fail: () => { },
            complete: () => { }
          });
          wx.request({
            url: 'https://www.zhiyuankoushao.top/checkAllAsign',
            data: { activityid: res.data[i].id },
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
          let act = 'activity[' + i + '].place';
          let act2 = 'activity[' + i + '].placeactually';
          let la = 'markers[' + i + '].latitude'
          let lo = 'markers[' + i + '].longitude'
          let ic = 'markers[' + i + '].iconPath'
          let width = 'markers[' + i + '].width'
          let height = 'markers[' + i + '].height'
          let idx = 'markers[' + i + '].id'

          if (res.data[i].mode == "线下") {
            console.log('xianxhuodong+1');
            let a = res.data[i].place.split(/[-]+/);
            console.log(111, a);
            let string = a[0] + a[1];
            let string2
            if (string.length > 12) {
              string2 = "";
              for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
              string2 = string2 + '...';
              console.log(string2);
            }
            let latitude = parseFloat(a[3])
            let longitude = parseFloat(a[5])
            console.log(latitude, longitude, 'list近卫笃');
            that.setData({ [act2]: string, [act]: string2, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data[i].id })
          }
          if (res.data[i].mode == "线上") {
            console.log('xianshanghuodong+1');
            that.setData({ [act2]: '线上', [act]: '线上', [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data[i].id })
          }
        }
      },
      fail: () => { },
    });
  },
  showmap(e) {
    this.setData({ showmap: this.data.showmap + 1 })
  },
  classifychange(e) {
    let that = this;
    let n = e.currentTarget.dataset.num
    if (this.data.classfiyswitch == n) { this.setData({ classfiyswitch: 0 }) }
    else { this.setData({ classfiyswitch: n }) }
    if (n == 1) {
      wx.choosePoi({
        success: (res) => {
          console.log(res, '选择成功');
          if (res.city != "") {
            that.setData({ classifyaddress: res.address })
            wx.request({
              url: 'https://www.zhiyuankoushao.top/getorderactivity?latitude=' + this.data.latitude + '&longtitude=' + this.data.longitude + '&range=' + res.city + '&page=' + 0 + '&limit=' + 100 + '&classify=no',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                console.log(res);
                let arr = [];
                if (res.data.length == 0) {
                  console.log('哈哈哈哈');
                  that.setData({ activity: arr })

                }
                let actarr = res.data
                for (let i = 0; i < res.data.length; i++) {
                  wx.request({
                    url: 'https://www.zhiyuankoushao.top/getactivityByid',
                    data: { id: res.data[i].id },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (res) => {
                      let temp = res.data;
                      let la = 'markers[' + i + '].latitude'
                      let lo = 'markers[' + i + '].longitude'
                      let ic = 'markers[' + i + '].iconPath'
                      let width = 'markers[' + i + '].width'
                      let height = 'markers[' + i + '].height'
                      let idx = 'markers[' + i + '].id'

                      if (res.data.mode == "线下") {
                        console.log('xianxhuodong+1');
                        let a = res.data.place.split(/[-]+/);
                        console.log(111, a);
                        let string = a[0] + a[1];
                        let string2
                        if (string.length > 12) {
                          string2 = "";
                          for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
                          string2 = string2 + '...';
                          console.log(string2);
                        }
                        let latitude = parseFloat(a[3])
                        let longitude = parseFloat(a[5])
                        console.log(latitude, longitude, 'list近卫笃');
                        temp.place = string2;
                        temp.placeactually = string;
                        arr.push(temp);
                        console.log(arr);
                        that.setData({
                          activity: arr, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data.id
                        })
                      }
                      if (res.data.mode == "线上") {
                        console.log('xianshanghuodong+1');
                        temp.place = '线上';
                        temp.placeactually = '线上';
                        arr.push(temp);
                        that.setData({ activity: arr, [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data.id })
                      }
                      let arrp = [];
                      wx.request({
                        url: 'https://www.zhiyuankoushao.top/checkAllAsign',
                        data: { activityid: actarr[i].id },
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
                        data: { id: actarr[i].id + '-1' },
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
                    }
                  });

                }
              },
              fail: () => { },
              complete: () => { }
            });

          }
          if (res.address != "") {
            that.setData({ classifyaddress: res.address })
            wx.request({
              url: 'https://www.zhiyuankoushao.top/getorderactivity?latitude=' + this.data.latitude + '&longtitude=' + this.data.longitude + '&range=' + res.address + '&page=' + 0 + '&limit=' + 100 + '&classify=no',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                console.log(res);
                let arr = [];
                if (res.data.length == 0) {
                  console.log('哈哈哈哈');
                  that.setData({ activity: arr })

                }
                let actarr = res.data
                for (let i = 0; i < res.data.length; i++) {
                  wx.request({
                    url: 'https://www.zhiyuankoushao.top/getactivityByid',
                    data: { id: res.data[i].id },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (res) => {
                      let temp = res.data;
                      let la = 'markers[' + i + '].latitude'
                      let lo = 'markers[' + i + '].longitude'
                      let ic = 'markers[' + i + '].iconPath'
                      let width = 'markers[' + i + '].width'
                      let height = 'markers[' + i + '].height'
                      let idx = 'markers[' + i + '].id'

                      if (res.data.mode == "线下") {
                        console.log('xianxhuodong+1');
                        let a = res.data.place.split(/[-]+/);
                        console.log(111, a);
                        let string = a[0] + a[1];
                        let string2
                        if (string.length > 12) {
                          string2 = "";
                          for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
                          string2 = string2 + '...';
                          console.log(string2);
                        }
                        let latitude = parseFloat(a[3])
                        let longitude = parseFloat(a[5])
                        console.log(latitude, longitude, 'list近卫笃');
                        temp.place = string2;
                        temp.placeactually = string;
                        arr.push(temp);
                        console.log(arr);
                        that.setData({
                          activity: arr, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data.id
                        })
                      }
                      if (res.data.mode == "线上") {
                        console.log('xianshanghuodong+1');
                        temp.place = '线上';
                        temp.placeactually = '线上';
                        arr.push(temp);
                        that.setData({ activity: arr, [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data.id })
                      }
                      let arrp = [];
                      wx.request({
                        url: 'https://www.zhiyuankoushao.top/checkAllAsign',
                        data: { activityid: actarr[i].id },
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
                        data: { id: actarr[i].id + '-1' },
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
                    }
                  });

                }
              },
              fail: () => { },
              complete: () => { }
            });
          }

        },
      });
    }
  },
  //条件筛选
  shaixuan(e) {
    let that = this
    console.log(e);
    let tiaojian = e.currentTarget.dataset.classify
    console.log(tiaojian);
    if (tiaojian != '即将开始' && tiaojian != '距离最近') {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/getorderactivity?latitude=' + that.data.latitude + '&longtitude=' + that.data.longitude + '&range=' + "" + '&page=' + 0 + '&limit=' + 100 + '&classify=' + tiaojian,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          console.log(res);
          let arr = [];
          if (res.data.length == 0) {
            console.log('哈哈哈哈');
            that.setData({ activity: arr })
          }
          let actarr = res.data
          for (let i = 0; i < res.data.length; i++) {
            wx.request({
              url: 'https://www.zhiyuankoushao.top/getactivityByid',
              data: { id: res.data[i].id },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                let temp = res.data;
                let la = 'markers[' + i + '].latitude'
                let lo = 'markers[' + i + '].longitude'
                let ic = 'markers[' + i + '].iconPath'
                let width = 'markers[' + i + '].width'
                let height = 'markers[' + i + '].height'
                let idx = 'markers[' + i + '].id'
                if (res.data.mode == "线下") {
                  console.log('xianxhuodong+1');
                  let a = res.data.place.split(/[-]+/);
                  console.log(111, a);
                  let string = a[0] + a[1];
                  let string2
                  if (string.length > 12) {
                    string2 = "";
                    for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
                    string2 = string2 + '...';
                    console.log(string2);
                  }
                  let latitude = parseFloat(a[3])
                  let longitude = parseFloat(a[5])
                  console.log(latitude, longitude, 'list近卫笃');
                  temp.place = string2;
                  temp.placeactually = string;
                  arr.push(temp);
                  console.log(arr);
                  that.setData({
                    activity: arr, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data.id
                  })
                }
                if (res.data.mode == "线上") {
                  console.log('xianshanghuodong+1');
                  temp.place = '线上';
                  temp.placeactually = '线上';
                  arr.push(temp);
                  that.setData({ activity: arr, [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data.id })
                }
                let arrp = [];
                wx.request({
                  url: 'https://www.zhiyuankoushao.top/checkAllAsign',
                  data: { activityid: actarr[i].id },
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
                  data: { id: actarr[i].id + '-1' },
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
              }
            });

          }
        },
        fail: () => { },
        complete: () => { }
      });
    }
    if (tiaojian == '即将开始') { that.cancelsearch() }
    if (tiaojian == '距离最近') {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/getorderactivity?latitude=' + that.data.latitude + '&longtitude=' + that.data.longitude + '&range=' + "福州" + '&page=' + 0 + '&limit=' + 100 + '&classify=no',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          console.log(res);
          let arr = [];
          if (res.data.length == 0) {
            console.log('哈哈哈哈');
            that.setData({ activity: arr })
          }
          let actarr = res.data
          for (let i = 0; i < res.data.length; i++) {
            wx.request({
              url: 'https://www.zhiyuankoushao.top/getactivityByid',
              data: { id: res.data[i].id },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                let temp = res.data;
                let la = 'markers[' + i + '].latitude'
                let lo = 'markers[' + i + '].longitude'
                let ic = 'markers[' + i + '].iconPath'
                let width = 'markers[' + i + '].width'
                let height = 'markers[' + i + '].height'
                let idx = 'markers[' + i + '].id'
                if (res.data.mode == "线下") {
                  console.log('xianxhuodong+1');
                  let a = res.data.place.split(/[-]+/);
                  console.log(111, a);
                  let string = a[0] + a[1];
                  let string2
                  if (string.length > 12) {
                    string2 = "";
                    for (let k = 0; k < 12; k++) { string2 = string2 + string[k] }
                    string2 = string2 + '...';
                    console.log(string2);
                  }
                  let latitude = parseFloat(a[3])
                  let longitude = parseFloat(a[5])
                  console.log(latitude, longitude, 'list近卫笃');
                  temp.place = string2;
                  temp.placeactually = string;
                  arr.push(temp);
                  console.log(arr);
                  that.setData({
                    activity: arr, [la]: latitude, [lo]: longitude, [ic]: '/icon/flag.png', [width]: 20, [height]: 20, [idx]: res.data.id
                  })
                }
                if (res.data.mode == "线上") {
                  console.log('xianshanghuodong+1');
                  temp.place = '线上';
                  temp.placeactually = '线上';
                  arr.push(temp);
                  that.setData({ activity: arr, [la]: null, [lo]: null, [ic]: null, [width]: null, [height]: null, [idx]: res.data.id })
                }
                let arrp = [];
                wx.request({
                  url: 'https://www.zhiyuankoushao.top/checkAllAsign',
                  data: { activityid: actarr[i].id },
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
                  data: { id: actarr[i].id + '-1' },
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
              }
            });

          }
        },
        fail: () => { },
        complete: () => { }
      });
    }
  },
  markertap(e) {
    console.log(e, '标记点');
    let markid = e.detail.markerId
    wx.navigateTo({
      url: '../Activitydetail/Activitydetail?id=' + markid,
      success: (res) => { },
      fail: () => { },
    });
  }

})





