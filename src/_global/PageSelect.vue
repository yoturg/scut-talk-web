<template>
   <div class="page-select" v-if="this.$route.name !== 'Login'">
     <!-- <div id="select-list" v-show="roles">
       <div class='teacher-list' @click="changeListTeacher">请选择<img src="../../static/images/selectbutton.png" alt="" height="30" class="teacher-list"></div>
        <ul v-show="isShowListTeacher" class='teacher-list'>
          <router-link to='/group'><li @click="changeListTeacher" class="teacher-list">分组</li></router-link>
          <router-link to='/homeworkList'><li @click="changeListTeacher" class="teacher-list">作业题目</li></router-link>
        </ul>
     </div> -->
     <div id="select-list" v-show="roles">
       <router-link to='/group'><button :class="[groupClass]">分组</button></router-link>
        <router-link to='/homeworkList'><button :class="[workClass]">作业题目</button></router-link>
     </div>
     <div id='set-sys-color' @click="setSysColor"></div>
     <div id='user-name'>{{firstName}}</div>
     <!-- <span id='user-name'>gdfgdfgs</span> -->
     <div id='user-icon'>
      <div class="set-icon" @click.stop="showMessage" :style="iconStyle">
        <div>
          <img src="../../static/images/message-red-dot.png" alt="" class="show-message" v-show="isShowRed">
        </div>
      </div>
      <div id='message-show' v-show="isShowmessage">
        <div><div></div></div>
        <ul>
          <router-link to="/information">
            <li class="show-message">
              <div class="set-icon">
                <div class="show-message">
                  <img src="../../static/images/message-red-dot.png" alt="" class="show-message" v-show="isShowRed">
                </div>
                <img src="../../static/images/personal.png" alt="" class="show-message">
              </div>
              <span class="show-message">个人信息</span>
            </li>
          </router-link>
          <!-- <router-link to="/">
            <li class="show-message">
              <div class="set-icon show-message">
                <div class="show-message">
                  <img src="../../static/images/message-red-dot.png" alt="" class="show-message">
                </div>
                <img src="../../static/images/message.png" alt="" class="show-message">
              </div>
              <span class="show-message">消息</span>
            </li>
          </router-link> -->
          <router-link to="/">
            <li class="show-message" @click="signOut">
              <div class="set-icon show-message" >
                <div class="show-message">
                  <!-- <img src="../../static/images/message-red-dot.png" alt="" class="show-message"> -->
                </div>
                <img src="../../static/images/detrusion.png" alt="" class="show-message">
              </div>
              <span class="show-message">退出</span>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defaultIcon } from '@/util/defaultIcon'
export default{
  name: 'page-select',
  props: {
    isHideRed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultIcon,
      isShowList: false,
      isShowListTeacher: false,
      names: '',
      firstName: '',
      roles: false,
      isShowmessage: false,
      userIcon: './static/images/userIcon.png',
      isShowRed: 0,
      groupClass: '',
      workClass: '',
      replace: true
    }
  },
  computed: {
    getUserIcon: function () {
      return this.$store.getters.getUserIcon
    },
    iconStyle: function () {
      return 'border:1px solid #FFFFFF; width:50px; height:50px; border-radius:50%;backgroundRepeat:no-repeat;' +
        'backgroundSize: cover; backgroundImage:url(' + this.userIcon + ');'
    }
  },
  watch: {
    getUserIcon () {
      this.userIcon = this.$store.getters.getUserIcon
    }
  },
  created () {
    this.judgePage()
    // console.log('hide:' + this.isHideRed)
    this.isHideRed ? this.isShowRed = 0 : this.judgeInfo()
    document.addEventListener('click', e => {
      var getClickName = e.target.className
      if (getClickName !== 'teacher-list') {
        this.isShowListTeacher = false
      }
      if (getClickName !== 'show-message') {
        this.isShowmessage = false
      }
    })
    var getUserId = window.localStorage.getItem(`userId`) || ''
    if (getUserId !== '' && getUserId !== undefined) {
      this.axios.get('/Martell/a/sys/userAPI/interface/findUserInfoById?userkey=' + localStorage.getItem('userkey') + '&id=' + getUserId + '&time=' + new Date().getTime()
      ).then((response) => {
        // console.log('获取图片:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          this.firstName = response.data.resultMap.user.name
          this.roles = response.data.resultMap.user.role.name.includes('老师') || response.data.resultMap.user.role.name.includes('管理员')
          // this.userIcon = response.data.resultMap.user.iconurl !== '' ? (response.data.resultMap.user.iconurl + '?x-oss-process=image/resize,w_2048/rotate,0/quality,q_30') : './static/images/userIcon.png'
          if (response.data.resultMap.user.iconurl) {
            this.userIcon = response.data.resultMap.user.iconurl + '?x-oss-process=image/resize,w_2048/rotate,0/quality,q_30'
            window.localStorage.setItem('userIconUrl', response.data.resultMap.user.iconurl)
          } else {
            this.userIcon = this.defaultIcon
            window.localStorage.setItem('userIconUrl', this.defaultIcon)
          }
          // this.$store.dispatch('setUserIcon', this.userIcon)
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    }
  },
  methods: {
    setSysColor () {
      // console.log('改颜色')
    },
    changeList () {
      this.isShowList = !this.isShowList
    },
    changeListTeacher () {
      this.isShowListTeacher = !this.isShowListTeacher
    },
    showMessage () {
      this.isShowmessage = !this.isShowmessage
    },
    signOut () {
      this.axios.put(`/Martell/a/sys/userAPI/interface/exitLogin/${localStorage.getItem('userId')}?userkey=${localStorage.getItem('userkey')}`)
        .then(response => {
          // console.log('signOut:' + JSON.stringify(response.data.statusCode))
        })
      window.localStorage.clear()
    },
    judgeInfo () {
      this.axios.get(`/Martell/a/sys/userAPI/interface/getRedDotForNewMessage?userkey=${localStorage.getItem('userkey')}&userId=${window.localStorage.getItem('userId')}&time=${new Date().getTime()}`).then(response => {
        // console.log('获取消息：' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          if (response.data.resultMap.redDot === 0) {
            this.isShowRed = 0
          } else {
            this.isShowRed = 1
          }
          setTimeout(() => {
            this.judgeInfo()
          }, 30 * 1000)
        }
      })
    },
    judgePage () {
      var getRouteName = this.$route.name
      this.groupClass = (getRouteName === 'Group') ? 'change-color' : 'button-color'
      this.workClass = (getRouteName === 'homeworkList') ? 'change-color' : 'button-color'
    }
  }
}
</script>

