<template>
  <div class="tem-header">
    <div class="tem-title">垃圾箱</div>
    <div class="operation">
      <div class="operation-right-btn">
        <button class="g_button" @click="clearBtn">清空</button>
        <button class="g_button" @click="backBtn">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default {
  methods: {
    backBtn () {
      this.$router.go(-1)
    },
    clearBtn () {
      if (confirm('请问是否确定清空？')) {
        this.axios.delete(`/Martell/a/team/teamAPI/interface/delTeamFromDustbin/${window.localStorage.getItem('userId')}&?userkey=${localStorage.getItem('userkey')}`).then(response => {
          if (Number(response.data.statusCode) === 200) {
            alert(response.data.message)
            eventBus.$emit('flushTrashData')
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else if (Number(response.data.statusCode) === 400) {
            alert(response.data.message)
          } else {
            alert('系统异常')
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/styles/varibles.styl'
.tem-header
  margin :10px 27px
  .tem-title
    width:auto
    display:inline-block !important
    display:inline
    font-size:1.3rem
    padding:0.4rem
    border-bottom:.2rem solid themeColor
  .operation
    height :45px
    margin:1rem 2rem 2rem 1rem
    border-bottom:2px solid #b9bcbd
    .operation-right-btn
      float: right
      display: inline-block
</style>
