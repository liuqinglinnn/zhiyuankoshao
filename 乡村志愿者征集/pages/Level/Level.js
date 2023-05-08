Page({
  data: {
    levarr: [{ level: 1, tiaojian: 0, rate: 1.00, src: "/icon/LOGO/one.png", src2: "/icon/LV1.png" }, { level: 2, tiaojian: 30, rate: 1.05, src: "/icon/LOGO/two.png", src2: "/icon/LV2.png" }, { level: 3, tiaojian: 50, rate: 1.10, src: "/icon/LOGO/three.png", src2: "/icon/LV3.png" }, { level: 4, tiaojian: 120, rate: 1.15, src: "/icon/LOGO/four.jpg", src2: "/icon/LV4.png" }, { level: 5, tiaojian: 300, rate: 1.25, src: "/icon/LOGO/five.jpg", src2: "/icon/LV5.png" }],
    currentSwiperIndex: 0,
    dots: false,
  },
  onLoad(options) {

  },
  //轮播图改变事件
  swiperBindchange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  },
})