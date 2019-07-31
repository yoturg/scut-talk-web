<template>
  <div class="card-body">
    <card-list
      :cardLists="lists"
      @cardClick="idChange"
      @cardListFreshenClick="cardListFreshen"
      @deleteCard="cardListFreshen"
      @receiveCard="cardListFreshen"
    ></card-list>
    <card-content :cardId="cardId"></card-content>
  </div>
</template>

<script>
import CardList from './CardList'
import CardContent from './CardContent'
export default {
  name: 'card-body',
  props: ['teamId'],
  components: {
    CardList,
    CardContent
  },
  data () {
    return {
      lists: {},
      cardId: ''
    }
  },
  methods: {
    idChange (index) {
      window.localStorage.setItem('cardId', index)
      this.cardId = index
    },
    getCardData () {
      // console.log(this.teamId)
      this.axios.get('/Martell/a/team/cardAPI/interface/findCardInfoByTeamId', {params: {'userkey': localStorage.userkey, 'teamId': this.teamId, 'time': new Date().getTime()}}).then((response) => {
        if (Number(response.status) === 200) {
          this.lists = response.data.resultMap
          this.cardId = response.data.resultMap.cards[0].id
          window.localStorage.setItem('cardId', this.cardId)
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      }).catch(function (response) {
        console.log('err:' + response)
        alert('服务器异常')
      })
    },
    cardListFreshen () {
      this.getCardData()
    }
  },
  mounted: function () {
    this.getCardData()
  }
}
</script>

<style lang="stylus" scoped>
  listHeaderHeight = 55px
  cardBodyHeight = 627px
  .card-body
    margin: 0 11px
    height: cardBodyHeight
</style>
