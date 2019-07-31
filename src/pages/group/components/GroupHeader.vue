<template>
  <div class="header-title">
    <div class="title"><span>{{title}}</span></div>
    <div class="group-operation">
      <div class="operation-name">
        <div v-if="opeType == 'GROUP'">
          <!-- <button @click="addGroupBtn">新建分组</button> -->
          <button class="g_button" @click="trashBtn">垃圾箱</button>
          <button class="g_button" @click="backBtn">返回</button>
        </div>
        <div v-else-if="opeType == 'JOINGROUP'">
          <button class="g_button" @click="backBtn">返回</button>
        </div>
        <div v-else-if="opeType == 'ADDGROUP'">
          <button class="g_button" @click="addSaveBtn" :disabled="isDisabled" :style="addOper">保存</button>
          <button class="g_button" @click="backBtn">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default {
  props: ['title', 'opeType'],
  components: {
    eventBus
  },
  data () {
    return {
      isDisabled: false
    }
  },
  computed: {
    addOper () {
      return this.isDisabled ? { color: '#FFFFFF', background: '#D3D3D3', cursor: 'default' } : {}
    }
  },
  methods: {
    backBtn () {
      window.localStorage.setItem('handleGroup', '')
      window.localStorage.setItem('editStorageGroupId', '')
      this.$router.go(-1)
    },
    trashBtn () {
      this.$router.push({name: 'Trashd'})
    },
    addSaveBtn () {
      if (!this.isDisabled) {
        this.isDisabled = true
        eventBus.$emit('ADDGROUP')
      }
    },
    addGroupBtn () {
      window.localStorage.setItem('handleGroup', 'ADD')
      this.$router.push({name: 'AddGroup'})
    }
  },
  mounted () {
    eventBus.$on('setSaveGroupBtn', () => {
      this.isDisabled = false
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/styles/varibles.styl'
.header-title
  .title
    margin-top: 20px
    margin-left: 60px
    span
      width:auto
      font-size: 23px
      padding-bottom 5px
      border-bottom: 5px solid themeColor
  .group-operation
    display: flex
    justify-content: flex-end
    margin:0 95px
    border-bottom: 2px solid #cccccc
    div
      display: flex
      margin:15px 0px 10px 15px
      // button
      //   display: flex
      //   align-items: center
      //   width: 90px
      //   height: 30px
      //   margin-left: 10px
      //   line-height: 30px
      //   color: #3fb2eb
      //   border:1px solid #3fb2eb
      //   border-radius: 3px
      //   display: inline-block
      //   background: #fff
      //   &:hover {
      //     cursor:pointer
      //     color :#fff
      //     background-color :#14a1e9
      //   }
      //   &:focus {
      //     outline: none;
      //   }
</style>
