<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signOut } = useAuth()

const handleLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  await signOut()
  router.push('/login')
}
</script>

<template>
  <nav class="navigation">
    <div class="nav-content">
      <router-link to="/" class="logo">
        <font-awesome-icon icon="home" class="logo-icon" />
        <span class="logo-text">HomeFinder</span>
      </router-link>
      
      <div class="nav-actions">
        <button @click="handleLogin" class="login-button">
          <font-awesome-icon icon="user" class="icon" />
          Sign In
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
  color: #646cff;
}

.logo-text {
  background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  color: white;
  background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.icon {
  font-size: 1rem;
}
</style>