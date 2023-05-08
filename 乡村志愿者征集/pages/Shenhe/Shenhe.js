// //Page Object
// Page({
//   data: {
//     url: "",
//   },
//   //options(Object)
//   onLoad: function (options) {

//     let that = this
//     wx.chooseImage({
//       count: 1,
//       sizeType: ['original', 'compressed'],
//       sourceType: ['album', 'camera'],
//       success: (res) => {
//         console.log(res);
//         wx.uploadFile({
//           filePath: res.tempFilePaths[0],
//           name: 'file',
//           formData: { 'id': '100000' },//shouye1004//
//           url: 'https://www.zhiyuankoushao.top/uploadactivitypic',
//           success: res => {
//             console.log(res, "上传图片成功");
//           },
//           fail: () => { },
//         })
//       },
//       fail: () => { },
//       complete: () => { }
//     });

//   },
//   UpLoadPicture(e) {
//     wx.requestSubscribeMessage({
//       tmplIds: ['Mq-b6Yz5H76RViYPsfqP5v13biMu5I5FM6FoCM4B_Hw'],
//       success(res) { console.log(res); }
//     })
//   }


// });

Page({
  data: {

  },
  //options(Object)
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});