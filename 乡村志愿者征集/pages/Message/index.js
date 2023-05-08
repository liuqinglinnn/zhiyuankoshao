Page({
  data: {
    user: { username: "", userpicture: "", userid: "" },//用户本人
    allcharuser: []
  },
  onPullDownRefresh() {
    let that = this;
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        that.setData({ 'user.userid': res.data })
        let userid = res.data
        wx.request({
          url: 'https://www.zhiyuankoushao.top/getAllChatWithMe',
          data: { openid: userid },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            console.log(res);
            let allid = res.data.allOpenid
            let j = 0
            let l = 0
            let mesi = 0
            for (let i = 0; i < allid.length; i++) {
              if (allid[i].name2 != undefined && allid[i].name2 != userid) {
                let a = 'allcharuser[' + j + '].oid'
                that.setData({ [a]: allid[i].name2 })
                wx.request({
                  url: 'https://www.zhiyuankoushao.top/getunreadmessage',
                  data: { openid: allid[i].name2 },
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  method: 'GET',
                  dataType: 'json',
                  success: (res) => {
                    console.log(res, '未读', j);
                    let num = 'allcharuser[' + j + '].unreadnum'
                    if (res.data.unreadmessage != undefined) {
                      let weidunum = 0;
                      for (let g = 0; g < res.data.unreadmessage.length; g++) {
                        if (res.data.unreadmessage[g].name2 == userid) { weidunum++; }
                      }
                      that.setData({ [num]: weidunum })
                    }
                    else { that.setData({ [num]: 0 }) }
                  },
                  fail: () => { },
                });
                wx.request({
                  url: 'https://www.zhiyuankoushao.top/getUserInfo',
                  data: { openid: allid[i].name2 },
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  method: 'GET',
                  dataType: 'json',
                  responseType: 'text',
                  success: (res) => {
                    console.log(res, l, "touxiang");
                    let name = 'allcharuser[' + j + '].name'
                    let pic = 'allcharuser[' + j + '].picture'
                    that.setData({ [name]: res.data.nickname, [pic]: res.data.headpic })
                  },
                  fail: () => { },
                  complete: () => { }
                });
                wx.request({
                  url: 'https://www.zhiyuankoushao.top/getMessage',
                  data: {
                    myname: userid,
                    name: allid[i].name2,
                    page: 0,
                    pagesize: 1
                  },
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  method: 'GET',
                  dataType: 'json',
                  responseType: 'text',
                  success: (res) => {
                    console.log(res, 'xiaoxi');
                    let time = "";
                    for (let m = 11; m < 16; m++) { time = time + res.data[0].time[m] }
                    let c = 'allcharuser[' + j + '].content'
                    let t = 'allcharuser[' + j + '].time'
                    that.setData({ [c]: res.data[0].message, [t]: time, })
                  },
                  fail: () => { },
                  complete: () => { },
                });
              }
            }
          },
          fail: () => { },
          complete: () => { console.log(that.data.allcharuser, 33); }
        });
      },
      fail: (err) => { },
      complete: () => { }
    })
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onLoad() {

  },
  onShow() {
    this.onPullDownRefresh();
  },
  chat(e) {
    console.log(e);
    let username = e.currentTarget.dataset.username;
    wx.navigateTo({
      url: '../Chat/Chat?oppositename=' + username,
      success: (res) => { },
      fail: () => { },
      complete: () => { }
    });
  },
})