<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <card-header :groupname="groupname"></card-header>
      <card-body :teamId="groupId"></card-body>
    </page-body>
    <image-shower></image-shower>
    <page-footer></page-footer>
  </div>
</template>

<script>
import CardHeader from './components/CardHeader'
import CardBody from './components/CardBody'
import ImageShower from './components/ImageShower'
export default {
  name: 'Card',
  components: {
    CardHeader,
    CardBody,
    ImageShower
  },
  data () {
    return {
    }
  },
  computed: {
    groupId () {
      if (window.localStorage.groupId) {
        return window.localStorage.groupId
      } else {
        this.$router.go(-1)
      }
    },
    groupname () {
      if (window.localStorage.groupname) {
        return window.localStorage.groupname
      } else {
        this.$router.go(-1)
      }
    }
  },
  mounted () {
    if (this.$route.params && JSON.stringify(this.$route.params) !== '{}') {
      window.localStorage.setItem('groupId', this.$route.params.rowData.groupId)
      window.localStorage.setItem('groupname', this.$route.params.rowData.groupname)
      window.localStorage.setItem('subtitle', this.$route.params.rowData.subtitle)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .container
    background: #f4f4f4
</style>
