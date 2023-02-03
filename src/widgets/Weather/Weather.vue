<style lang="scss" scoped>
.wrapper {
  padding: 5px;
  position: relative;
  min-height: 400px;
  outline: 1px solid black;
  display: flex;
  flex-direction: column;
}
.widget-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
  align-items: center;
  height: 50px;

  &__title {
  }
  &__btn {
    i {
      font-size: 23px;
      color: rgb(68, 66, 66);
    }
  }
}
.widget-section {
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__weather {
    overflow: auto;
  }

  &__item {
    &:first-child {
      border-top: 1px solid black;
    }
    padding: 10px 0;
    border-bottom: 1px solid black;
  }
  &__notfound {
    text-align: center;
  }
  &__settings {
    flex: auto;
    display: flex;
  }
}
</style>

<template>
  <div :style="{ maxWidth: `${maxWidthWidget}px` }" class="wrapper">
    <div class="widget-header">
      <div class="widget-header__title">{{ title }}</div>
      <button @click="toggleSetings" type="button" class="widget-header__btn">
        <i :class="iconSetting"></i>
      </button>
    </div>
    <div class="widget-section">
      <div v-if="isHiddenSettings" class="widget-section__weather" :style="{ maxHeight: `${maxHeightItems}px` }">
        <div v-if="weatherItems.length > 0" v-for="item in weatherItems" :key="item.id" class="widget-section__item">
          <WeatherItem :item="item" />
        </div>
        <div v-else class="widget-section__notfound">cityes not found..</div>
      </div>
      <div v-else class="widget-section__settings">
        <WeatherSettings />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import WeatherItem from "./Weather.item.vue";
import WeatherSettings from "./Weather.settings.vue";

export default defineComponent({
  name: "WeatherWidget",
  components: {
    WeatherItem,
    WeatherSettings,
  },
  data() {
    return {
      maxHeightItems: 340,
      maxWidthWidget: 250,
      isHiddenSettings: true,
      title: "",
      iconSetting: "bi bi-gear-fill",
    };
  },
  methods: {
    ...mapActions({
      fetchWeatherAll: "WeatherModule/fetchWeatherAll",
    }),
    toggleSetings() {
      if (!this.isHiddenSettings) {
        this.showWeather();
      } else {
        this.showSettings();
      }
    },
    showWeather() {
      this.title = "OpenWeather.com";
      this.iconSetting = "bi bi-gear-fill";
      this.isHiddenSettings = true;
    },
    showSettings() {
      this.title = "Settings";
      this.iconSetting = "bi bi-x-lg";
      this.isHiddenSettings = false;
    },
  },
  async mounted() {
    await this.fetchWeatherAll();
    if (this.weatherItems.length < 1) {
      this.showSettings();
    } else {
      this.showWeather();
    }
  },
  computed: {
    ...mapGetters({
      weatherItems: "WeatherModule/getWeathers",
    }),
  },
});
</script>
