import { RootState, state } from "./state";
import _ from "lodash";
export const getters = {
	streamMonitor(state: RootState) {
		return state.streamStatus.avaliable && state.streamStatus.underway;
	},
	streamStatus(state: RootState) {
		return {};
	},
	api(state: RootState) {
		return state.api;
	},
	mainCategorys(state: RootState) {
		return _.uniqBy(state.roomCategorys, "categoryID");
	},
	subCategorys: (state: RootState) => (id: number) => {
		return state.roomCategorys.filter((item: any) => {
			return item.categoryID === id;
		});
	},
	danmakuList: (state: RootState) => {
		return state.danmakuSession.rawFlow.filter(item => {
			switch (item.type) {
				case 1000:
					return true;
				case 1001:
					return true;
				case 1002:
					return true;
				case 1003:
					return true;
				case 1005:
					return true;
				case 1007:
					return true;
				default:
					return false;
			}
		});
	}
};
