<script lang="ts" setup>
import {
  MONTHS_MODE_NAME,
  YEARS_MODE_NAME,
  VIEW_MODE_COMPONENTS,
} from "./constants";

const emits = defineEmits<{
  (e: "click-previous-btn"): void;
  (e: "click-next-btn"): void;
  (e: "toggle-months-mode"): void;
  (e: "toggle-years-mode"): void;
}>();

const props = defineProps<{
  currentMode: keyof typeof VIEW_MODE_COMPONENTS;
  currentMonthName: string;
  currentYear: number;
  disabled?: boolean;
  disablePreviousBtn?: boolean;
  disableNextBtn?: boolean;
}>();

const previousBtnIsDisabled = computed<boolean>(() => {
  return props.disabled || props.disablePreviousBtn;
});

const nextBtnIsDisabled = computed<boolean>(() => {
  return props.disabled || props.disableNextBtn;
});

function onClickPreviousBtn(): void {
  if (previousBtnIsDisabled.value) return;
  emits("click-previous-btn");
}

function onClickNextBtn(): void {
  if (nextBtnIsDisabled.value) return;
  emits("click-next-btn");
}

function onToggleMonthsMode() {
  if (props.disabled) return;
  emits("toggle-months-mode");
}

function onToggleYearsMode() {
  if (props.disabled) return;
  emits("toggle-years-mode");
}
</script>

<template>
  <section class="controls">
    <h3 class="visually-hidden">Навигация календаря</h3>

    <CalendarPressurePlate
      :disabled="previousBtnIsDisabled"
      class="controls__control control"
      @click="onClickPreviousBtn()"
    >
      <Icon name="flowbite:caret-left-solid"></Icon>
    </CalendarPressurePlate>

    <CalendarPressurePlate
      :disabled="disabled"
      :class="{
        'animate-background-gradient': currentMode === MONTHS_MODE_NAME,
      }"
      class="controls__control control"
      @click="onToggleMonthsMode()"
    >
      {{ currentMonthName }}
    </CalendarPressurePlate>

    <CalendarPressurePlate
      :disabled="disabled"
      :class="{
        'animate-background-gradient': currentMode === YEARS_MODE_NAME,
      }"
      class="controls__control control"
      @click="onToggleYearsMode()"
    >
      {{ currentYear }}
    </CalendarPressurePlate>

    <CalendarPressurePlate
      :disabled="nextBtnIsDisabled"
      class="controls__control control"
      @click="onClickNextBtn()"
    >
      <Icon name="flowbite:caret-right-solid"></Icon>
    </CalendarPressurePlate>
  </section>
</template>

<style lang="scss" scoped>
.controls {
  display: grid;
  grid-template-columns: auto 1fr 1fr auto;
  gap: 10px;

  & > .control {
    font-weight: 700;
  }
}
</style>
