<template>
  <CustomDialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :header="header || 'Confirmação'"
    :width="width"
    :confirmLabel="confirmLabel"
    :cancelLabel="cancelLabel"
    :confirmButtonClass="confirmButtonClass"
    :cancelButtonClass="cancelButtonClass"
    :isConfirmation="true"
    :class="dialogClass"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <div class="confirmation-content">
      <i :class="icon" />
      <span style="color: var(--text-color);">{{ message }}</span>
    </div>
  </CustomDialog>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    header: {
      type: String,
      default: 'Confirmação'
    },
    message: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '450px'
    },
    confirmLabel: {
      type: String,
      default: 'Sim'
    },
    cancelLabel: {
      type: String,
      default: 'Não'
    },
    confirmButtonClass: {
      type: String,
      default: 'p-button-primary'
    },
    cancelButtonClass: {
      type: String,
      default: 'p-button-text'
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'danger'].includes(value)
    }
  },
  
  emits: ['update:modelValue', 'cancel', 'confirm'],
  
  computed: {
    icon() {
      const iconMap = {
        'info': 'pi pi-info-circle',
        'success': 'pi pi-check-circle',
        'warning': 'pi pi-exclamation-triangle',
        'danger': 'pi pi-exclamation-circle'
      };
      return iconMap[this.type] || iconMap.info;
    },
    
    dialogClass() {
      return this.type;
    }
  },
  
  methods: {
    onCancel() {
      this.$emit('update:modelValue', false);
      this.$emit('cancel');
    },
    
    onConfirm() {
      this.$emit('confirm');
      this.$emit('update:modelValue', false);
    }
  }
}
</script>

<style scoped>
.confirmation-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.confirmation-content i {
  font-size: 2rem;
}

.info i {
  color: var(--info-color);
}

.success i {
  color: var(--success-color);
}

.warning i {
  color: var(--warning-color);
}

.danger i {
  color: var(--danger-color);
}
</style>
