<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <div class="create-header">
        <h1>{{groupname}}</h1>
        <!-- <p>作业题目： {{subtitle}}</p> -->
        <div class="underline"></div>
      </div>
      <div class="create-body">
        <div class="body-title">
          <h2>新建卡片</h2>
          <ul>
            <li class="g_button" @click="createNewCard">提交</li>
            <li class="g_button" @click="backCard">返回</li>
          </ul>
        </div>
        <div class="submisstionContent">
          <div class="card-name">
            <h3>卡片名称：</h3>
            <input type="text" name="" v-model="inputValue">
            <span>*</span>
          </div>
          <div class="dutyBy">
            <h3>卡片负责人：</h3>
            <div class="radio-input">
              <label><input type="radio" name="dutyBy" value="0" v-model="radioValue" checked>待领取</label>
              <label><input type="radio" name="dutyBy" value="1" v-model="radioValue">自己领取</label>
              <label v-if="isTeacher"><input type="radio" name="dutyBy" value="-1" v-model="radioValue">指派</label>
            </div>
            <ul v-if="radioValue == -1" class="userInfo">
              <li v-for="item in userInfo" :key="item.id">
                <label>
                  <input type="radio" name="dutyOther" :value="item.id" v-model="dutyId">{{item.name}}
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
export default {
  name: 'CreateNewCard',
  data () {
    return {
      radioValue: 0,
      inputValue: '',
      dutyId: '',
      userInfo: []
    }
  },
  methods: {
    getUserInfo () {
      if (window.localStorage.groupId) {
        var param = {'userkey': localStorage.userkey, 'teamId': window.localStorage.groupId, 'time': new Date().getTime()}
        this.axios.get('/Martell/a/team/teamAPI/interface/getTeamInfoByTeamId', {params: param}).then((response) => {
          if (Number(response.data.statusCode) === 200) {
            this.userInfo = response.data.resultMap.teamMembers
            // console.log(this.userInfo)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          }
        })
      }
    },
    backCard () {
      this.$router.go(-1)
    },
    createNewCard () {
      if (window.localStorage.groupId == null || window.localStorage.userId == null) {
        alert('请重新登录')
      }
      if (this.inputValue == null || this.inputValue.length === 0) {
        alert('请输入评论内容')
      } else {
        let data = new FormData()
        data.append('title', this.inputValue)
        if (this.radioValue !== 0) {
          data.append('dutyBy', Number(this.radioValue) === 1 ? window.localStorage.userId : this.dutyId)
        }
        data.append('teamId', window.localStorage.groupId)
        data.append('userId', window.localStorage.userId)
        data.append('userkey', window.localStorage.userkey)
        this.axios.post('/Martell/a/team/cardAPI/interface/createNewCard', data, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
          // console.log(JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            alert('新建成功')
            this.$router.go(-1)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert(response.data.message)
          }
          // console.log(response)
        })
      }
    }
  },
  computed: {
    isTeacher () {
      return window.localStorage.userRole === '老师'
    },
    groupname () {
      if (window.localStorage.groupname) {
        return window.localStorage.groupname
      } else {
        this.$router.go(-1)
      }
    },
    subtitle () {
      if (window.localStorage.subtitle) {
        return window.localStorage.subtitle
      } else {
        this.$router.go(-1)
      }
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="stylus" scoped>
  h1
    font-size: 21px
  h2
    font-size: 16px
    font-weight: normal
  h3
    height: 52px
    margin-left: 102px
    line-height 52px
    font-size: 13px
    font-weight: normal
  p
    font-size: 13px
  .container
    background: #f4f4f4
    .create-header
      width: 100%
      height: 47px
      margin-bottom: 14px
      position: relative
      h1
        position: absolute
        bottom: 0
        left: 46px
      p
        position: absolute
        bottom: 0
        left: 105px
      .underline
        width: 70px
        border: 2px solid #5166c1
        position: absolute
        bottom: -14px
        left: 40px
    .create-body
      .body-title
        width: 900px
        height: 81px
        margin: 8px auto 0 auto
        border-bottom: 2px solid #cccccc
        h2
          line-height: 81px
          float: left
        ul
          text-align: right
          line-height: 81px
          li
            display: inline-block
            width: 90px
            height: 30px
            line-height: 30px
            margin-left: 24px
            background: #fff
            text-align: center
            &:hover
              background: #ebebeb
              color: #666
      .submisstionContent
        .card-name
          input
            width: 500px
            height: 30px
            border: 1px solid #e1e1e1
            border-radius: 3px
            padding-left: 5px
            margin-left: 110px
          span
            color: red
            font-size: 20px
      .dutyBy
        position: relative
        .radio-input
          margin-left: 110px
          margin-right: 26px
        .userInfo
          width: 200px
          padding: 5px 5px
          background: #fff
          position: absolute
          top: 90px
          left: 250px
          &:before
            content ''
            width: 0px
            height: 0px
            border-style:solid
            border-width:0 15px 15px
            border-color: transparent transparent #fff
            display: block
            position: absolute
            top: -10px
</style>
