<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <h1>{{ errorCode }}</h1>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorLayout',
  
  props: {
    errorCode: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-color);
}

.error-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  text-align: center;
}

.error-content {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
}

h1 {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  color: var(--dark-color);
}

p {
  color: var(--gray-color);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
</style>
