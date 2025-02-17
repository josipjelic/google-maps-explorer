<script setup lang="ts">
const colors = [
  { name: 'Primary', hex: '#646cff' },
  { name: 'Secondary', hex: '#535bf2' },
  { name: 'Dark', hex: '#242424' },
  { name: 'Light', hex: '#ffffff' }
];

const typographyExamples = [
  { element: 'h1', text: 'Heading 1' },
  { element: 'h2', text: 'Heading 2' },
  { element: 'h3', text: 'Heading 3' },
  { element: 'p', text: 'Regular paragraph text' }
];

const buttonStates = ['Default', 'Hover', 'Focus'];
</script>

<template>
  <div class="styleguide">
    <h1>Admin Style Guide</h1>

    <!-- Colors Section -->
    <section>
      <h2>Colors</h2>
      <div class="color-grid">
        <div v-for="color in colors" :key="color.name" class="color-item">
          <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
          <div class="color-info">
            <h3>{{ color.name }}</h3>
            <code>{{ color.hex }}</code>
          </div>
        </div>
      </div>
    </section>

    <!-- Typography Section -->
    <section>
      <h2>Typography</h2>
      <div class="typography-examples">
        <div v-for="item in typographyExamples" :key="item.element" class="type-item">
          <component :is="item.element">{{ item.text }}</component>
          <code>{{ `<${item.element}>` }}</code>
        </div>
      </div>
    </section>

    <!-- Buttons Section -->
    <section>
      <h2>Buttons</h2>
      <div class="button-grid">
        <div v-for="state in buttonStates" :key="state" class="button-item">
          <h3>{{ state }}</h3>
          <button :class="state.toLowerCase()">Button</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.styleguide {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: left;
}

section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

h2 {
  font-size: 1.8em;
  margin-bottom: 1.5rem;
  color: #333;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-preview {
  height: 100px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.color-info {
  padding: 0.5rem;
}

.typography-examples {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.type-item code {
  background: #f1f1f1;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.button-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

button.hover {
  border-color: #646cff;
}

button.focus {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>