import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faHome, 
  faUser, 
  faSignOutAlt,
  faSearch,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faHome, faUser, faSignOutAlt, faSearch, faSpinner)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.mount('#app')
  })
} else {
  app.mount('#app')
}