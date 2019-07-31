<template>
  <div class='inform-head'>
    <div id='inform-title'>个人信息</div>
    <div id='inform-list'>
        <inform-icon></inform-icon>
        <div id='infrom-message'>
            账号：<input type="text" v-model="userNumber" required readonly>&nbsp;<span style="color:#f00">*</span><br>
            姓名：<input type="text" v-model="userName" required>&nbsp;<span style="color:#f00">*</span><br>
            电话号码：<input type="text" v-model="userPhone" required>&nbsp;<span style="color:#f00">*</span><br>
            邮箱：<input type="email" v-model="userEmail">&nbsp;&nbsp;&nbsp;<br>
        </div>
        <div><button class="g_button" @click="confirm">确认编辑</button></div>
    </div>
  </div>
</template>

<script>
import informIcon from './informIcon'
import { eventBus } from '@/util/eventBus'
export default {
  name: 'inform-head',
  data () {
    return {
      userName: '',
      userNumber: '',
      userPhone: '',
      userEmail: ''
    }
  },
  components: {
    informIcon
  },
  methods: {
    confirm () {
      // var ret = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
      var getName = this.userName.trim() || ''
      var getPhone = this.userPhone.trim() || ''
      var getEmail = this.userEmail.trim() || ''
      var getNumber = this.userNumber.trim() || ''
      if (getName === '') {
        alert('姓名不能为空')
        return
      }
      if (getNumber === '') {
        alert('账号不能为空')
        return
      }
      if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(getEmail)) && getEmail !== '') {
        alert('邮箱的格式不对')
        return
      }
      if (!(/^1[3-578]\d{9}$/.test(getPhone)) && getPhone !== '') {
        alert('手机号的格式不对')
        return
      }
      // if (getEmail !== '') {
      //   console.log('1232:' + ret.test(getEmail))
      //   return ret.test(getEmail) ? '' : alert('邮箱格式不正确')
      // }
      var iconurl = window.localStorage.getItem('userIconUrl')
      if (getName !== '' && getNumber !== '') {
        this.axios.put('/Martell/a/sys/userAPI/interface/updateUserInfo/' + window.localStorage.getItem('userId') + '?name=' + encodeURIComponent(getName) + '&number=' + getNumber + '&email=' + getEmail + '&phone=' + getPhone + '&remarks=' + 1010 + '&iconurl=' + iconurl + '&userkey=' + localStorage.getItem('userkey')
        ).then((response) => {
          // console.log('编辑:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            alert('修改成功')
            location.reload()
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert(response.data.message)
          }
        })
      }
    }
  },
  created () {
    this.axios.get('/Martell/a/sys/userAPI/interface/findUserInfoById?userkey=' + localStorage.getItem('userkey') + '&id=' + window.localStorage.getItem('userId') + '&time=' + new Date().getTime()).then(response => {
      // console.log('获取个人信息：' + JSON.stringify(response))
      if (Number(response.data.statusCode) === 200) {
        var userData = response.data.resultMap.user
        this.userName = userData.name
        this.userNumber = userData.number
        this.userPhone = userData.phone
        this.userEmail = userData.email
      } else if (Number(response.data.statusCode) === 401) {
        alert(response.data.message)
        this.exit()
      } else {
        alert(response.data.message)
      }
    })
  },
  mounted () {
    eventBus.$on('editInfo', () => {
      this.confirm()
    })
  }
}
</script>

<style lang='stylus' scoped>
@import '../../../assets/styles/varibles.styl'
#inform-title
  display inline-block
  width auto
  font-size 1.5rem
  margin 16px 0 0 20px
  padding-bottom 10px
  border-bottom .4rem solid themeColor
  letter-spacing 2px
#inform-list
  width 90%
  height auto
  margin 20px auto
  border-bottom 5px solid themeColor
  display flex
  justify-content center
  #infrom-message
    width 50%
    font-size 14px
    line-height 50px
    text-align right
    margin 0 0 30px 40px
    input
      width 350px
      height 35px
      border-radius 5px
      border 1px solid #e1e1e1
      padding-left 15px
      &:first-child
        color #A9A9A9
        outline none
  #infrom-message+div
    width 100px
    line-height 50px
    background-clip red
    align-self flex-end
    margin 0 0 30px 40px
</style>
