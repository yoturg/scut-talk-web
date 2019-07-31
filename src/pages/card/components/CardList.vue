<template>
  <div class="card-list">
    <div class="list-header">
      <p>卡片数：{{cardLists.cardNumber}} 小组人数：{{cardLists.teamPeopleNumber}}</p>
      <div class="freshen"><a href="javascript:;" :click="freshenHandle"></a></div>

    </div>

    <div class="list-content">
      <!-- <happy-scroll color="rgba(203,203,203)" size="8" resize> -->
        <ul>
          <li
            v-for="(item, index) in cardLists.cards"
            :key="item.id"
            @click="cardHandle(item.id, index)"
            :class="{active: index === activeIndex}"
          >
            <div class="deleteIcon" @click.stop="deleteCard(item.id)"></div>
            <h3>{{item.title}}</h3>
            <p>{{item.updateDate}}</p>
            <div v-if="item.receiveType == 1">负责人 {{item.dutyByName}}</div>
            <div v-if="item.receiveType == 0">待领取 <button class="receiveTheCard" @click.stop="receiveCard(item.id)">领取卡片</button></div>
          </li>
        </ul>
      <!-- </happy-scroll> -->
    </div>

  </div>
</template>

<script>

export default {
  name: 'CardList',
  props: ['cardLists'],
  data () {
    return {
      activeIndex: 0
    }
  },
  components: {
  },
  methods: {
    receiveCard (cardId) {
      // console.log(cardId)
      let putRUL = `/Martell/a/team/cardAPI/interface/receiveCard?userId=${window.localStorage.userId}&cardId=${cardId}&userkey=${localStorage.userkey}`
      this.axios.put(putRUL).then(response => {
        if (Number(response.data.statusCode) === 200) {
          this.$emit('receiveCard')
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          alert(response.data.message)
        }
      })
    },
    cardHandle (cardId, index) {
      this.activeIndex = index
      this.$emit('cardClick', cardId)
    },
    freshenHandle () {
      this.$emit('cardListFreshenClick')
    },
    deleteCard (index) {
      // console.log(window.localStorage)
      let param = {}
      param.userkey = localStorage.userkey
      param.id = index
      if (window.localStorage.groupId) {
        param.teamId = window.localStorage.groupId
      } else {
        alert('请重新登录')
      }
      if (window.localStorage.userId) {
        param.userId = window.localStorage.userId
      } else {
        alert('请重新登录')
      }
      this.axios.delete('/Martell/a/team/cardAPI/interface/deleteCardById', {params: param}).then((response) => {
        // console.log(response)
        if (Number(response.data.statusCode) === 200) {
          this.$emit('deleteCard')
        } else {
          alert(response.data.message)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  listHeaderHeight = 55px
  cardBodyHeight = 627px
  .card-list
    width: 263px
    height: 100%
    margin-left: 19px
    float: left
    .list-header
      height: listHeaderHeight
      font-size: 15px
      color: #666666
      background: #f4f4f4
      p
        float: left
        height: listHeaderHeight
        line-height: listHeaderHeight
      .freshen
        width: 55px
        height: 55px
        background: url('../../../../static/cardImage/freshen.png') no-repeat 50% 50%
        background-size: 33px 33px
        float: right
    .list-content
      height: cardBodyHeight - 55
      // overflow: hidden
      overflow-x hidden
      overflow-y scroll
      position: relative
      ul
        li
          width: 239px
          height: 100px
          margin-bottom: 15px
          padding: 12px 13px
          background: #fff
          border: 1px solid #999999
          border-radius: 3px
          position: relative
          h3
            font-size: 16.5px
            font-weight: normal
            height: 26px
            border-bottom: 2px solid #ccc
            color: #343434
          p
            font-size: 12px
            color: #666
            height: h = 30px
            line-height: h
          div
            font-size: 13px
            color: #666
          .deleteIcon
            position: absolute
            width: 23px
            height: 23px
            background: url(../../../../static/cardImage/deleteIcon.png) no-repeat 50% 50%
            background-size: 22px 22px
            right: 10px
            top: 5px
          &:hover
            .deleteIcon
              position: absolute
              width: 23px
              height: 23px
              background: url(../../../../static/cardImage/deleteIconClick.png) no-repeat 50% 50%
              background-size: 22px 22px
              right: 10px
              top: 5px
          .receiveTheCard
            height: 20px
            background: #fff
            border: 1px solid #3fb2eb
            border-radius: 3px
            color: #15a2e9
            background: #fff
            &:hover
              background: #3fb2eb
              color: #fffdff
        .active
          border: 1px solid #3fb2eb
</style>
