<script lang="ts" setup>
import { ref } from 'vue'

type InputType = 'text' | 'email' | 'password'

interface IProps {
  id: string
  label: string
  type?: InputType
  required?: boolean
  error?: string
}

const input = ref('')

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

withDefaults(defineProps<IProps>(), {
  type: 'text',
  required: false,
})
</script>

<template>
  <div class="main-input" :class="{ 'main-input_error': error }">
    <label :for="id">{{ label }}</label>
    <input
      v-model="input"
      :id="id"
      :type="type"
      :required="required"
      @input="emits('update:modelValue', $event.target.value)"
    />
    <span class="main-input__error" v-if="error">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.main-input {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;

  label {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  input {
    padding: 12px 12px;
    background-color: var(--main-black);
    border: 1px solid var(--main-white);
    color: var(--main-white);
    font-size: 1rem;

    &:focus-visible {
      outline: 2px solid var(--main-white);
    }
  }

  .main-input__error {
    color: var(--main-red);
    font-size: 0.8rem;
    margin-top: 4px;
    max-width: 100%;
  }

  &_error {
    input {
      border-color: var(--main-red);

      &:focus-visible {
        outline: 2px solid var(--main-red);
      }
    }
  }
}
</style>
