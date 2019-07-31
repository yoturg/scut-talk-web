<template>
  <div class="search-form">
    <div class='group-teacher'>
      老师&ensp;
      <input class='selectTeacher' v-model="selectedTeacher" readonly><img src='@/pages/group/img/pull-down.png' height="30" @click='showData'/>
      <ul v-show="isShowTeacher" class="jobname-list">
        <li class="jobname-list" v-for="(teacher,index) in teachers" :key="index" @click='getSelectedTeacher(teacher)'>{{teacher.name}}</li>
      </ul>
    </div>
    <div id='jobname' class="jobname-list">
      作业题目&ensp;
      <input type="text" v-model="titleName"/>
    </div>
    <button class="g_button" @click='searchBtn'>查询</button>
  </div>
</template>

<script>
export default{
  name: 'search-table',
  data () {
    return {
      selectedTeacher: '请选择老师',
      isShowTeacher: false,
      jobName: 'dasd',
      teachers: [],
      titleName: '',
      teacherId: ''
    }
  },
  created () {
    // console.log('测试先后：---2')
    this.getTeacher()
  },
  methods: {
    showData () {
      this.isShowTeacher = !this.isShowTeacher
    },
    getSelectedTeacher (teacher) {
      this.selectedTeacher = teacher.name
      this.teacherId = teacher.id
      this.$emit('getTeacherId', teacher.id)
      this.showData()
    },
    getTeacher () {
      this.axios.get('/Martell/a/sys/userAPI/interface/findAllTeacherInfo?userkey=' + localStorage.getItem('userkey') + '&time=' + new Date().getTime()).then((response) => {
        // console.log('getTea:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          this.teachers = response.data.resultMap.teachers
          this.selectedTeacher = this.teachers[0].name
          this.teacherId = this.teachers[0].id
          this.$emit('getTeacherId', this.teachers[0].id)
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    },
    searchBtn () {
      // console.log('teacherId：' + this.teacherId + ',titleName:' + this.titleName)
      this.$parent.searchData(this.titleName)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .search-form
    display: flex
    justify-content: space-between
    align-items: center
    width: 100%
    height: 73px
    padding: 15px 0
    .group-teacher
      display: inline-flex
      flex-wrap: wrap
      align-items:center
      width: 280px
      height: 30px
      .selectTeacher
        width 165px
        height: 30px
        padding-left: 5px
        border: 1px solid #e1e1e1
        margin-right -1px
        font-size 14px
        border-top-left-radius:3px;
        border-bottom-left-radius:3px;
        .hint
          width: 163px
          height: 30px
          line-height: 2.5rem
      ul
        z-index 1
        background-color white
        margin-left 40px
        width 202px
        border: 1px solid #e1e1e1
        font-size 14px
        box-shadow: 3px 3px 5px #888888;
        li
          height: 30px
          display: flex
          align-items: center
          padding-left: 5px
          &:hover
            background-color: #e1e1e1
    #jobname
      display: flex
      width: auto
      align-items: center
      input
        width: 225px
        height: 30px
        border: 1px solid #e1e1e1
        border-radius: 3px
        outline: none
        padding-left 5px
  // button
  //   display: flex
  //   width: 90px
  //   height: 30px
  //   line-height: 30px
  //   border:1px solid #47a1e3
  //   border-radius: 3px
  //   display: inline-block
  //   background: #fff
  //   color: #47a1e3
  //   &:hover
  //     background: #47a1e3
  //     color: #fff
  //   &:focus
  //     outline none
</style>
