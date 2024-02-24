<script lang="ts" setup>
import type { Dayjs } from "dayjs";

import type {
  ModelValue,
  DayObject,
  Event,
  EventForm,
  CreateEventDto,
  DateMapWithEvents,
} from "./types";
import {
  DAYS_MODE_NAME,
  YEARS_MODE_NAME,
  MONTHS_MODE_NAME,
  VIEW_MODE_COMPONENTS,
} from "./constants";

const emits = defineEmits<{
  (e: "update:modelValue", value: ModelValue): void;
  (e: "get-events", date: string): void;
  (e: "add-event", createEventDto: CreateEventDto): void;
  (e: "update-event", event: Event): void;
  (e: "delete-event", eventId: Event["id"]): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: ModelValue;
    format?: string;
    events?: Event[];
    dateMapWithEvents?: DateMapWithEvents;
  }>(),
  {
    format: "DD.MM.YYYY",
    events: () => [],
    dateMapWithEvents: undefined,
  },
);

const $dayjs = useDayjs();

const COUNT_DAYS_IN_WEEK = 7;
const WEEKDAY_OFFSET = 1;
const COUNT_YEARS_IN_LIST = 12;
const INITIAL_YEAR_OFFSET = -3;
const WEEKDAY_LIST = [...generateWeekdays()];
const MONTH_NAMES = [...generateMonthNames()];

const currentViewMode = ref<keyof typeof VIEW_MODE_COMPONENTS>(DAYS_MODE_NAME);
const currentDaysDisplayed = ref<DayObject[][]>([]);
const currentMonthIndexDisplayed = ref<number>($dayjs().month());
const currentYearDisplayed = ref<number>($dayjs().year());
const currentYearsList = ref<number[]>([
  ...generateYears(currentYearDisplayed.value + INITIAL_YEAR_OFFSET),
]);
const fullscreenEvents = ref<boolean>(false);

const model = computed({
  get: () => {
    return $dayjs(props.modelValue, props.format).startOf("day");
  },
  set: (value) => {
    const formatDate = value.format(props.format);
    emits("get-events", formatDate);
    emits("update:modelValue", formatDate);
  },
});

const currentMonthNameDisplayed = computed<string>(
  () => MONTH_NAMES[currentMonthIndexDisplayed.value],
);

const disableNextBtn = computed<boolean>(() => {
  if (currentViewMode.value === MONTHS_MODE_NAME) return true;
  return false;
});

const disablePreviousBtn = computed<boolean>(() => {
  if (currentViewMode.value === MONTHS_MODE_NAME) return true;
  return false;
});

const showDaysSection = computed<boolean>(() => {
  if (fullscreenEvents.value) return false;
  return currentViewMode.value === DAYS_MODE_NAME;
});

const showMonthsSection = computed<boolean>(() => {
  if (fullscreenEvents.value) return false;
  return currentViewMode.value === MONTHS_MODE_NAME;
});

const showYearsSection = computed<boolean>(() => {
  if (fullscreenEvents.value) return false;
  return currentViewMode.value === YEARS_MODE_NAME;
});

init();

watch(currentViewMode, (value, oldVal) => {
  if (oldVal === YEARS_MODE_NAME) {
    currentYearsList.value = [
      ...generateYears(currentYearDisplayed.value + INITIAL_YEAR_OFFSET),
    ];
  }
});

function init(): void {
  validate();

  const currentValidDate = model.value.isValid()
    ? model.value
    : $dayjs().startOf("day");
  model.value = currentValidDate;
  currentMonthIndexDisplayed.value = currentValidDate.month();
  currentYearDisplayed.value = currentValidDate.year();
  currentDaysDisplayed.value = getDisplayedDays();
}

function validate(): void {
  if (props.modelValue && !model.value.isValid()) {
    console.error("Получено некорректное значение даты");
  }
}

function onToggleViewMode(mode: keyof typeof VIEW_MODE_COMPONENTS): void {
  if (mode === currentViewMode.value) currentViewMode.value = DAYS_MODE_NAME;
  else currentViewMode.value = mode;
}

function onClickNextBtn(): void {
  if (disableNextBtn.value) return;
  else if (currentViewMode.value === DAYS_MODE_NAME) displayNextDates();
  else if (currentViewMode.value === YEARS_MODE_NAME) displayNextYears();
}

function onClickPreviousBtn(): void {
  if (disablePreviousBtn.value) return;
  else if (currentViewMode.value === DAYS_MODE_NAME) displayPreviousDates();
  else if (currentViewMode.value === YEARS_MODE_NAME) displayPreviousYears();
}

