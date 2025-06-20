<template>
  <Dialog
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    :style="{ width: width }"
    :header="header"
    :modal="true"
    :closable="closable"
    :closeOnEscape="closeOnEscape"
    :dismissableMask="dismissableMask"
    class="custom-dialog text-white"
  >
    <div class="custom-dialog-content">
      <slot></slot>
    </div>
    
    <template #footer>
      <div class="custom-dialog-footer">
        <slot name="footer">
          <Button 
            v-if="showCancelButton" 
            :label="cancelLabel" 
            icon="pi pi-times" 
            class="p-button-text p-2" 
            @click="onCancel" 
          />
          <Button 
            v-if="showConfirmButton" 
            :label="confirmLabel" 
            :icon="confirmIcon" 
            :class="['p-2', confirmButtonClass]" 
            @click="onConfirm" 
          />
        </slot>
      </div>
    </template>
  </Dialog>
</template>

<script>
export default {
  name: 'CustomDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    header: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500px'
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    dismissableMask: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    cancelLabel: {
      type: String,
      default: 'Cancelar'
    },
    confirmLabel: {
      type: String,
      default: 'Confirmar'
    },
    confirmIcon: {
      type: String,
      default: 'pi pi-check'
    },
    confirmButtonClass: {
      type: String,
      default: 'p-button-primary'
    },
    isConfirmation: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'cancel', 'confirm'],
  
  methods: {
    onCancel() {
      this.$emit('update:modelValue', false)
      this.$emit('cancel')
    },
    
    onConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style>
.custom-dialog .p-dialog-header {
  padding: 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.custom-dialog .p-dialog-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.custom-dialog .p-dialog-content {
  padding: 2rem;
}

.custom-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.custom-dialog .p-dialog-footer {
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.custom-dialog .field {
  margin-bottom: 0.75rem;
}

.custom-dialog .field:last-child {
  margin-bottom: 0;
}

.custom-dialog .field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.custom-dialog .confirmation-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.custom-dialog .confirmation-content i {
  font-size: 2rem;
  color: var(--warning-color);
}

/* Estilos específicos para diálogo de confirmação */
.custom-dialog.confirmation .p-dialog-header {
  background-color: var(--warning-color);
}

/* Estilos específicos para diálogo de exclusão */
.custom-dialog.danger .p-dialog-header {
  background-color: var(--danger-color);
}

/* Estilos específicos para diálogo de sucesso */
.custom-dialog.success .p-dialog-header {
  background-color: var(--success-color);
}
</style>
