import { Store, StoreOptions } from "vuex";
import { state } from "./state";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { actions } from "./actions";
import { throttle } from "lodash";
// import generalState from "@front/store/general/general";

// const proxyState = reactive(state);

const store = new Store({
	state,
	getters,
	mutations,
	actions
});

export default store;
