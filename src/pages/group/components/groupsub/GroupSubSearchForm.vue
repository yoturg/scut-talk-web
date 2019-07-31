<template>
  <div class='group-sub-search-form'>
    <div> 小组名字
      <input v-model='groupname' status='info'>
    </div>
    <div> 作业题目
      <input v-model='subjectTitle' :title='subjectTitle' disabled>
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
  created () {
    if (this.$route.params.type === 'GROUP_SUB') {
      this.subjectTitle = this.$route.params.title
      // console.log('GROUP_SUB111:' + this.subjectTitle)
    } else if (window.localStorage.getItem('cacheTitle') !== '') {
      this.subjectTitle = window.localStorage.getItem('cacheTitle')
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
  .group-sub-search-form
    font-size :16px
    width: 100%
    height: 30px
    margin :15px 0
    display: flex
    justify-content :space-around
    align-items: center

  .group-sub-search-form div input
    width: 150px
    height: 30px
    margin-left :5px
    border: 1px solid #e1e1e1
    border-radius: 3px
    padding-left 5px

  .group-sub-search-form
    div:nth-child(2)
      input
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        padding-left 5px
</style>
