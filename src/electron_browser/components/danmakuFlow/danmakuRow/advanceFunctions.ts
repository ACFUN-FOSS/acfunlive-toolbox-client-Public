import {
	getDanmuInfo,
	getUserInfo,
	getTime,
	setTime,
	getMedal,
	getMedalLevel,
	getMedalName,
	getAvatar,
	getNickName,
	getUID,
	getContent,
	getGift,
	getDanmakuType,
	getGiftName,
	getGiftCombo,
	getGiftNumber,
	getGiftValue,
	getRichText,
	getContentWithEmoji
} from "@front/components/danmakuFlow/utils/getter";

import {
	hasTime,
	hasMedal,
	hasAvatar,
	hasNickName,
	hasContent,
	hasGift,
	isManager,
	isOwner
} from "@front/components/danmakuFlow/utils/tester";

import { format as dateFormat } from "date-fns";
import lodash from "lodash";

export const danmakuTesters = {
	hasTime,
	hasMedal,
	hasAvatar,
	hasNickName,
	hasContent,
	hasGift,
	isManager,
	isOwner
};
export const danmakuGetters = {
	getDanmuInfo,
	getUserInfo,
	getTime,
	setTime,
	getMedal,
	getMedalLevel,
	getMedalName,
	getAvatar,
	getNickName,
	getUID,
	getContent,
	getGift,
	getDanmakuType,
	getGiftName,
	getGiftCombo,
	getGiftNumber,
	getGiftValue,
	getRichText,
	getContentWithEmoji
};
export default {
	hasTime,
	hasMedal,
	hasAvatar,
	hasNickName,
	hasContent,
	hasGift,
	isManager,
	isOwner,
	getDanmuInfo,
	getUserInfo,
	getTime,
	setTime,
	getMedal,
	getMedalLevel,
	getMedalName,
	getAvatar,
	getNickName,
	getUID,
	getContent,
	getGift,
	getDanmakuType,
	getGiftName,
	getGiftCombo,
	getGiftNumber,
	getGiftValue,
	getRichText,
	getContentWithEmoji,
	dateFormat,
	...lodash
};
