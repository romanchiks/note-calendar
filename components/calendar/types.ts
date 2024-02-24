import type { Dayjs } from "dayjs";

export type ModelValue = string | null;
export type EventForm = Omit<Event, "id">;

export interface DayObject {
  isCurrentPeriod: boolean;
  value: Dayjs;
}

export interface Event {
  id: string;
  title: string;
  text?: string;
  [key: string]: unknown;
}

export interface DateMapWithEvents {
  [date: string]: unknown;
}

export interface CreateEventDto {
  date: string;
  event: EventForm;
}
