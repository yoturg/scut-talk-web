<template>
  <div class="title">
    <div class="work-operation">
      <button class="newWork g_button" @click="addHomework">新建题目</button>
      <button class="refresh g_button" @click="backBtn">返回</button>
    </div>
    <div class="search">
      <div class="search-title">作业题目&ensp;
      <input type="text" v-model='title'/>
      </div>
      <button class="g_button" @click="searchTitle">查询</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: ''
    }
  },
  methods: {
    backBtn () {
      this.$router.go(-1)
    },
    addHomework () {
      window.localStorage.setItem('workContentStatus', 'ADD')
      this.$router.push({name: 'addhomework'})
    },
    searchTitle () {
      // this.$emit('getTitle', this.title)
      this.$parent.searchTitle(this.title)
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  margin: 10px auto
  .work-operation
    display: flex
    justify-content: flex-end
    border-bottom: 2px solid #b9bcbd
    button
      margin: 10px 7px
      outline: none
  .search
    display: flex
    justify-content: space-between
    align-items: center
    .search-title
      display: flex
      width: auto
      align-items: center
    input
      height: 30px
      border-radius: 3px
      border: 1px solid #e1e1e1
      padding-left 5px
    button
      margin: 10px 7px
</style>
