import { RootState, state } from "./state";
import _ from "lodash";
import { tostring } from "@front/util_function/type";
export const getters = {
	isStreaming(state: RootState) {
		return (
			state.streamStatus.step === "streaming" ||
			state.streamStatus.step === "danmakuing"
		);
	},
	isLogined(state: RootState) {
		return state.userSession.serviceToken && state.userSession.deviceID;
	},
	categoryCascade(state: RootState) {
		const output: any = {};
		state.roomCategorys.forEach((subCategory: any) => {
			if (!output[subCategory.categoryID]) {
				output[subCategory.categoryID] = {
					label: subCategory.categoryName,
					value: subCategory.categoryID,
					children: []
				};
			}
			output[subCategory.categoryID].children.push({
				label: subCategory.subCategoryName,
				value: subCategory.subCategoryID
			});
		});
		return Object.values(output);
	},
	danmakuList: (state: RootState) => {
		return state.danmakuSession.filterFlow;
	},
	danmakuProfile: (state: RootState) => (type: any) => {
		if (type) {
			// @ts-ignore
			return state.danmakuProfile[tostring(type)];
		} else if (state.isElectron) {
			return state.danmakuProfile.toolBox;
		} else {
			return state.danmakuProfile.web;
		}
	}
};
