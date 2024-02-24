<script lang="ts" setup>
defineProps<{
  hiddenDescription?: string;
}>();
</script>

<template>
  <button class="icon-button">
    <h4 v-if="hiddenDescription" class="visually-hidden">
      {{ hiddenDescription }}
    </h4>
    <slot> </slot>
  </button>
</template>

<style lang="scss" scoped>
.icon-button {
  user-select: none;
  cursor: pointer;
  transition: all ease-out 0.1s;

  &:hover,
  &:focus {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(1);
  }

  &:disabled {
    transform: none;
    cursor: default;
  }
}
</style>
