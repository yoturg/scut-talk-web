<template>
  <div class='center'>
    <div class='operation'>
        <button @click='add'>添加</button><br>
        <button>删除</button><br>
        {{student}}
    </div>
  </div>
</template>

<script>
import bus from '../../../assets/eventBus'
export default {
  data () {
    return {
      student: ''
    }
  },
  /* created:function(){
       this.add();
  }, */
  /* mounted() {
    var self = this
    bus.$on('student', function (student)  {
      self.student = student
      console.log('middleChild---' + student)
    })
  }, */
  methods: {
    add () {
      bus.$on('student', function (student) {
        self.student = student
        // console.log('groupOperation----middleChild-fromMethods--' + student)
        bus.$emit('studentToNewMenu', student)
        // console.log('test')
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
.center
    height:300px
    float:left
    vertical-align: middle
    button
      width: 90px
      height: 30px
      line-height: 30px
      border: 1px solid #3fb2eb
      border-radius: 3px
      display: inline-block
      background: #fff
      margin:1rem 18px
    .operation
      vertical-align: middle
      margin:3rem auto
</style>
