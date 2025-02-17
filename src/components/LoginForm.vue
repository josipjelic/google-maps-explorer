<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { Loader } from '@googlemaps/js-api-loader'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const mapContainer = ref<HTMLElement | null>(null)
const router = useRouter()
const { loading, error, signInWithEmail } = useAuth()

const handleLogin = async () => {
  const result = await signInWithEmail(email.value, password.value)
  if (!result) {
    // Login failed, error is already set in the useAuth composable
    return
  }
  // Login successful, router navigation is handled in the useAuth composable
}

const handleExplore = () => {
  router.push('/')
}

onMounted(() => {
  if (mapContainer.value) {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    })

    loader.load().then(() => {
      new google.maps.Map(mapContainer.value!, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 13,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [
              { saturation: -100 },
              { lightness: 10 }
            ]
          }
        ]
      })
    })
  }
})
</script>

<template>
  <div class="login-container">
    <div id="map" ref="mapContainer" class="map-background"></div>
    <div class="overlay"></div>
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Welcome Back</h1>
      <p class="subtitle">Please sign in to continue</p>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          placeholder="Enter your email"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          placeholder="Enter your password"
          :disabled="loading"
        />
      </div>

      <div class="form-group help-text">
        <p>Demo credentials:</p>
        <code>Email: demo@example.com</code>
        <code>Password: password</code>
      </div>

      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="rememberMe" :disabled="loading">
          Remember me
        </label>
        <a href="#" class="forgot-password">Forgot Password?</a>
      </div>

      <button type="submit" class="login-button" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>

      <button type="button" @click="handleExplore" class="explore-button">
        Find Your Home
      </button>

      <p class="signup-link">
        Don't have an account? <a href="#">Sign up</a>
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  z-index: 2;
}

.login-form {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 3;
}

h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
  text-align: center;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.help-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  color: white;
}

.help-text p {
  margin-bottom: 0.5rem;
}

.help-text code {
  display: block;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  color: white;
  transition: all 0.3s ease;
}

input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

input[type="email"]:focus,
input[type="password"]:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.forgot-password {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: white;
}

.login-button,
.explore-button {
  width: 100%;
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.login-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.explore-button {
  background: white;
  color: #646cff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.explore-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.signup-link a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

input[type="checkbox"]:checked {
  background: rgba(255, 255, 255, 0.2);
}

input[type="checkbox"]:checked::before {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-message {
  background: rgba(255, 87, 87, 0.1);
  border: 1px solid rgba(255, 87, 87, 0.2);
  color: #ff5757;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>