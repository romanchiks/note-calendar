<script lang="ts" setup>
import type { Event, EventForm } from "./types";

const emits = defineEmits<{
  (e: "toggle-fullscreen"): void;
  (e: "add-event", event: EventForm): void;
  (e: "update-event", event: Event): void;
  (e: "delete-event", eventId: Event["id"]): void;
}>();

const props = withDefaults(
  defineProps<{
    events: Event[];
    currentDate?: string;
    fullscreen?: boolean;
  }>(),
  {
    currentDate: "",
    fullscreen: false,
  },
);

const DEFAULT_STATE_NAME = "default";
const CREATE_STATE_NAME = "create";
const EDIT_STATE_NAME = "edit";

const selectedEventId = ref<Event["id"] | null>(null);
const currentState = ref<
  typeof DEFAULT_STATE_NAME | typeof CREATE_STATE_NAME | typeof EDIT_STATE_NAME
>(DEFAULT_STATE_NAME);

const createBtnIsDisabled = computed<boolean>(
  () => currentState.value === CREATE_STATE_NAME,
);

const deleteBtnIsDisabled = computed<boolean>(
  () => currentState.value !== EDIT_STATE_NAME,
);

const closeBtnIsDisabled = computed<boolean>(
  () => currentState.value !== CREATE_STATE_NAME,
);

watch(
  () => props.currentDate,
  () => onShowDefaultState(),
);

watch(currentState, (val) => {
  if (val !== EDIT_STATE_NAME) selectedEventId.value = null;
});

function toggleFullscreen() {
  emits("toggle-fullscreen");
}

function onAddEvent(event: EventForm): void {
  emits("add-event", event);
  currentState.value = DEFAULT_STATE_NAME;
}

function onUpdateEvent(event: Event): void {
  emits("update-event", event);
  onShowDefaultState();
}

function onDeleteEvent(): void {
  if (!selectedEventId.value) return;
  emits("delete-event", selectedEventId.value);
  onShowDefaultState();
}

function onSelectEvent(eventId: Event["id"] | undefined = undefined): void {
  if (!eventId) {
    selectedEventId.value = null;
    currentState.value = DEFAULT_STATE_NAME;
  } else {
    selectedEventId.value = eventId;
    currentState.value = EDIT_STATE_NAME;
  }
}

function onShowCreateForm(): void {
  currentState.value = CREATE_STATE_NAME;
}

function onShowDefaultState(): void {
  currentState.value = DEFAULT_STATE_NAME;
}
</script>

<template>
  <section class="events">
    <h3 class="visually-hidden">События на дату {{ currentDate }}</h3>

    <div class="events__show-control show-control">
      <div class="show-control__line line"></div>
      <div class="show-control__line line"></div>

      <CalendarIconButton
        :class="{ 'toggle-bth--bottom': fullscreen }"
        class="line__toggle-bth toggle-bth"
        hidden-description="Развернуть / свернуть панель событий"
        @click="toggleFullscreen()"
      >
        <Icon name="ep:caret-top"></Icon>
      </CalendarIconButton>
    </div>

    <header class="events__header header">
      <h3 class="header__title title">
        события {{ currentDate ? `на ${currentDate}` : "" }}
      </h3>

      <div class="header__controls controls">
        <CalendarIconButton
          v-show="!deleteBtnIsDisabled"
          class="controls__icon-bth"
          hidden-description="Удалить выбранное событие"
          @click="onDeleteEvent()"
        >
          <Icon name="ic:baseline-delete-forever"></Icon>
        </CalendarIconButton>

        <CalendarIconButton
          v-show="!closeBtnIsDisabled"
          class="controls__icon-bth"
          hidden-description="Закрыть форму создания события"
          @click="onShowDefaultState()"
        >
          <Icon name="ep:close-bold"></Icon>
        </CalendarIconButton>

        <CalendarIconButton
          v-show="!createBtnIsDisabled"
          class="controls__icon-bth"
          hidden-description="Открыть форму создания события"
          @click="onShowCreateForm()"
        >
          <Icon name="material-symbols:add-notes-rounded"></Icon>
        </CalendarIconButton>
      </div>
    </header>

    <ol :class="{ 'list--fullscreen': fullscreen }" class="events__list list">
      <li v-if="currentState === CREATE_STATE_NAME">
        <CalendarEvent
          @add-event="(event) => onAddEvent(event)"
        ></CalendarEvent>
      </li>

      <li v-for="event in events" :key="event.id">
        <CalendarEvent
          :event="event"
          :selected-event-id="selectedEventId"
          @select-event="(eventId) => onSelectEvent(eventId)"
          @unselect-event="onSelectEvent()"
          @update-event="(event) => onUpdateEvent(event)"
        ></CalendarEvent>
      </li>
    </ol>
  </section>
</template>

<style lang="scss" scoped>
.events {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;

  & > .show-control {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    padding-top: 10px;

    & > .line {
      height: 2px;
      min-width: 100%;
      background-color: white;
    }

    & > .toggle-bth {
      position: absolute;
      top: -2px;
      left: calc(50% - 12px);

      &--bottom {
        transform: rotate(180deg);
      }
    }
  }
  & > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    & > .title {
      font-weight: 700;
    }

    & > .controls {
      display: flex;
      align-items: center;
    }
  }

  & > .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding: 0 5px;
    max-height: 200px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: white;

      border-radius: 4px;
      padding-left: 5px;
    }

    &--fullscreen {
      max-height: 100%;
    }
  }
}
</style>
