<template>
  <div class="">
    <weatherWidget />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import weatherWidget from "@/widgets/Weather/Weather.vue";

export default defineComponent({
  name: "App",
  components: {
    weatherWidget,
  },
  methods: {},
});
</script>

<style lang="scss"></style>
