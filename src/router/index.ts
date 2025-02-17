import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: defineAsyncComponent(() => 
        import('../components/ExploreView.vue')
      )
    },
    {
      path: '/login',
      component: defineAsyncComponent(() => 
        import('../components/LoginForm.vue')
      )
    },
    {
      path: '/apartments',
      component: defineAsyncComponent(() => 
        import('../components/ApartmentList.vue')
      )
    }
  ]
})

export default router