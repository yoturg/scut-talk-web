<template>
  <div class="search-form">
    <div> 小组名字
      <input v-model="groupname" status="info">
    </div>
    <div> 建组人
      <input v-model="groupcreator" status="info">
    </div>
    <div> 作业题目
      <input v-model="subTitle">
    </div>
    <button type="primary" @click="selectData"  class="g_button">查询</button>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default{
  name: 'search-form',
  components: {
    eventBus
  },
  data () {
    return {
      groupname: '',
      groupcreator: '',
      subTitle: ''
    }
  },
  methods: {
    selectData () {
      this.$parent.selectData(this.groupname, this.groupcreator, this.subTitle)
    }
  },
  mounted () {
    eventBus.$on('flushDataTable', () => {
      this.groupname = ''
      this.groupcreator = ''
      this.subTitle = ''
    })
  }
}
</script>

<style lang="stylus" scoped>
  .search-form
    font-size :16px
    width: 100%
    height: 30px
    margin-bottom :20px
    display: flex
    justify-content :space-around
    align-items: center

  .search-form div input
    width: 150px
    height: 30px
    margin-left :5px
    border: 1px solid #e1e1e1
    border-radius: 3px
    padding-left 5px

  .search-form button
    float:right
</style>
