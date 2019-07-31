<template>
  <div class="container">
    <!-- <page-header></page-header> -->
    <div class="login-body">
      <login-form></login-form>
    </div>
    <!-- <page-footer></page-footer> -->
  </div>
</template>

<script>
import LoginForm from './components/LoginForm'
export default {
  name: 'Login',
  components: {
    LoginForm
  }
}
</script>

<style lang="stylus" scoped>
  .container
    background url('./img/background_pic2.jpg') no-repeat fixed top
    background-size cover
  .login-body
    width: 1080px
    height  790px
    margin 0 auto
    position: relative
</style>