<style>
.page-select{
  width: auto;
  height: 50px;
  /* background-color: blueviolet; */
  display: flex;
  align-items: center;
  margin-top: -10px;
}
.page-select>div{
  margin-left: 20px;
}
/* #select-list{
  width: 200px;
  height: 30px;
  display: flex;
  flex-wrap: wrap;
}
#select-list>div{
  width: 100%;
  height: 28px;
  border-radius: 2px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
}
#select-list>ul{
  z-index: 1;
  background-color: #fff;
}
#select-list>ul li{
  width: 200px;
  height: 35px;
  line-height: 35px;
  padding-left: 5px;
  color: black;
}
#select-list>ul li:hover{
  background-color: #eee;
} */
#select-list button{
  padding: 5px 18px;
  font-size: 16px;
  border-radius: 20px;
  border: 0;
  color: white;
  font-family: "微软黑体";
  margin-right: 10px;
  box-shadow: 0.5px 0px 1px 0.5px #3395c7;
}
.button-color{
  background-color: #77c3eb;
}
.change-color{
  background-color: #3395c7;
}
button:focus{
  outline: none;
}
#user-name{
  min-width: 70px;
  line-height: 50px;
  height: 100%;
  /* background-color: yellowgreen; */
  text-align: center;
  color: #fff;
}
#user-icon{
  width: 50px;
  height: 50px;
  /* background-color: aqua; */
  display: flex;
  flex-wrap: wrap;
}
#message-show{
  z-index: 1;
  width: 140px;
  height: auto;
  /* background-color: violet; */
  margin-left: -80px;
}
#message-show>div{
  width: 100%;
  height: 10px;
  display: flex;
  justify-content: flex-end;
}
#message-show>div>div{
  width:0;
  height:0;
  border-width:0 10px 10px;
  border-style:solid;
  border-color:transparent transparent white;
  margin-right: 12px;
}
#message-show>ul{
  box-shadow: 6px 4px 9px #C4C4C1;
  width: 100%;
  height: auto;;
  background-color: white;
  padding: 2px 0 0 0;
}
#message-show>ul li{
  height: 50px;
  /* background-color: yellowgreen; */
  display: flex;
  padding: 3px 10px;
  align-items: center;
  color: black;
}
#message-show>ul li:hover{
  background-color: rgb(238,238,238);
}
#message-show>ul li>div{
  height: 30px;
  width: 30px;
  margin-right: 10px;
}
#message-show>ul .set-icon>div+img{
  width: 100%;
  height: 100%;
}
#message-show>ul .set-icon>div{
  top: -5px;
  right: 2px;
}
.set-icon{
  position: relative;
}
.set-icon>div{
  position: absolute;
  right: 0;
}
.set-icon img{
  border-radius: 50%;
}
</style>
