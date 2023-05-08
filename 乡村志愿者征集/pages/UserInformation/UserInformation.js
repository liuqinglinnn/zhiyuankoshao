Page({
  data: {
    openid: "",
    userpicture: "",//头像url
    username: "",//昵称
    PoliticsStatusArray: ['群众', '共青团员', '中共预备党员', '中共党员'],//政治面貌
    index1: 0,
    EducationArray: ['小学', '初中', '高中', '大专', '大学本科', '研究生'],//学历
    index2: 0,
    GenderArray: ['女', '男'],//性别
    index3: 0,
    Birthdate: "2001-01-01",//生日
    Address: ['广东省', '广州市', '海珠区'],//活动地点
    Name: "",//姓名
    Age: 18,//年龄
    DetailAddress: "",//详细地址
    Telephone: "",//⼿机号码
    Email: "",//邮箱地址
    Profession: "",//职业
    WorkPlace: "",//学校或⼯作单位
    IDcard: "",//身份证
    Submitswitch: true,//上传按钮
    picture: "",
    shouquan: false
  },
  onLoad(options) {
    let that = this
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getactivitipicurl',
      data: { id: '1000002' },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res, '这是图片');
        that.setData({ picture: res.data.url })
      },
    });
    this.setData({ openid: options.openid })
    wx.getStorage({
      key: 'username',
      success: (res) => {
        this.setData({ username: res.data })
      },
      fail: () => { },
    });
    wx.getStorage({
      key: 'userpicture',
      success: (res) => {
        this.setData({ userpicture: res.data })
      },
      fail: () => { },
    });
  },
  onReady() {
    this.ShowUser()
  },
  //用户信息显示
  ShowUser() {
    let that = this
    wx.request({
      url: 'https://www.zhiyuankoushao.top/getUserInfo',
      data: { openid: that.data.openid },
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res, "获取个人信息成功");
        let a = res.data.address.split(/[-]+/);
        console.log(res.data.address, 222, a);
        //如果以及填写渲染已填写信息
        if (res.data == "") { that.setData({ Submitswitch: true }) }
        else {
          that.setData({
            index3: res.data.sex,
            Birthdate: res.data.birth,
            Name: res.data.realname,
            Telephone: res.data.phonenum,
            Email: res.data.mail,
            Profession: res.data.work,
            IDcard: res.data.id,
            Age: res.data.age,
            'Address[0]': a[0],
            'Address[1]': a[1],
            'Address[2]': a[2],
            DetailAddress: a[3]
          })
          if (res.data.poutlook == '群众') { that.setData({ index1: 0 }) }
          if (res.data.poutlook == '共青团员') { that.setData({ index1: 1 }) }
          if (res.data.poutlook == '中共预备党员') { that.setData({ index1: 2 }) }
          if (res.data.poutlook == '中共党员') { that.setData({ index1: 3 }) }
          if (res.data.highgrade == '小学') { that.setData({ index2: 0 }) }
          if (res.data.highgrade == '初中') { that.setData({ index2: 1 }) }
          if (res.data.highgrade == '高中') { that.setData({ index2: 2 }) }
          if (res.data.highgrade == '大专') { that.setData({ index2: 3 }) }
          if (res.data.highgrade == '大学本科') { that.setData({ index2: 4 }) }
          if (res.data.highgrade == '研究生') { that.setData({ index2: 5 }) }
        }
      },
      fail: () => { console.log("获取个人信息失败"); },
    });
  },
  PoliticsStatusChange: function (e) { this.setData({ index1: e.detail.value }) },
  EducationChange: function (e) { this.setData({ index2: e.detail.value }) },
  GenderChange: function (e) { this.setData({ index3: e.detail.value }) },
  BirthdateChange(e) { this.setData({ Birthdate: e.detail.value }) },
  AddressChange(e) { this.setData({ Address: e.detail.value }) },
  //输入框值
  InputValue(e) {
    console.log(e);
    let classify = e.currentTarget.dataset.data
    if (classify == "Name") { this.setData({ Name: e.detail.value }) }
    if (classify == "DetailAddress") { this.setData({ DetailAddress: e.detail.value }) }
    if (classify == "Telephone") { this.setData({ Telephone: e.detail.value }) }
    if (classify == "Email") { this.setData({ Email: e.detail.value }) }
    if (classify == "Profession") { this.setData({ Profession: e.detail.value }) }
    if (classify == "WorkPlace") { this.setData({ WorkPlace: e.detail.value }) }
    if (classify == "IDcard") { this.setData({ IDcard: e.detail.value }) }
    if (classify == "Age") { this.setData({ Age: e.detail.value }) }

  },
  //上传
  Submit(e) {
    let that = this
    if (that.data.shouquan == true) {
      wx.request({
        url: 'https://www.zhiyuankoushao.top/updateUserInfo',
        data: {
          openid: this.data.openid,
          realname: this.data.Name,
          sex: this.data.index3,
          birth: this.data.Birthdate,
          headpic: this.data.userpicture,
          nickname: this.data.username,
          age: this.data.Age,
          poutlook: this.data.PoliticsStatusArray[this.data.index1],
          phonenum: this.data.Telephone,
          mail: this.data.Email,
          work: this.data.Profession,
          highgrade: this.data.EducationArray[this.data.index2],
          address: this.data.Address[0] + '-' + this.data.Address[1] + '-' + this.data.Address[2] + '-' + this.data.DetailAddress,
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          console.log(res);
          wx.showToast({
            title: '成功修改名片',
            icon: 'success',
            duration: 2500,
          });
          wx.setStorage({
            key: 'realname',
            data: that.data.Name,
            success: (res) => {

            },
            fail: () => { },
            complete: () => { }
          });
        },
        fail: () => { },
      });
    }
    else {
      wx.showToast({
        title: '请先阅读并同意用户服务协议及隐私政策',
        icon: 'none',
        duration: 2500,
      });
    }

  },
  Updata(e) {
    let that = this

    wx.request({
      url: 'https://www.zhiyuankoushao.top/updateUserInfo',
      data: {
        openid: this.data.openid,
        realname: this.data.Name,
        sex: this.data.index3,
        birth: this.data.Birthdate,
        headpic: this.data.userpicture,
        nickname: this.data.username,
        age: this.data.Age,
        poutlook: this.data.PoliticsStatusArray[this.data.index1],
        phonenum: this.data.Telephone,
        mail: this.data.Email,
        work: this.data.Profession,
        highgrade: this.data.EducationArray[this.data.index2],
        address: this.data.Address[0] + '-' + this.data.Address[1] + '-' + this.data.Address[2] + '-' + this.data.DetailAddress,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (res) => {
        console.log(res);
        wx.showToast({
          title: '成功修改名片',
          icon: 'success',
          duration: 2500,
        });
        wx.setStorage({
          key: 'realname',
          data: that.data.Name,
          success: (res) => {

          },
          fail: () => { },
          complete: () => { }
        });
      },
      fail: () => { },
    });

  },
  switch(e) {
    console.log(e);
    this.setData({ shouquan: e.detail.value })
  },
  yinsizhence(){
  wx.navigateTo({
    url: '../Yinsi/Yinsi',
    success: (result)=>{
      
    },
    fail: ()=>{},
    complete: ()=>{}
  });
  }

})