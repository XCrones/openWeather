<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  column-gap: 5px;
  row-gap: 5px;
}
.city {
  text-align: center;
}
.summary {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  &__img {
    max-width: 100px;
    max-height: 100px;
  }
  &__weather {
    text-align: center;
  }
}

.limit {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.descr {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 5px;
  &__hum,
  &__pressure,
  &__wind,
  &__visible {
    flex: 0 1 50%;
    text-align: center;
  }
}
</style>

<template>
  <div class="item">
    <div class="city">{{ item.name }}, {{ item.sys.country }}</div>
    <div class="summary">
      <img class="summary__img" :src="getImage(item.weather[0].icon)" alt="img" />
      <div class="summary__temp">
        <div class="summary__weather">{{ item.weather[0].main }}</div>
        <div class="summary__curr-temp"><i class="bi bi-thermometer-half"></i>{{ item.main.temp }}&#176;C</div>
        <div class="summary__like"><i class="bi bi-thermometer-low"></i>({{ item.main.feels_like }}&#176;C)</div>
      </div>
    </div>
    <div class="limit">
      <div class="limit__min">Min: {{ item.main.temp_min }}&#176;C</div>
      <div class="limit__max">Max: {{ item.main.temp_max }}&#176;C</div>
    </div>
    <div class="descr">
      <div class="descr__hum"><i class="bi bi-moisture"></i> {{ item.main.humidity }}%</div>
      <div class="descr__visible"><i class="bi bi-binoculars-fill"></i> {{ item.visibility / 1000 }}Km</div>
      <div class="descr__wind"><i class="bi bi-wind"></i> {{ item.wind.speed }}m/s {{ getDegress(item.wind.deg) }}</div>
      <div class="descr__pressure"><i class="bi bi-cloud-fog-fill"></i>{{ item.main.pressure }}hPa</div>
    </div>
  </div>
</template>

<script lang="ts">
import { WeatherItem } from "@/models/Weather.model";
import { PropType, defineComponent } from "vue";

export default defineComponent({
  name: "WeatherItem",
  components: {},
  props: {
    item: {
      type: Object as PropType<WeatherItem>,
      required: true,
    },
  },
  methods: {
    getImage: (icon: string) => `${process.env.VUE_APP_BASE_URL_ICON}/img/wn/${icon}@2x.png`,
    getDegress(deg: number) {
      if (deg >= 0 && deg < 90) {
        return "E";
      } else if (deg >= 90 && deg < 180) {
        return "S";
      } else if (deg >= 180 && deg < 270) {
        return "W";
      } else if (deg >= 270 && deg < 360) {
        return "N";
      }
      return "";
    },
  },
});
</script>
