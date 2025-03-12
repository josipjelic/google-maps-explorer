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
    },

    {
      path: '/admin',
      component: defineAsyncComponent(() => 
        import('../components/layout/AdminLayout.vue')
      ),
      children: [
        {
          path: 'apartments',
          component: defineAsyncComponent(() => 
            import('../components/admin/ApartmentsList.vue')
          )
        },
        {
          path: 'apartments/new',
          component: defineAsyncComponent(() => 
            import('../components/admin/ApartmentForm.vue')
          )
        },
        {
          path: 'apartments/:id/edit',
          component: defineAsyncComponent(() => 
            import('../components/admin/ApartmentForm.vue')
          )
        },
        {
          path: 'apartments/create',
          component: defineAsyncComponent(() => 
            import('../components/admin/ApartmentForm.vue')
          )
        },
        {
          path: 'apartments/:id/edit',
          component: defineAsyncComponent(() => 
            import('../components/admin/ApartmentForm.vue')
          )
        }
      ]
    }
  ]
})

export default router