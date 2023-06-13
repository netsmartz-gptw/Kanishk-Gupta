import { createStore } from "redux";
import rootReducer from "../reducers";

const persistedState = localStorage.getItem('appState') ? JSON.parse(localStorage.getItem('appState')) : undefined;

const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    localStorage.setItem('appState', JSON.stringify(store.getState()));
});

export default store;