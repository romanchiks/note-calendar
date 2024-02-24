<script lang="ts" setup>
useSeoMeta({
  title: "Календарь",
  ogTitle: "Календарь",
  description: 'Превью виджета "Календарь"',
  ogDescription: 'Превью виджета "Календарь"',
});
</script>

<template>
  <main class="fullscreen home-page animate-background-gradient">
    <WidgetCalendar class="home-page__calendar calendar"></WidgetCalendar>
  </main>
</template>

<style lang="scss" scoped>
.home-page {
  padding-top: 10%;
  background-color: black;

  & > .calendar {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
