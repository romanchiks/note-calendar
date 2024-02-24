<script lang="ts" setup>
const emits = defineEmits<{
  (e: "change-year", year: number): void;
}>();

defineProps<{
  yearsList: number[];
  currentYear: number;
}>();

function onChangeYear(yearIndex: number): void {
  emits("change-year", yearIndex);
}
</script>

<template>
  <ol class="years">
    <li v-for="year in yearsList" :key="year" class="years__item item">
      <CalendarPressurePlate
        :class="{ 'animate-background-gradient': year === currentYear }"
        class="item__year year"
        @click="onChangeYear(year)"
      >
        {{ year }}
      </CalendarPressurePlate>
    </li>
  </ol>
</template>

<style lang="scss" scoped>
.years {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  & > .item {
    & > .year {
      width: 100%;
    }
  }
}
</style>
