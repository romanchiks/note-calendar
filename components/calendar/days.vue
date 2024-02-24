<script lang="ts" setup>
import type { Dayjs } from "dayjs";

import type { DayObject, DateMapWithEvents } from "./types";

const emits = defineEmits<{
  (e: "change-day", day: Dayjs): void;
}>();

const props = defineProps<{
  weekdayList: string[];
  daysList: DayObject[][];
  currentDay: Dayjs;
  format: string;
  dateMapWithEvents?: DateMapWithEvents;
}>();

function onChangeDay(day: typeof props.currentDay): void {
  emits("change-day", day);
}
</script>

<template>
  <table class="days">
    <thead class="days__section section section--head">
      <tr class="section__row row row--head">
        <th
          v-for="weekday in weekdayList"
          :key="weekday"
          class="row__data data data--head"
        >
          {{ weekday }}
        </th>
      </tr>
    </thead>
    <tbody class="days__section section section--body">
      <tr
        v-for="week in daysList"
        :key="JSON.stringify(week)"
        class="section__row row row--body"
      >
        <td
          v-for="{ value, isCurrentPeriod } in week"
          :key="String(value)"
          :class="{ 'data--non-main': !isCurrentPeriod }"
          class="row__data data data--head"
        >
          <CalendarPressurePlate
            :class="{
              'animate-background-gradient':
                value.toString() == currentDay.toString(),
              'day--events-contented':
                props.dateMapWithEvents &&
                value.format(props.format) in props.dateMapWithEvents,
            }"
            class="data__day day"
            @click="onChangeDay(value)"
          >
            {{ value.format("DD") }}
          </CalendarPressurePlate>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.days {
  display: flex;
  flex-direction: column;
  gap: 15px;

  & > .section {
    &--body {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    & > .row {
      display: grid;
      grid-template-columns: repeat(7, calc((100% - 60px) / 7));
      gap: 10px;
      place-items: center;

      & > .data {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        &--head {
          font-weight: 700;
        }

        &--non-main {
          opacity: 0.5;
        }

        & > .day {
          flex-grow: 1;

          &--events-contented {
            text-decoration: underline;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
