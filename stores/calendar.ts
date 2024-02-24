export interface EventMap {
  [date: string]: Event[];
}

export interface DateMapWithEvents {
  [date: string]: true;
}

export interface Event {
  id: string;
  title: string;
  text?: string;
}

export interface FindedEventInfo {
  list: Event[];
  index: number;
  item: Event;
}

export type EventCreate = Omit<Event, "id">;

const STORE_ID = "calendar";

export const useCalendarStore = defineStore(STORE_ID, () => {
  const events = ref<EventMap>({});

  const dateMapWithEvents = computed<DateMapWithEvents>(() => {
    const cachedEvents = events.value;
    const datesWithEvents = Object.keys(cachedEvents);
    const map: DateMapWithEvents = {};

    for (let i = 0; i < datesWithEvents.length; i++) {
      const currentDate = datesWithEvents[i];
      const dateIsContentedEvents = Boolean(cachedEvents[currentDate].length);

      if (!dateIsContentedEvents) continue;

      map[datesWithEvents[i]] = true;
    }

    return map;
  });

  function getEvents(date: keyof EventMap): Event[] {
    if (!checkEvents(date)) return [];
    return events.value[date];
  }

  function addEvent(date: keyof EventMap, event: EventCreate): Event[] {
    if (!checkEvents(date)) events.value[date] = [];

    events.value[date].unshift({ ...event, id: getUnicId() });

    return events.value[date];
  }

  function updateEvent(event: Event) {
    const findedEvent = findEventById(event.id);

    if (!findedEvent) return;

    findedEvent.list[findedEvent.index] = { ...event };
  }

  function deleteEvent(eventId: Event["id"]): void {
    const findedEvent = findEventById(eventId);

    if (!findedEvent) return;

    findedEvent.list.splice(findedEvent.index, 1);
  }

  function checkEvents(date: keyof EventMap): boolean {
    if (!(date in events.value)) return false;
    return true;
  }

  function findEventById(eventId: Event["id"]): FindedEventInfo | null {
    for (const date in events.value) {
      const currentEvents = events.value[date];
      const findEventIndex = currentEvents.findIndex(
        (event) => event.id === eventId,
      );

      if (findEventIndex !== -1)
        return {
          list: currentEvents,
          index: findEventIndex,
          item: currentEvents[findEventIndex],
        };
    }

    return null;
  }

  function getUnicId(length: number = 10): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  return {
    getEvents,
    findEventById,
    addEvent,
    updateEvent,
    deleteEvent,
    dateMapWithEvents,
  };
});
