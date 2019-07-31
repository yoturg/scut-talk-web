<template>
    <div class="inform-notice">
        <div id='notice-head'>消息通知</div>
        <div id='notice-content'>
          <div id='notice-new-message'>
            <div class='notice-content-list-new' v-for="(item, index) in infoData" :key="index" >
              <div class="notice-content-message">
                  <span>{{item.userName}}{{item.operContent}}</span>
                  <!-- <span>2018/5/12&ensp;&ensp;&ensp;13:00:00</span> -->
                  <span>{{item.time}}</span>
              </div>
              <div>
                <button @click="agreeBtn(item.userId,item.teamId,item.applyType)">同意</button>
                <button @click="refuseBtn(item.userId,item.teamId,item.applyType)">拒绝</button>
              </div>
            </div>
          </div>
          <div id='notice-old-message' v-show='false'>
            <div class='notice-content-list-old'>
              <div class="notice-content-message">
                  <span>xxx申请加入小组xxxx</span>
                  <span>2018/5/12&ensp;&ensp;&ensp;&ensp;13:00:00</span>
              </div>
              <div>
                拒绝
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'inform-notice',
  data () {
    return {
      userName: '',
      operContent: '',
      infoData: []
    }
  },
  methods: {
    agreeBtn (userId, teamId, aType) {
      // console.log('同意:' + userId + ',teamId:' + teamId)
      this.handleRequest(userId, teamId, 0, aType)
    },
    refuseBtn (userId, teamId, aType) {
      // console.log('拒绝:' + userId + ',teamId:' + teamId)
      this.handleRequest(userId, teamId, 1, aType)
    },
    handleRequest (userId, teamId, type, applyType) {
      // console.log('u:' + userId + ',t:' + teamId + ',type:' + type + ',applyType:' + applyType)
      this.axios.put('/Martell/a/team/teamAPI/interface/agreeJoinOrQuitTeam/' + userId + '&' + teamId + '&' + type + '&' + applyType + (applyType === 'bJoin' ? window.localStorage.getItem('userId') : '') + '?userkey=' + localStorage.getItem('userkey')).then(response => {
        // console.log('通知处理:' + JSON.stringify(response))
        if (response.data.statusCode === '200') {
          alert(response.data.message)
          this.infoData.splice(0, this.infoData.length)
          this.handleGetRequest()
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          alert(response.data.message)
        }
      })
    },
    handleData (data, type, oldData) {
      var infoDataArr = []
      var str = ''
      switch (type) {
        case 1 :
          str = ' 申请加入 '
          break
        case 2 :
          str = ' 申请退出 '
          break
        case 3 :
          str = ' 邀请你加入 '
          break
        default :
          break
      }
      if (data.length > 0) {
        for (var i in data) {
          var obj = {}
          obj.userName = data[i].userName
          obj.userId = data[i].userId
          obj.teamName = data[i].teamName
          obj.teamId = data[i].teamId
          obj.operContent = str + data[i].teamName
          obj.time = data[i].time
          switch (type) {
            case 1 :
              obj.applyType = 'add'
              break
            case 2 :
              obj.applyType = 'quit'
              break
            case 3 :
              obj.applyType = 'bJoin'
              break
            default :
              break
          }
          oldData !== undefined ? oldData.push(obj) : infoDataArr.push(obj)
        }
      }
      return oldData || infoDataArr
    },
    handleGetRequest () {
      this.axios.get('/Martell/a/team/teamAPI/interface/joinAndQuitTeamList?userkey=' + localStorage.getItem('userkey') + '&userId=' + window.localStorage.getItem('userId') + '&time=' + new Date().getTime()).then(response => {
        var joinDataArr = []
        var refuseDataArr = []
        var invitedDataArr = []
        // console.log('获取通知:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          if (response.data.resultMap) {
            joinDataArr = response.data.resultMap.joinJson ? response.data.resultMap.joinJson.join : ''
            this.infoData = this.handleData(joinDataArr, 1)
            refuseDataArr = response.data.resultMap.quitJson ? response.data.resultMap.quitJson.quit : ''
            this.infoData = this.handleData(refuseDataArr, 2, this.infoData)
            invitedDataArr = response.data.resultMap.beInvitedJoin ? response.data.resultMap.beInvitedJoin.beInvitedJoin : ''
            this.infoData = this.handleData(invitedDataArr, 3, this.infoData)
            // console.log('数据：' + JSON.stringify(this.infoData))
          } else {
            console.log('没有加入或者退出的通知信息')
          }
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    }
  },
  created () {
    this.handleGetRequest()
  }
}
</script>

<style lang='stylus' scoped>
.inform-notice
  width 90%
  margin 0 auto
  height 200px
  #notice-head
    height 45px
    line-height 45px
    font-size 18px
    font-weight 550
    font-family '微软雅黑'
  #notice-content
    width 100%
    height 300px
    background-color white
    overflow-y auto
  #notice-new-message,#notice-old-message{
    width: 96%;
    margin-left: 2%;
    height: auto;
    margin-top: 10px;
  }
  #notice-new-message{
    padding-bottom 10px
    border-bottom: 0px solid #e1e1e1;
  }
  .notice-content-list-new,.notice-content-list-old{
    width: 100%;
    height 50px;
    display: flex;
    align-items: center;
    justify-content:space-between;
  }
  .notice-content-message>span{
    display: block;
    display: flex;
    align-items: center;
  }
  .notice-content-message>span:first-child{
    height: 30px;
    font-size: 16px;
    color: rgb(20,163,223);
  }
  .notice-content-message>span:last-child{
    font-size: 12px;
    height: 25px;
    color: gray;
  }
  .notice-content-message+div>button{
    width: 90px;
    height: 30px;
    background-color: white;
    border 1px solid #47a1e3;
    color: #47a1e3;
    font-size: 15px;
    border-radius: 5px;
    margin-left: 20px;
  }
  .notice-content-message+div>button:hover{
    color: white;
    background-color: #47a1e3;
  }
  .notice-content-message+div>button:focus{
    outline none
  }
</style>
