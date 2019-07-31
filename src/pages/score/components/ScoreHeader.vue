<template>
  <div class="header-title">
    <div class="title">{{title}}</div>
    <div class="score-operation">
      <div class="operation-name">
        <button class='g_button' @click="backBtn">返回</button>
        <button class='g_button' @click="rule" v-show="isShowBtn">规则</button>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    eventBus
  },
  data () {
    var content = ''
    if (this.isShow) {
      content = '作业评分'
    } else {
      content = '评分规则'
    }
    return {
      title: content,
      isShowBtn: this.isShow
    }
  },
  methods: {
    backBtn () {
      this.$router.go(-1)
    },
    rule () {
      this.$router.push('/scoreRule')
    }
  }
}
</script>

<style lang="stylus" scoped>
.header-title
  .title
    width:auto
    display:inline-block !important
    display:inline
    font-size:1.5rem
    margin-left:3rem
    margin-top:1rem
    padding:0 .4rem
    border-bottom:.4rem solid #3fb2eb
  .score-operation
    padding:35px 0
    margin:0 68px
    border-bottom:2px solid #b9bcbd
    .operation-title
      float: left
      display: inline-block
    .operation-name
      float: right
      display: inline-block
</style>
