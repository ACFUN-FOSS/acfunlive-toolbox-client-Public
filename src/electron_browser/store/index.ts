import { Store, StoreOptions } from "vuex";
import { state } from "./state";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { actions } from "./actions";
// import generalState from "@front/store/general/general";

const store: StoreOptions<any> = {
	state,
	getters,
	mutations,
	actions
};

export default new Store(store);
