<template>
  <button class="pressure-plate"><slot></slot></button>
</template>

<style lang="scss" scoped>
.pressure-plate {
  padding: 5px 10px;
  border: 1px solid white;
  border-radius: 7px;
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
    opacity: 0.5;
    transform: none;
    cursor: default;
  }
}
</style>
