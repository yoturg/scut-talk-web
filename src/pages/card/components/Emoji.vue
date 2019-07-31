<template>
  <div class="emoji" v-if="isShowEmoji">
    <ul class="emoji-controller">
      <li
        v-for="(pannel,index) in pannels"
        @click="changeActive(index)"
        :key="index"
        :class="{'active': index === activeIndex}">{{ pannel }}</li>
    </ul>
    <ul class="emoji-container">
      <li
        v-for="(emojiGroup, index, key) in emojiData"
        :key="key"
        v-if="key === activeIndex"
        >
        <a
          href="javascript:;"
          v-for="(index, emoji) in emojiGroup"
          :key="index"
          @click="selectItem(emoji)">
           <span
              class="emoji-item"
              :title="emoji"
              :class="'sprite-' + getPureName(emoji)"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import emojiData from '../../../data/emoji-data.js'
export default {
  name: 'Emoji',
  props: {
    isShowEmoji: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      emojiData,
      pannels: ['表情', '自然', '物品', '地点', '符号'],
      activeIndex: 0
    }
  },
  methods: {
    changeActive (index) {
      this.activeIndex = index
    },
    getPureName (name) {
      return name.replace(/:/g, '')
    },
    selectItem (emoji) {
      this.$emit('emojiClick', emoji)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/scss/emoji-sprite.scss'
  emojiHeight = 200px
  .emoji
    height emojiHeight
    width 400px
    background #fff
    border: 1px solid #b9c4d4
    border-radius: 4px
    position absolute
    overflow hidden
    top -(emojiHeight)
    .emoji-controller
      width 100%
      li
        width 20%
        line-height 40px
        text-align center
        display inline-block
        cursor: pointer
      .active
        border-bottom 1px solid #2f7fd7
    .emoji-container
      height: emojiHeight - 55px
      overflow-y: auto
      li
        height: emojiHeight - 55px
        padding: 10px 10px 0 10px
        a
          display: block
          float: left
          &:hover
            background-color: #d8d8d8
            border-color: #d8d8d8
          span
            width: 25px
            height: 25px
            display: inline-block
            border: 1px solid transparent
            cursor: pointer
</style>