function onChangeMonth(monthIndex: number): void {
  currentMonthIndexDisplayed.value = monthIndex;
  currentDaysDisplayed.value = getDisplayedDays();
}

function displayNextDates(): void {
  const lastMothIndex = MONTH_NAMES.length - 1;

  if (currentMonthIndexDisplayed.value + 1 > lastMothIndex) {
    currentMonthIndexDisplayed.value = 0;
    currentYearDisplayed.value += 1;
  } else currentMonthIndexDisplayed.value += 1;

  currentDaysDisplayed.value = getDisplayedDays();
}

function displayPreviousDates(): void {
  const firstMothIndex = 0;
  const lastMothIndex = MONTH_NAMES.length - 1;

  if (currentMonthIndexDisplayed.value - 1 < firstMothIndex) {
    currentMonthIndexDisplayed.value = lastMothIndex;
    currentYearDisplayed.value -= 1;
  } else currentMonthIndexDisplayed.value -= 1;

  currentDaysDisplayed.value = getDisplayedDays();
}

function onChangeYear(year: number): void {
  currentYearDisplayed.value = year;
  currentDaysDisplayed.value = getDisplayedDays();
}

function onToggleFullscreen(): void {
  fullscreenEvents.value = !fullscreenEvents.value;
}

function onAddEvent(event: EventForm): void {
  emits("add-event", { date: model.value.format(props.format), event });
}

function onUpdateEvent(event: Event): void {
  emits("update-event", event);
}

function onDeleteEvent(eventId: Event["id"]): void {
  emits("delete-event", eventId);
}

function displayNextYears(): void {
  const lastYearInCurrentPage =
    currentYearsList.value[currentYearsList.value.length - 1];
  const firstYearInNextPage = lastYearInCurrentPage + 1;

  currentYearsList.value = [...generateYears(firstYearInNextPage)];
}

function displayPreviousYears(): void {
  const firstYearInCurrentPage = currentYearsList.value[0];
  const firstYearInPreviousPage = firstYearInCurrentPage - COUNT_YEARS_IN_LIST;

  currentYearsList.value = [...generateYears(firstYearInPreviousPage)];
}

function* generateWeekdays() {
  for (let i = 0; i < COUNT_DAYS_IN_WEEK; i++) {
    yield $dayjs()
      .startOf("week")
      .day(i + WEEKDAY_OFFSET)
      .format("dd");
  }
}

function getDisplayedDays() {
  const allPeriodDays: DayObject[][] = [];
  const startWeekIndex = (0 + WEEKDAY_OFFSET) % 7;
  const endWeekIndex = (6 + WEEKDAY_OFFSET) % 7;
  const firstMonthDate = $dayjs(
    `01.${currentMonthIndexDisplayed.value + 1}.${currentYearDisplayed.value}`,
    "DD.M.YYYY",
  );
  const lastMonthDate = firstMonthDate.endOf("month").startOf("day");
  const firstMonthDateIndex = firstMonthDate.day();
  const lastMonthDateIndex = lastMonthDate.day();
  const firstDateIsStartWeek = firstMonthDateIndex === startWeekIndex;
  const lastDateIsEndWeek = lastMonthDateIndex === endWeekIndex;
  const firstPeriodDate = firstMonthDate.startOf("week");
  const allWeeksCountInPeriod = getAllWeeksCountInPeriod(
    firstMonthDate,
    lastMonthDate,
  );
  const previousDays: DayObject[] = firstDateIsStartWeek
    ? []
    : [
        ...generateDays(
          firstMonthDate,
          firstMonthDate.startOf("week").diff(firstMonthDate, "day"),
        ),
      ].map((day) => ({ isCurrentPeriod: false, value: day }));

  const nextDays: DayObject[] = lastDateIsEndWeek
    ? []
    : [
        ...generateDays(
          lastMonthDate,
          lastMonthDate.endOf("week").diff(lastMonthDate, "day"),
        ),
      ].map((day) => ({ isCurrentPeriod: false, value: day }));

  let currentPeriodWeekStartDay: Dayjs = firstPeriodDate;

  for (let i = 0; i < allWeeksCountInPeriod; i++) {
    const DAY_IN_WEEK = 7;
    const currentWeekDays: DayObject[] = [];
    const currentMonthStartDay =
      i === 0
        ? currentPeriodWeekStartDay.add(previousDays.length, "day")
        : currentPeriodWeekStartDay;
    let daysLeftToAdd: number = DAY_IN_WEEK;

    if (i === 0) {
      daysLeftToAdd -= previousDays.length;
      currentWeekDays.push(...previousDays);
    } else if (i + 1 === allWeeksCountInPeriod) {
      daysLeftToAdd -= nextDays.length;
    }

    currentWeekDays.push(
      ...[...generateDays(currentMonthStartDay, daysLeftToAdd, true)].map(
        (day) => ({
          isCurrentPeriod: true,
          value: day,
        }),
      ),
    );

    if (i + 1 === allWeeksCountInPeriod) {
      currentWeekDays.push(...nextDays);
    }

    currentPeriodWeekStartDay = currentPeriodWeekStartDay.add(
      DAY_IN_WEEK,
      "day",
    );
    allPeriodDays.push(currentWeekDays);
  }

  return allPeriodDays;
}

