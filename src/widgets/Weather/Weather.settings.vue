<style lang="scss" scoped>
.settings {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cityes {
  flex: auto;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  overflow: auto;

  &__item {
    padding: 3px 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 5px;
    background-color: #9ce9d2;
  }
  &__burger {
    height: 30px;
    width: 20px;
    position: relative;
    cursor: pointer;

    &::before,
    &::after,
    & > div {
      content: "";
      position: absolute;
      left: 0;
      height: 2px;
      width: 100%;
      background-color: rgb(94, 99, 100);
      transform: translateY(-50%);
    }

    &::before {
      top: 30%;
    }
    &::after {
      top: 70%;
    }
    & > div {
      top: 50%;
    }
  }

  &__title {
    flex: auto;
  }
  &__btn_delete {
    color: rgb(63, 34, 34);
    font-size: 20px;
  }
  &__notfound {
    text-align: center;
  }
}
.new-city {
  height: 85px;
  &__title {
    padding: 5px 0;
    &::first-letter {
      text-transform: uppercase;
    }
  }
  &__field {
    position: relative;
    display: flex;
    flex-direction: row;
    column-gap: 5px;
    input {
      outline: 1px solid black;
      width: 100%;
      padding: 0px 5px;
    }
  }
  &__btn {
    width: 30px;
    background-color: #419441;
    color: white;
    border-radius: 5px;
  }
  &__error {
    text-transform: lowercase;
    color: rgb(196, 52, 52);
  }
  &__clear {
    position: absolute;
    right: 30px;
    font-size: 23px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

<template>
  <div class="settings">
    <div :style="{ maxHeight: `${maxHeightItems}px` }" class="cityes">
      <div
        draggable="true"
        @drop="onDrop($event, index)"
        @dragstart="onDragStart($event, item.id)"
        @dragover.prevent
        @dragenter.prevent
        v-if="weatherItems.length > 0"
        v-for="(item, index) in weatherItems"
        :key="item.id"
        class="cityes__item"
      >
        <div class="cityes__burger"><div></div></div>
        <div class="cityes__title">{{ item.name }}, {{ item.sys.country }}</div>
        <button @click="deleteCity(item.id)" type="button" class="cityes__btn_delete">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
      <div v-else class="cityes__notfound">cityes not found..</div>
    </div>
    <form @submit.prevent="onSubmit()" class="new-city">
      <h3 class="new-city__title">add location:</h3>
      <div class="new-city__field">
        <input
          @blur="v$.cityName.$touch"
          v-model.trim="cityName"
          placeholder="city name"
          id="city-name"
          type="text"
          class=""
        />
        <button v-if="cityName.length > 0" @click="clearFieldName" type="button" class="new-city__clear">
          <i class="bi bi-x"></i>
        </button>
        <button type="submit" class="new-city__btn">
          <i class="bi bi-arrow-return-left"></i>
        </button>
      </div>
      <div class="new-city__error" v-for="(error, index) of v$.cityName.$errors" :key="index">
        {{ error.$message }}
      </div>
      <div v-if="queryErr.length > 0" class="new-city__error">
        {{ queryErr }}
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MoveItem, WeatherItem } from "@/models/Weather.model";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default defineComponent({
  name: "WeatherSettings",
  components: {},
  setup() {
    return { v$: useVuelidate() };
  },
  validationConfig: {
    $lazy: true,
  },
  data() {
    return {
      cityName: "",
      queryPending: false,
      queryErr: "",
      maxHeightItems: 255,
    };
  },
  methods: {
    ...mapActions({
      fetchWeather: "WeatherModule/fetchWeather",
      deleteItem: "WeatherModule/deleteCity",
      moveItem: "WeatherModule/moveItem",
      addNewItem: "WeatherModule/addNewCity",
    }),
    onDragStart(event: DragEvent, id: number) {
      if (!!event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("itemID", id.toString());
      }
    },
    onDrop(event: DragEvent, index: number) {
      if (!!event.dataTransfer) {
        const id = parseInt(event.dataTransfer.getData("itemID"));
        if (id > 0) {
          const item: MoveItem = {
            id,
            index,
          };
          this.moveItem(item);
        }
      }
    },
    deleteCity(id: number) {
      this.deleteItem(id);
    },
    async onSubmit() {
      const isFormValid = await this.v$.$validate();
      if (isFormValid && !this.queryPending) {
        try {
          this.queryPending = true;
          this.queryErr = "";
          const { data } = await axios<WeatherItem>(
            `${process.env.VUE_APP_BASE_URL_API}/data/2.5/weather?q=${String(this.cityName)}&units=metric&appid=${
              process.env.VUE_APP_API_KEY
            }`
          );

          if (!!data) {
            this.addNewItem(data);
            this.cityName = "";
          } else {
            this.queryErr = "city not found";
          }

          this.v$.$reset();
          this.queryPending = false;
        } catch (err) {
          this.queryErr = "err get city";
          this.queryPending = false;
        }
      }
    },
    clearFieldName() {
      this.cityName = "";
      this.v$.$reset();
    },
  },
  computed: {
    ...mapGetters({
      weatherItems: "WeatherModule/getWeathers",
    }),
  },
  validations() {
    return {
      cityName: {
        required,
        minLength: minLength(1),
      },
    };
  },
});
</script>
