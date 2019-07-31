<template>
  <div class="score-search">
    <div v-show="false">
      建组人<input type="text" v-model="gcreator">
    </div>
    <div>
      作业题目<input type="text" v-model="subName">
    </div>
    <button class="g_button" @click="searchBtn">查询</button>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default {
  name: 'score-search',
  data () {
    return {
      gcreator: '',
      subName: ''
    }
  },
  methods: {
    searchBtn () {
      eventBus.$emit('scoreSearch', {'gcreator': this.gcreator, 'subName': this.subName})
    }
  }
}
</script>

<style lang='stylus' scoped>
.score-search
  font-size :16px
  height: 30px
  margin: 20px 40px
  display: flex
  justify-content: space-between
  align-items: center

.score-search>div>input
  width: 200px
  height: 30px
  margin-left :5px
  border: 1px solid #e1e1e1
  border-radius: 3px
  padding-left 5px

</style>
