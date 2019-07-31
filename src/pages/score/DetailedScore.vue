<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <div class="detail-header">
        <h1>{{groupname}}</h1>
        <div class="underline"></div>
      </div>
      <div class="detail-body">
        <div class="body-title">
          <h2>{{subTitle}}</h2>
          <ul>
            <li @click="backScore">返回</li>
          </ul>
        </div>
        <!-- {{infoList}} -->
        <ul class="content" v-if="numType === 3" >
          <li v-for="(item, index) in infoList" :key="index">
            <div class="createDate">{{item.createDate}}</div>
            <div class="postContent">{{item.post.content}}</div>
          </li>
        </ul>
        <ul class="content" v-if="numType === 0" >
          <li v-for="(item, index) in infoList" :key="index">
            <div class="createDate">{{item.createDate}}</div>
            <div class="postContent">{{item.card.title}}</div>
          </li>
        </ul>
        <ul class="content" v-if="numType === 2" >
          <li v-for="(item, index) in infoList" :key="index">
            <div class="createDate">{{item.createDate}}</div>
            <ul class="postContent">
              <li v-for="(item, index) in JSON.parse(item.post.imageURLs)" :key="index">
                <img :src="item">
              </li>
            </ul>
          </li>
        </ul>
          <!-- <div v-for="(item, index) in infoList" :key="index">
            {{item.createDate}}
            {{item.card.title}}
          </div> -->
          <!-- <div v-for="(item, index) in infoList" :key="index">
            {{item.createDate}}
          </div> -->
      </div>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
export default {
  name: 'detailed-score',
  data () {
    let typeMap = {
      'cardNum': {index: 0, name: '新建卡片详情', resultKey: 'cardInfo'},
      'imageNum': {index: 2, name: '发表图片详情', resultKey: 'imageInfo'},
      'postNum': {index: 3, name: '发表评论详情', resultKey: 'postInfo'}
    }
    return {
      typeMap,
      infoList: []
    }
  },
  methods: {
    findNumInfo () {
      let param = {}
      param.userkey = localStorage.getItem('userkey')
      param.teamId = window.localStorage.scoreGroupId
      param.userId = this.$route.params.rowData.id
      param.numType = this.typeMap[this.field].index
      param.time = new Date().getTime()
      this.axios.get('/Martell/a/team/subjectAPI/interface/findNumInfo', {params: param}).then(response => {
        // console.log('get请求', JSON.stringify(response))
        if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else if (response.data.resultMap) {
          this.infoList = response.data.resultMap[ this.typeMap[this.field].resultKey ]
        }
      })
    },
    backScore () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.findNumInfo()
  },
  computed: {
    groupname () {
      return this.$route.params.rowData.userName
    },
    subTitle () {
      return this.typeMap[this.field].name
    },
    field () {
      return this.$route.params.field
    },
    numType () {
      return this.typeMap[this.field].index
    }
  },
  watch: {
    infoList () {
      // console.log(this.infoList)
    }
  }
}
</script>

<style lang="stylus" scoped>
  h1
    font-size: 21px
  h2
    font-size: 16px
    font-weight: normal
  h3
    height: 52px
    margin-left: 102px
    line-height 52px
    font-size: 13px
    font-weight: normal
  p
    font-size: 13px
  .container
    background: #f4f4f4
    .detail-header
      width: 100%
      height: 47px
      margin-bottom: 14px
      position: relative
      h1
        position: absolute
        bottom: 0
        left: 46px
      p
        position: absolute
        bottom: 0
        left: 105px
      .underline
        width: 70px
        border: 2px solid #15a1e9
        position: absolute
        bottom: -14px
        left: 40px
    .detail-body
      .body-title
        width: 900px
        height: 81px
        margin: 8px auto 0 auto
        border-bottom: 2px solid #cccccc
        h2
          line-height: 81px
          float: left
        ul
          text-align: right
          line-height: 81px
          li
            display: inline-block
            width: 90px
            height: 30px
            line-height: 30px
            margin-left: 24px
            background: #fff
            text-align: center
            color: #15a1e9
            border: 1px solid #15a1e9
            border-radius: 3px
            &:hover
              background: #3fb2eb
              color: #fffdff
      .content
        width: 800px
        margin: 10px auto
        padding: 10px
        background: #fff
        .createDate
          background: #eee
          display: inline-block
        .postContent
          padding-left: 20px
          margin-top: 5px
          li
            width: 400px
            line-height 250px
            margin: 0 auto
            img
              vertical-align: middle
              width: 400px
</style>