function getAllWeeksCountInPeriod(
  firstDayOfMonth: Dayjs,
  lastDayOfMonth: Dayjs,
): number {
  const firstWeekDayOfPeriod = firstDayOfMonth.startOf("week");
  const lastWeekDayOfPeriod = lastDayOfMonth.endOf("week");

  return lastWeekDayOfPeriod.diff(firstWeekDayOfPeriod, "week") + 1;
}

function* generateDays(
  from: Dayjs,
  count: number,
  includeFrom: boolean = false,
) {
  const countGivenTheCurrent = count < 0 ? count + 1 : count - 1;
  const currentCount = !includeFrom ? count : countGivenTheCurrent;

  if (count < 0) {
    for (let i = currentCount; i < 0; i++) {
      yield from.add(i, "day");
    }

    if (includeFrom) yield from;
  } else {
    if (includeFrom) yield from;

    for (let i = 0; i < currentCount; i++) {
      yield from.add(i + 1, "day");
    }
  }
}

function* generateMonthNames() {
  const FIRST_MONTH_INDEX = 0;
  const LAST_MONTH_INDEX = 11;

  for (let i = FIRST_MONTH_INDEX; i <= LAST_MONTH_INDEX; i++) {
    yield $dayjs().month(i).format("MMMM");
  }
}

function* generateYears(firstYear: number) {
  for (let i = 0; i < COUNT_YEARS_IN_LIST; i++) {
    yield firstYear + i;
  }
}
</script>

<template>
  <article class="calendar">
    <h2 class="visually-hidden">Виджет календаря с событиями</h2>

    <CalendarControls
      :current-mode="currentViewMode"
      :current-month-name="currentMonthNameDisplayed"
      :current-year="currentYearDisplayed"
      :disabled="fullscreenEvents"
      :disable-next-btn="disableNextBtn"
      :disable-previous-btn="disablePreviousBtn"
      @toggle-months-mode="onToggleViewMode(MONTHS_MODE_NAME)"
      @toggle-years-mode="onToggleViewMode(YEARS_MODE_NAME)"
      @click-next-btn="onClickNextBtn()"
      @click-previous-btn="onClickPreviousBtn()"
    ></CalendarControls>

    <section v-show="showDaysSection">
      <h3 class="visually-hidden">Дни</h3>
      <CalendarDays
        :current-day="model"
        :weekday-list="WEEKDAY_LIST"
        :days-list="currentDaysDisplayed"
        :date-map-with-events="dateMapWithEvents"
        :format="props.format"
        @change-day="(day) => (model = day)"
      ></CalendarDays>
    </section>

    <section v-show="showMonthsSection">
      <h3 class="visually-hidden">Месяцы</h3>
      <LazyCalendarMonths
        :current-month-name="currentMonthNameDisplayed"
        :month-names="MONTH_NAMES"
        @change-mounth="(monthIndex) => onChangeMonth(monthIndex)"
      ></LazyCalendarMonths>
    </section>

    <section v-show="showYearsSection">
      <h3 class="visually-hidden">Годы</h3>
      <LazyCalendarYears
        :current-year="currentYearDisplayed"
        :years-list="currentYearsList"
        @change-year="(year) => onChangeYear(year)"
      ></LazyCalendarYears>
    </section>

    <CalendarEvents
      v-if="currentViewMode === DAYS_MODE_NAME"
      :events="events"
      :current-date="model ? model.format(props.format) : undefined"
      :fullscreen="fullscreenEvents"
      @toggle-fullscreen="onToggleFullscreen()"
      @add-event="(event) => onAddEvent(event)"
      @update-event="(event) => onUpdateEvent(event)"
      @delete-event="(eventId) => onDeleteEvent(eventId)"
    ></CalendarEvents>
  </article>
</template>

<style lang="scss" scoped>
.calendar {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: rgba(#011533, 0.4);
  backdrop-filter: blur(10px);
}
</style>
