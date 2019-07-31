<template>
  <div class='home-header'>
    <div class='home-title'>首页</div>
    <div v-if='role' class='stu-botton-list'>
      <!-- <div></div> -->
      <ul>
        <li @click='joinGroup' class="g_button"><a href='javascript:;'>加入小组</a></li>
        <li @click='addGroup' class="g_button"><a href='javascript:;'>新建小组</a></li>
        <li @click='personalScore' class="g_button"><a href='javascript:;'>个人分数</a></li>
        <li @click='toTrash' class="g_button"><a href='javascript:;'>垃圾箱</a></li>
        <!-- <li @click='flush'><a href='javascript:;'>刷新</a></li> -->
      </ul>
      <!-- <div></div> -->
    </div>
    <div v-else class='teacher-botton-list'>
      <div class="tal-div">
        <!-- <div></div>
        <div></div>
        <div></div> -->
      </div>
      <ul class="tal-ul">
        <li class="g_button" @click='toTrash'><a href='javascript:;'>垃圾箱</a></li>
        <li class="g_button" @click='flush'><a href='javascript:;'>刷新</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default{
  name: 'home-header',
  components: {
    eventBus
  },
  data () {
    return {
      role: window.localStorage.getItem('userRole').indexOf('学生') !== -1
    }
  },
  methods: {
    joinGroup () {
      // this.axios.get('/Martell/a/sys/userAPI/interface/findAllTeacherInfo', this.qs.stringify({
      // })
      // ).then((response) => {
      //   console.log(response)
      //   if (Number(response.status) === 200) {
      //     if (Number(response.data.statusCode) === 200) {
      //       /* this.userId = userId */
      //       this.$router.push({path: '/group?pageId=' + '1'})
      //     } else {
      //       console.log(response.data.message)
      //     }
      //   }
      // }).catch(function (error) {
      //   console.log(error)
      // })
      this.$router.push({name: 'JoinGroup'})
    },
    personalScore () {
      this.$router.push({name: 'PersonalScore'})
    },
    addGroup () {
      // var userId = window.localStorage.getItem('userId')
      // /*  var officeId = '0' */
      // this.axios.get('/Martell/a/team/subjectAPI/interface/findSubjectList', this.qs.stringify({
      //   userId: userId
      // })
      // ).then((response) => {
      //   if (Number(response.status) === 200) {
      //     if (Number(response.data.statusCode) === 200) {
      //       this.userId = userId
      //       this.$router.push({path: '/group/addGroup?pageId=' + '2'})
      //     } else {
      //       console.log(response.data.message)
      //     }
      //   }
      // }).catch(function (error) {
      //   console.log(error)
      // })
      window.localStorage.setItem('handleGroup', 'AddGroup')
      this.$router.push({name: 'AddGroup'})
    },
    toTrash () {
      this.$router.push({name: 'Trashd'})
    },
    flush () {
      // location. reload()
      eventBus.$emit('flushDataTable')
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '../../../assets/styles/varibles.styl'
  .home-title
    margin 0px 55px
    font-size: 1.9rem

  .teacher-botton-list
    height 50px
    margin 0px 55px 20px 40px
    border-bottom 5px solid themeColor
    display flex
    align-self flex-end

  .teacher-botton-list
    .tal-div
      flex 3
      height 35px
      align-self flex-end
      display flex
      justify-content flex-start
      div:first-child
        width 0
        height 0
        border-color rgb(20,161,213) transparent
        border-width 0 0 35px 20px
        border-style solid
      div:nth-child(2)
        width 40%
        background-color rgb(20,161,213)
      div:last-child
        width 0
        height 0
        border-color rgb(20,161,213) transparent
        border-width 0 20px 35px 0
        border-style solid

  .teacher-botton-list
    ul
      flex 1
      display flex
      justify-content flex-start

  .stu-botton-list
    height: 50px
    margin 0px 55px 20px 40px
    border-bottom 5px solid themeColor
    overflow: hidden
    display: flex
    justify-content: flex-end
    align-items: flex-end

  .stu-botton-list ul
    width:57%
    height: 44px
    // background: linear-gradient(to top,  rgb(20,161,213) 50%,  transparent 50%)
    display: flex
    align-items: flex-start
    justify-content: space-around
    padding: 0 30px

  .stu-botton-list>div:first-child
    width: 0
    height: 0
    border-color: rgb(20,161,213) transparent
    border-width: 0 0 22px 30px
    border-style: solid

  .stu-botton-list>div:last-child
    width: 0
    height: 0
    border-color: rgb(20,161,213) transparent
    border-width: 0 30px 22px 0
    border-style: solid

  .stu-botton-list ul>li
    width: 90px
    height: 35px
    border-radius 5px
    background: #fff

  .tal-ul
    li
      box-shadow 3px 3px 5px #888888;
</style>
