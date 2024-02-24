<script lang="ts" setup>
const emits = defineEmits<{
  (e: "change-mounth", monthIndex: number): void;
}>();

defineProps<{
  monthNames: string[];
  currentMonthName: string;
}>();

function onChangeMonth(monthIndex: number): void {
  emits("change-mounth", monthIndex);
}
</script>

<template>
  <ol class="months">
    <li
      v-for="(monthName, monthIndex) in monthNames"
      :key="monthName"
      class="months__month month"
    >
      <CalendarPressurePlate
        :class="{
          'animate-background-gradient': monthName === currentMonthName,
        }"
        class="month__btn btn"
        @click="onChangeMonth(monthIndex)"
      >
        {{ monthName }}
      </CalendarPressurePlate>
    </li>
  </ol>
</template>

<style lang="scss" scoped>
.months {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  & > .month {
    & > .btn {
      width: 100%;
    }
  }
}
</style>
