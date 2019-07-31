<template>
  <div class="card-content">
    <div class="content-header">
      <ul>
        <li class="g_button" @click="bodychange">{{bodyChangeValue}}</li>
        <li class="g_button" @click="freshen">刷新</li>
      </ul>
    </div>
    <card-content-body
      v-if="isCardContentBody"
      :cardContentData="cardContentData"
      @addSuccess="getCardContentData"></card-content-body>
    <card-content-file-list v-if="!isCardContentBody" :cardId="cardId"></card-content-file-list>
  </div>
</template>

<script>
import CardContentBody from './CardContentBody'
import CardContentFileList from './CardContentFileList'
export default {
  name: 'CardContent',
  props: ['cardId'],
  components: {
    CardContentBody,
    CardContentFileList
  },
  data () {
    return {
      bodyChangeValue: '文件列表',
      isCardContentBody: true,
      cardContentData: {}
    }
  },
  methods: {
    freshen () {
      this.$router.go(0)
    },
    bodychange () {
      this.isCardContentBody = !this.isCardContentBody
      this.bodyChangeValue = this.isCardContentBody ? '文件列表' : '讨论页'
    },
    getCardContentData () {
      this.axios.get('/Martell/a/team/replieAPI/interface/getAllPostsAndReplieByCard', {params: {'userkey': localStorage.userkey, 'cardId': this.cardId, 'time': new Date().getTime()}}).then((response) => {
        if (Number(response.data.statusCode) === 200) {
          if (response.data.resultMap) {
            this.cardContentData = response.data.resultMap.postAndReplie
          } else {
            this.cardContentData = {}
          }
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    }
  },
  watch: {
    cardId () {
      if (this.cardId !== '') {
        this.getCardContentData()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  listHeaderHeight = 55px
  cardBodyHeight = 627px
  .card-content
      width: 775px
      height: 100%
      float: left
      background: #f4f4f4
      .content-header
        height: listHeaderHeight
        background: #f4f4f4
        ul
          li
            // width: 90px
            // height: h = 30px
            // line-height: h
            // text-align: center
            margin-top: 13.5px
            // margin-left: 18px
            // border: 1px solid #3fb2eb
            // border-radius: 3px
            // display: inline-block
            // color: #15a2e9
            // background: #fff
            // &:hover
            //   background: #3fb2eb
            //   color: #fffdff
</style>
