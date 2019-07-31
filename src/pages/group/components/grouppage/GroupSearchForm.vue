<template>
  <div class='group-search-form'>
    <div> 组名
      <input v-model='groupname'>
    </div>
    <div> 作业题目
      <input v-model='subjectTitle'>
    </div>
    <button class="g_button" type='primary' @click='selectData'>查询</button>
  </div>
</template>

<script>
export default{
  data () {
    return {
      groupname: '',
      subjectTitle: ''
    }
  },
  methods: {
    selectData () {
      this.$parent.selectData(this.groupname, this.subjectTitle)
    }
  }
}
</script>

<style lang='stylus' scoped>
  .group-search-form
    font-size :16px
    width: 100%
    height: 30px
    margin :15px 0
    display: flex
    justify-content :space-around
    align-items: center

  .group-search-form div input
    width: 150px
    height: 30px
    margin-left :5px
    border: 1px solid #e1e1e1
    border-radius: 3px
    padding-left 5px

  .group-search-form button
    float:right
</style>
