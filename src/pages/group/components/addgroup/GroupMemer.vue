<template>
  <div id="member-div">
    <span>组员&nbsp;</span>
    <member-tree></member-tree>
    <oper-btn></oper-btn>
    <member-list @getMember = "getMember"></member-list>
  </div>
</template>

<script>
import MemberTree from './MemberTree'
import OperBtn from './OperBtn'
import MemberList from './MemberList'
// import { eventBus } from '@/util/eventBus'
export default {
  data () {
    return {
      memberArr: ''
      // subId: ''
    }
  },
  components: {
    MemberTree,
    OperBtn,
    MemberList
  },
  methods: {
    getMember: function (data) {
      this.memberArr = data
    }
  }
}
</script>

<style lang="stylus" scoped>
  #member-div
    height 30%
    margin 0 95px 0 105px
    display flex
    justify-content space-between
</style>
