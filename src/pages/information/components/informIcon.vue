<template>
    <div class="inform-icon">
        <div id='icon-img'>
          <img :src="icon" alt="图片加载异常">
        </div>
        <div id='icon-select'>
          <input type="button" value="选择图片">
          <input type="button" value="上传" @click="confirnImg">
          <input type="file" @change="changeIcon" id='icon-select-img' @mousemove="changeColorMove" @mouseleave="changColorLeave" accept="image/png,image/gif,image/jpeg" multiple>
        </div>
    </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
export default {
  name: 'inform-icon',
  data () {
    return {
      icon: '',
      iconUrl: ''
    }
  },
  computed: {
    getUserIcon: function () {
      return window.localStorage.getItem('userIconUrl')
    }
  },
  created () {
    this.icon = this.getUserIcon
  },
  methods: {
    changeIcon () {
      var file = document.getElementById('icon-select-img').files[0]
      if (file !== undefined) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.icon = e.target.result
        }
      }
    },
    confirnImg () {
      var data = new FormData()
      data.append('files', document.getElementById('icon-select-img').files)
      var files = document.getElementById('icon-select-img').files
      for (var i = 0; i < Object.keys(files).length; i++) {
        data.append('files', files[i])
      }
      data.append('userkey', localStorage.getItem('userkey'))
      this.axios.post('/Martell/a/thirdparty/aliAPI/interface/upload', data, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
          // console.log('122323:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            // this.$store.dispatch('setUserIcon', this.icon)
            this.iconUrl = response.data.resultMap.imageURLs[0]
            window.localStorage.setItem('userIconUrl', this.iconUrl)
            eventBus.$emit('editInfo')
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert('上传失败')
          }
        })
    },
    changeColorMove () {
      var getButton = document.getElementsByTagName('input')[0]
      getButton.style.color = 'white'
      getButton.style.backgroundColor = 'rgb(20,163,223)'
    },
    changColorLeave () {
      var getButton = document.getElementsByTagName('input')[0]
      getButton.style.color = 'rgb(20,163,223)'
      getButton.style.backgroundColor = 'white'
    }
  }
}
</script>

<style>
  .inform-icon{
    width: 200px;
  }
  #icon-img{
    margin: 8px auto;
  }
  #icon-img,#icon-img>img{
    width: 135px;
    height: 135px;
    border-radius: 50%;
  }
  #icon-select{
    width: 190px;
    height: 35px;
    margin: 17px auto;
    display: grid;
    display: -ms-grid;
    column-span: 10px;
    -ms-grid-column-span: 10px;
    grid-template-columns: 1fr 1fr;
    -ms-grid-columns: 100px auto;
    /* grid-template-areas: "select confirm" */
  }
  #icon-select>input{
    width: 90px;
    height: 30px;
    background-color: white;
    border: 1px solid #47a1e3;
    color: #47a1e3;
    font-size: 15px;
    border-radius: 5px;
    margin-right: 5px;
  }
  #icon-select>input:hover{
    background-color: #47a1e3;
    color: white;
  }
  #icon-select>input:first-child{
    /* grid-area: select; */
    grid-area: 1 / 1 / 2 / 2;
    -ms-grid-row:1;
    -ms-grid-column:1;
  }
  #icon-select>input:nth-child(2){
    /* grid-area: confirm; */
    grid-area: 1 / 3 / 2 / 4;
    -ms-grid-row:1;
    -ms-grid-column:2;
  }
   #icon-select>input:nth-child(2):focus{
    outline: none
   }
  #icon-select>input:last-child{
    /* grid-area: select; */
    grid-area: 1 / 1 / 3 / 4;
    -ms-grid-row:1;
    z-index: 99;
    opacity: 0;
  }
</style>
