<template>
  <div class="card-header">
    <div class="maintitle">{{groupname}}</div>
    <div class="subhead">{{this.$route.params.subtitle}}</div>
    <div class="bottons">
      <ul>
        <li class="g_button" @click="toJobSubmission">作业提交</li>
        <li class="g_button" @click="toCreateNewCard">创建卡片</li>
        <li class="g_button" @click='backBtn'>返回</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default{
  name: 'card-header',
  props: ['groupname'],
  methods: {
    backBtn () {
      window.localStorage.removeItem('groupId')
      window.localStorage.removeItem('groupname')
      window.localStorage.removeItem('subtitle')
      window.localStorage.removeItem('groupState')
      window.localStorage.removeItem('groupSubId')
      this.$router.go(-1)
    },
    toJobSubmission () {
      if (window.localStorage.isMaster === 'false') {
        alert('你不能提交作业哦')
        return
      }
      if (window.localStorage.groupState === '已完成') {
        alert('作业已经提交')
        return
      }
      if (window.localStorage.groupState === '未完成') {
        alert('题目已过截止时间，无法提交')
        return
      }
      this.$router.push('/jobSubmission')
    },
    toCreateNewCard () {
      if (window.localStorage.groupState === '已完成') {
        alert('作业已经提交')
        return
      }
      if (window.localStorage.groupState === '未完成') {
        alert('题目已过截止时间，无法创建')
        return
      }
      this.$router.push('/CreateNewCard')
    }
  }
}
</script>

<style lang="stylus" scoped>
  cardHeaderHeidth = 57px
  .card-header
    width: 100%
    height: cardHeaderHeidth
    border-bottom: 7px solid #cccccc
    .maintitle
      float: left
      height: cardHeaderHeidth
      line-height: cardHeaderHeidth
      text-align: center
      font-size: 20px
      font-weight bold
    .subhead
      float: left
      margin-top: m = 16px
      height: lh = cardHeaderHeidth - m
      line-height: lh
      font-size: 12px
    .bottons
      float: right
      margin-right: 12px
      ul
        li
          // width: 90px
          // height: bh = 30px
          // line-height bh
          // text-align: center
          margin-top: 13.5px
          // margin-right: 18px
          // border: 1px solid #3fb2eb
          // border-radius: 3px
          // display: inline-block
          // color: #15a2e9
          // background: #fff
          // &:hover
          //   background: #3fb2eb
          //   color: #fffdff
</style>
