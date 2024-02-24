<script lang="ts" setup>
import type { Event, EventCreate } from "~/stores/calendar";
import { useCalendarStore } from "~/stores/calendar";

const { getEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();
const { dateMapWithEvents } = storeToRefs(useCalendarStore());
const date = ref<string | null>(null);
const currentEvents = ref<Event[] | undefined>(undefined);

function onGetEvents(date: string): void {
  currentEvents.value = getEvents(date);
}

function onAddEvents(date: string, event: EventCreate): void {
  currentEvents.value = addEvent(date, event);
}

function onUpdateEvent(event: Event) {
  updateEvent(event);
  currentEvents.value = getEvents(date.value as string);
}

function onDeleteEvent(eventId: Event["id"]): void {
  deleteEvent(eventId);
}
</script>

<template>
  <Calendar
    v-model="date"
    :events="currentEvents"
    :date-map-with-events="dateMapWithEvents"
    class="calendar"
    @get-events="(date) => onGetEvents(date)"
    @add-event="({ date, event }) => onAddEvents(date, event)"
    @update-event="(event) => onUpdateEvent(event)"
    @delete-event="(eventId) => onDeleteEvent(eventId)"
  >
    ></Calendar
  >
</template>

<style lang="scss" scoped>
.calendar {
  width: 700px;
  max-height: 700px;
}
</style>
