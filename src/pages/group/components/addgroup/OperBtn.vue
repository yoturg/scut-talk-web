<template>
  <div id="operBtn">
    <button class="g_button" @click="addMemberBtn">添加</button>
    <button class="g_button" @click="delMemberBtn">删除</button>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'

export default {
  data () {
    return {
      subIds: ''
    }
  },
  components: {
    eventBus
  },
  mounted () {
    eventBus.$on('getSubId', (data) => {
      this.subIds = data
    })
  },
  methods: {
    addMemberBtn: function () {
      if (this.subIds !== null && this.subIds !== '') {
        eventBus.$emit('getMemberData')
      } else {
        alert('请先选择作业题目')
      }
    },
    delMemberBtn: function () {
      eventBus.$emit('delMemberData')
    }
  }
}
</script>

<style lang="stylus" scoped>
  #operBtn
    flex 1
    display flex
    flex-direction column
    align-items flex-start
    button
      margin auto
</style>
