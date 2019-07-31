<template>
  <div id="login">
    <div v-show="loginMessage">
      <div id='login-title' class="clean-both">
        <span>TalkingLite</span>
        <span>欢迎登录系统</span>
      </div>
      <div id="login-message" class="clean-both">
        <div>
          <img src="../img/login_pic.png" alt="网络加载异常" >
        </div>
        <div class="clean-both" id='app'>
          <input type="text" placeholder="账号" v-model="username"><br>
          <input type="password" v-model="password" value="admin" placeholder="密码" @keyup.enter="login"><br>
          <button id='loginBtn' @click="login">登录</button>
          <!-- <router-link to="/home"><button @click="login">登录</button></router-link> -->
          <span><a href="#" @click="forgetPwd">忘记密码</a></span>
        </div>
      </div>
    </div>
    <div class='login-other' v-show='loginCredentials'>
      <div>
        <span>手机认证信息</span>
      </div>
      <div>
        <input type="text" placeholder="手机" v-model="mobile"><br>
        <input type="text" placeholder="验证码" v-model="code" class="credent-input" @keyup.enter="confirm ('credentials')">
        <input type="button"  value="发送至手机" class="credent-input login-crede-time" @click="getCode ('credentials')" >
        <br>
        <div>
          <input type="button" value="返回" @click="backLogin()">
          <input type="button" value="确定" @click="confirm ('credentials')">
        </div>
      </div>
    </div>
    <div class='login-other' v-show='loginForget'>
      <div>
        <span>更新密码</span>
      </div>
      <div>
        <input type="text" placeholder="绑定的手机号码" v-model="mobile"><br>
        <input type="password" placeholder="新密码" v-model="password"><br>
        <input type="text" placeholder="验证码" v-model="code" class="credent-input" @keyup.enter="confirm ('forget')">
        <input type="button"  value="发送至手机" class="credent-input login-crede-time" @click="getCode ('forget')" ><br>
        <div>
            <input type="button" value="返回" @click="backLogin()">
            <input type="button" value="确定" @click="confirm ('forget')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export default{
  name: 'LoginForm',
  data () {
    return {
      username: '',
      password: '',
      mobile: '',
      code: '',
      userId: '',
      loginMessage: true,
      loginCredentials: false,
      loginForget: false
    }
  },
  created () {
  },
  methods: {
    login () {
      var getUsername = this.username.trim()
      var getPwd = this.password.trim()
      if (getUsername !== '' && getUsername !== null && getPwd !== '' && getPwd !== null) {
        this.axios.post('/Martell/a/sys/userAPI/interface/login', this.qs.stringify({
          number: getUsername,
          password: getPwd
        })
        ).then((response) => {
          // console.log('登录:' + JSON.stringify(response))
          if (Number(response.status) === 200) {
            if (Number(response.data.statusCode) === 200) {
              this.userId = response.data.resultMap.infoList.id
              window.localStorage.setItem('userId', this.userId)
              window.localStorage.setItem('userName', response.data.resultMap.infoList.name)
              window.localStorage.setItem('userRole', response.data.resultMap.infoList.role.name)
              window.localStorage.setItem('userkey', response.data.resultMap.userkey)
              // console.log('localStorage:' + JSON.stringify(window.localStorage))
              this.$router.push({path: '/home'})
            } else {
              alert(response.data.message)
              if (response.data.message.includes('绑定手机')) {
                [this.loginMessage, this.loginCredentials] = [false, true]
                this.password = ''
                this.username = ''
                this.code = ''
                this.userId = response.data.resultMap.userId
                // console.log('userId:' + this.userId)
                this.password = ''
              }
            }
          }
        }).catch(error => {
          console.log(JSON.stringify(error))
          if (error.response) {
            if (Number(error.response.status) === 504) {
              alert('连接超时')
            }
          } else if (error.request) {
            alert('哎呀！网络开小差了')
          } else {
            // alert('服务器异常')
          }
        })
      } else {
        alert('用户或密码不能为空')
      }
    },
    backLogin () {
      [this.loginMessage, this.loginCredentials, this.loginForget] = [true, false, false]
      this.password = ''
      this.username = ''
    },
    forgetPwd: function () {
      [this.loginMessage, this.loginForget] = [false, true]
      this.password = ''
      this.username = ''
    },
    getCode: function (number) {
      var parem
      if (number.trim() === 'credentials') {
        var getPhone = this.mobile.trim()
        // console.log(getPhone)
        if (getPhone !== '' && getPhone !== null) {
          if (!(/^1[3-578]\d{9}$/.test(getPhone)) && getPhone !== '') {
            alert('手机号的格式不对')
            return
          }
          parem = { phone: getPhone }
          this.timer(0, '/Martell/a/sys/userAPI/interface/sendShortMsgByPhone', parem)
        }
      } else if (number.trim() === 'forget') {
        var getMobile = this.mobile.trim()
        if (!(/^1[3-578]\d{9}$/.test(getMobile)) && getMobile !== '') {
          alert('手机号的格式不对')
          return
        }
        // console.log(getMobile)
        if (getMobile !== '' && getMobile !== null) {
          parem = { phone: getMobile }
          this.timer(1, '/Martell/a/sys/userAPI/interface/sendShortMsgWithoutLogin', parem)
        }
      }
    },
    timer: function (number, url, parem) { // 验证码时间
      this.axios.post(url, this.qs.stringify(parem)).then(function (response) {
        // console.log(response)
        if (Number(response.status) === 200) {
          if (Number(response.data.statusCode) === 200) {
            var startTime = new Date()
            document.getElementsByClassName('login-crede-time')[number].disabled = true
            startTime.setMinutes(startTime.getMinutes() + 1)
            var endTime = new Date(startTime).getTime()
            var overplusTime = (endTime - new Date().getTime()) / 1000
            var showTime = 0
            var time = setInterval(function () {
              if (overplusTime > 1) {
                overplusTime--
                showTime = Math.floor(overplusTime % 60)
                var getSentButton = document.getElementsByClassName('login-crede-time')[number]
                getSentButton.disabled = true
                getSentButton.value = `${showTime} 秒后可发送`
                // console.log(showTime)
              } else {
                getSentButton = document.getElementsByClassName('login-crede-time')[number]
                getSentButton.disabled = false
                getSentButton.value = '重新发送'
                clearInterval(time)
              }
            }, 1000)
          } else {
            alert(response.data.message)
          }
        }
      })
    },
    confirm: function (number) { // 认证信息与忘记密码
      var url = ''
      var parem = ''
      var getPhone
      var getCode
      var getPwd
      if (number.trim() === 'credentials') {
        getPhone = this.mobile.trim()
        getCode = this.code.trim()
        var getUserId = this.userId
        if (getPhone !== '' && getPhone !== null && getCode !== '' && getCode !== null) {
          if (!(/^1[3-578]\d{9}$/.test(getPhone)) && getPhone !== '') {
            alert('手机号的格式不对')
            return
          }
          parem = {phone: getPhone, verificationCode: getCode, userId: getUserId}
          url = '/Martell/a/sys/userAPI/interface/verificationCodeForBindingPhone'
        }
      } else if (number.trim() === 'forget') {
        getPhone = this.mobile.trim()
        getCode = this.code.trim()
        getPwd = this.password.trim()
        if (getPhone !== '' && getPhone !== null && getCode !== '' && getCode !== null && getPwd !== '' && getPwd !== null) {
          if (!(/^1[3-578]\d{9}$/.test(getPhone)) && getPhone !== '') {
            alert('手机号的格式不对')
            return
          }
          url = '/Martell/a/sys/userAPI/interface/verificationWithoutLogin'
          parem = {phone: getPhone, verificationCode: getCode, newPassWord: getPwd}
        }
      }
      // console.log(parem)
      this.axios.post(url, this.qs.stringify(parem)).then((response) => {
        if (Number(response.status) === 200) {
          // console.log(response)
          if (Number(response.data.statusCode) === 200) {
            [this.loginMessage, this.loginCredentials, this.loginForget] = [true, false, false]
          } else {
            alert(response.data.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  *{
    margin: 0px;
    padding: 0px;
  }
  #login{
    height: 100%;
    width: 100%;
    position: relative;
  }
  #login>div{
    height: 50%;
    width: 75%;
    position: absolute;
    margin: auto;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: white;
    border-radius 5px
    box-shadow: -3px -3px 20px 0px #888;
  }
  #login-title{
    margin: 30px 20px;
  }
  #login-title>span{
    display: block;
    float: left;
    height: 30px;
    font-size: 25px;
    line-height: 30px;
    color: #696969;
    width: 300px;
  }
  #login-title>span:first-child{
    text-align: center;
    font-size: 24px;
    color: rgb(20,163,223);
    font-weight: 600;
    font-family: '微软雅黑';
  }
  #login-title>span:last-child{
    letter-spacing:1px;
    padding-left 2px;
    padding-top 3px;
    color: rgb(179,170,170);
  }
  #login-message{
    margin: 30px 20px;
  }
  #login-message
    div:first-child
      width: 300px;
      text-align: center;
      img
        height 200px
  #login-message>div{
    float: left;
  }
  #login-message>div>input{
    width: 350px;
    height: 40px;
    margin: 0 0 35px 0;
    border-radius: 4px;
    border: 1px solid rgb(215,215,215);
    color: rgb(179,170,170);
    padding-left 20px;
  }
  #login input::-webkit-input-placeholder{
    color: rgb(179,170,170);
  }
  #login-message>div button{
    width: 150px;
    height: 40px;
    background-color: #ffffff;
    border 1px solid #3fb2eb
    color: #3fb2eb
    border-radius: 4px;
  }
  #login-message>div>span{
    display: block;
    float: right;
    height: 40px;
    line-height: 40px;
  }
  #login-message>div>span>a{
      text-decoration: none;
      color: rgb(34,163,229)
  }
  // 手机认证信息
  .login-other>div>span{
      font-size: 28px;
  }
  .login-other>div{
      width: 100;
      text-align: center;
      margin: 30px 0 20px 0;
  }
  .login-other>div input{
      width: 320px;
      height: 40px;
      margin: 0 0 25px 0;
      border-radius: 4px;
      color: rgb(179,170,170);
      border: 1px solid;
  }
  .login-other .login-crede-time{
    background-color: white;
    color: #47A1E3;
    border: 1px solid #47A1E3;
  }
  .login-other
    .login-crede-time
      &:hover{
        color: white;
        background-color: #47A1E3;
        cursor pointer
      }
      &:focus{
        outline none
      }
  .login-other>div input[type=text],.login-other>div input[type=password]{
      padding-left: 20px;
  }
  .login-other>div .credent-input,
  .login-other>div input[type=button]{
    width: 160px;
  }
  .login-other
    div
      div
        input[type=button]:first-child
          background-color: #e6e6e6;
          color: #ffffff;
          width 165px
          border: 1px solid #D3D3D3
          &:hover{
            cursor pointer
            background-color: #cccccc;
          }
          &:focus{
            outline none
            background-color: #cccccc;
          }
  .login-other
    div
      div
        input[type=button]:last-child
          background-color: #15a1e9
          color: white;
          width 165px
          margin-left 5px
          border 1px solid #47A1E3
          &:hover{
            cursor pointer
            background-color: #1287c3
          }
          &:focus{
            outline none
            background-color: #1287c3
          }
  .login-other>div>div{
    width: 325px;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }
  .clean-both:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .login-other:last-child{
    height: 60%;
  }
  #loginBtn
    &:hover
      cursor pointer
      color #fff
      background-color #14a2e9
    &:focus
      outline none
</style>
