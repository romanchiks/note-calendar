<script lang="ts" setup>
import type { Event, EventForm } from "./types";

const emits = defineEmits<{
  (e: "select-event", id: Event["id"]): void;
  (e: "unselect-event"): void;
  (e: "add-event", event: EventForm): void;
  (e: "update-event", event: Event): void;
}>();

const props = defineProps<{
  event?: Event;
  selectedEventId?: Event["id"] | null;
}>();

const BASE_FORM_STATE = {
  title: "",
  text: "",
};

const eventForm = ref<EventForm | Event>({ ...BASE_FORM_STATE });
const eventIsEdit = ref<boolean>(false);

const eventIsSelected = computed<boolean>(() => {
  return Boolean(props.event && props.event.id === props.selectedEventId);
});

const editButtonShow = computed(() => {
  if (eventIsSelected.value) return true;
  return false;
});

const saveBtnIsDisabled = computed<boolean>(() => {
  if (!eventForm.value.title) return true;
  if (JSON.stringify(eventForm.value) === JSON.stringify(BASE_FORM_STATE)) {
    return true;
  } else if (
    props.event &&
    JSON.stringify(eventForm.value) === JSON.stringify(props.event)
  ) {
    return true;
  }

  return false;
});

watch(eventIsSelected, (val) => {
  if (!val) eventIsEdit.value = false;
  else eventForm.value = { ...props.event };
});

function onSelectEvent(eventId: Event["id"]): void {
  emits("select-event", eventId);
}

function onUnselectEvent(): void {
  emits("unselect-event");
}

function onAddEvent(): void {
  if (saveBtnIsDisabled.value) return;
  emits("add-event", eventForm.value);
}

function onUpdateEvent(): void {
  if (saveBtnIsDisabled.value) return;
  emits("update-event", { ...props.event!, ...eventForm.value });
}

function onStartEdit() {
  eventIsEdit.value = true;
}
</script>

<template>
  <form v-if="!event || eventIsEdit" class="event event--form" @submit.prevent>
    <CalendarIconButton
      v-show="eventIsSelected"
      class="controls__bth bth"
      hidden-description="Закрыть форму редактирования события"
      @click="onUnselectEvent()"
    >
      <Icon name="ep:close-bold"></Icon>
    </CalendarIconButton>

    <label class="event__field field">
      <p class="field__label label">заголовок</p>
      <input
        v-model.trim="eventForm.title"
        class="text-input field__input input"
        type="text"
      />
    </label>

    <label class="event__field field">
      <p class="field__label label">текст</p>
      <input
        v-model.trim="eventForm.text"
        class="text-input field__input input"
        type="text"
      />
    </label>

    <CalendarPressurePlate
      :disabled="saveBtnIsDisabled"
      class="event__save-bth save-bth"
      @click="eventIsEdit ? onUpdateEvent() : onAddEvent()"
      >{{ eventIsEdit ? "Изменить" : "Создать" }}</CalendarPressurePlate
    >
  </form>

  <article
    v-else
    :class="{
      'animate-background-gradient': eventIsSelected,
      'event--selected': eventIsSelected,
    }"
    class="event"
    @click="onSelectEvent(event.id)"
  >
    <div class="event__controls controls">
      <CalendarIconButton
        v-show="editButtonShow"
        class="controls__bth bth"
        hidden-description="Редактировать выбранное событие"
        @click.stop="onStartEdit()"
      >
        <Icon name="material-symbols:edit-note-sharp"></Icon>
      </CalendarIconButton>

      <CalendarIconButton
        v-show="eventIsSelected"
        class="controls__bth bth"
        hidden-description="Сбросить выбранное событие"
        @click.stop="onUnselectEvent()"
      >
        <Icon name="ep:close-bold"></Icon>
      </CalendarIconButton>
    </div>

    <h3
      :class="{ 'text-ellipsis': !eventIsSelected }"
      class="event__title title"
    >
      {{ event.title }}
    </h3>

    <p
      v-if="event.text"
      :class="{ 'text-ellipsis': !eventIsSelected }"
      class="event__text text"
    >
      {{ event.text }}
    </p>
  </article>
</template>

<style lang="scss" scoped>
.event {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px 15px;
  border: 1px solid white;
  border-radius: 10px;

  & > .field {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & > .label {
      font-weight: 700;
    }
  }

  & > .save-bth {
    &:hover,
    &:focus {
      transform: none;
      background-color: white;
      color: black;
    }

    &:disabled {
      background-color: inherit;
      color: inherit;
    }
  }

  & > .bth,
  & > .controls {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  & > .title {
    font-weight: 700;
    margin-right: 45px;
    word-wrap: break-word;
  }

  & > .text {
    word-wrap: break-word;
  }
}
</style>
