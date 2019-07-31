import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      // component: Login
      component: resolve => require(['@/pages/login/Login.vue'], resolve)
    },
    {
      path: '/home',
      name: 'Home',
      // component: Home
      component: resolve => require(['@/pages/home/Home.vue'], resolve)
    },
    {
      path: '/card',
      name: 'Card',
      // component: Card
      component: resolve => require(['@/pages/card/card.vue'], resolve)
    },
    {
      path: '/group',
      name: 'Group',
      // component: Group
      component: resolve => require(['@/pages/group/Group.vue'], resolve)
    },
    {
      path: '/trashd',
      name: 'Trashd',
      // component: Trashd
      component: resolve => require(['@/pages/trashd/Trashd.vue'], resolve)
    },
    {
      path: '/joinGroup',
      name: 'JoinGroup',
      // component: JoinGroup
      component: resolve => require(['@/pages/group/joinGroup.vue'], resolve)
    },
    {
      path: '/addGroup',
      name: 'AddGroup',
      // component: AddGroup
      component: resolve => require(['@/pages/group/addGroup.vue'], resolve)
    },
    {
      path: '/groupSub',
      name: 'GroupSub',
      // component: GroupSub
      component: resolve => require(['@/pages/group/GroupSub.vue'], resolve)
    },
    {
      path: '/information',
      name: 'Information',
      // component: Information
      component: resolve => require(['@/pages/information/Information.vue'], resolve)
    },
    {
      path: '/homeworkList',
      name: 'homeworkList',
      // component: homeworkList
      component: resolve => require(['@/pages/homeWork/homeworkList.vue'], resolve)
    },
    {
      path: '/score',
      name: 'Score',
      // component: Score
      component: resolve => require(['@/pages/score/Score.vue'], resolve)
    },
    {
      path: '/scoreRule',
      name: 'ScoreRule',
      // component: ScoreRule
      component: resolve => require(['@/pages/score/ScoreRule.vue'], resolve)
    },
    {
      path: '/jobSubmission',
      name: 'JobSubmission',
      // component: JobSubmission
      component: resolve => require(['@/pages/card/JobSubmission.vue'], resolve)
    },
    {
      path: '/addhomework',
      name: 'addhomework',
      // component: addhomework
      component: resolve => require(['@/pages/homeWork/addhomework.vue'], resolve)
    },
    {
      path: '/personalScore',
      name: 'PersonalScore',
      // component: PersonalScore
      component: resolve => require(['@/pages/personalScore/PersonalScore.vue'], resolve)
    },
    {
      path: '/createNewCard',
      name: 'CreateNewCard',
      // component: CreateNewCard
      component: resolve => require(['@/pages/card/CreateNewCard.vue'], resolve)
    },
    {
      path: '/detailedScore',
      name: 'DetailedScore',
      // component: DetailedScore
      component: resolve => require(['@/pages/score/DetailedScore.vue'], resolve)
    }
  ]
})
