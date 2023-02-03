import { MoveItem } from "./../../models/Weather.model";
import { WeatherItem } from "@/models/Weather.model";
import axios from "axios";
import { GetterTree, MutationTree, ActionTree } from "vuex";

const STORAGE_KEY_CITYES = "weather-widget";

class State {
  weathers: WeatherItem[] = [];
}

const getters = <GetterTree<State, any>>{
  getWeathers: (state): WeatherItem[] => state.weathers,
};

const mutations = <MutationTree<State>>{
  deleteCity(state, id: number) {
    state.weathers = state.weathers.filter((city) => city.id !== id);
    const cityesName = state.weathers.map((item) => item.name);
    localStorage.setItem(STORAGE_KEY_CITYES, JSON.stringify(cityesName));
  },
  moveItem(state, { id, index: secondElemIdx }: MoveItem) {
    const firstElemIdx = state.weathers.findIndex((item) => item.id === id);
    const firstElem = state.weathers.find((item) => item.id === id);
    const secondElem = state.weathers[secondElemIdx];
    if (firstElemIdx >= 0 && !!secondElem && !!firstElem) {
      state.weathers[firstElemIdx] = secondElem;
      state.weathers[secondElemIdx] = firstElem;
    }
  },
  addNewCity(state, weatherItem: WeatherItem) {
    const cityIndex = state.weathers.findIndex((item) => item.id === weatherItem.id);
    if (cityIndex < 0) {
      state.weathers.push(weatherItem);
    } else {
      state.weathers[cityIndex] = weatherItem;
    }

    const cityesName = state.weathers.map((item) => item.name);
    localStorage.setItem(STORAGE_KEY_CITYES, JSON.stringify(cityesName));
  },
};

const actions = <ActionTree<State, any>>{
  async fetchWeatherAll(context) {
    try {
      const cityes = localStorage.getItem(STORAGE_KEY_CITYES);
      if (!!cityes) {
        const parseCityes = JSON.parse(cityes);
        if (!!parseCityes && Array.isArray(parseCityes)) {
          for (let index = 0; index < parseCityes.length; index++) {
            const cityName = parseCityes[index];
            if (!!cityName) {
              const { data } = await axios<WeatherItem>(
                `${process.env.VUE_APP_BASE_URL_API}/data/2.5/weather?q=${String(cityName)}&units=metric&appid=${
                  process.env.VUE_APP_API_KEY
                }`
              );
              if (!!data) {
                context.commit("addNewCity", data);
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  deleteCity(context, id: number) {
    context.commit("deleteCity", id);
  },
  moveItem(context, moveItem: MoveItem) {
    context.commit("moveItem", moveItem);
  },
  async addNewCity(context, weatherItem: WeatherItem) {
    context.commit("addNewCity", weatherItem);
  },
};

const WeatherModule = {
  namespaced: true,
  state: new State(),
  getters: getters,
  mutations: mutations,
  actions: actions,
};

export default WeatherModule;
