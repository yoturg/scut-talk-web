<template>
  <div class="container">
    <page-header :isSelect="true" :hideRed='true'></page-header>
    <page-body>
      <inform-head></inform-head>
      <inform-notice></inform-notice>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import informHead from './components/informHead'
import informNotice from './components/informNotice'
export default {
  name: 'Information',
  components: {
    informHead,
    informNotice
  }
}
</script>
