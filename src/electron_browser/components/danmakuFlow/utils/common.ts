import { Settings, CommonSettings } from "@front/datas/danmaku";
import { Rank } from "@front/datas/room";
import { getContent, getUserInfo, getMedal, getUID } from "./getter";
import { reactive } from "vue";
import {
	isOwner as ownerTest,
	isManager as managerTest,
	sameGift,
	samePerson
} from "./tester";
import { typeOptions } from "@front/components/danmakuFlow/utils/data";
import { rightClickMenuItem } from "@front/datas/component";
import { Store } from "vuex";
import { ElMessage } from "element-plus";
import { state } from "@front/store/state";
const types = typeOptions().map((i: any) => i.value);

export class Filter {
	giftList: any = [];
	likeList: any = [];
	enterList: any = [];
	filter = (
		danmaku: Array<any>,
		{ filter, maxNum, clubLevel, settingOfType }: Settings,
		{ blackList, keywords }: CommonSettings,
		rank: Rank
	): any => {
		danmaku = danmaku.filter(i => {
			return types.indexOf(i.type) > -1;
		});
		if (!filter.open) {
			return danmaku.slice(0, maxNum);
		}
		const keys = Object.keys(settingOfType);
		let count = 0;
		let hasCombined = false;
		let hasBlackList = false;
		let hasKeywordBlocked = false;

		const output: Array<any> = [];
		for (let i of danmaku) {
			let needFreeze = true;
			const isOwner = ownerTest(i, state);
			if (count > maxNum) {
				break; // reach maxnum
			}
			if (
				filter.types.indexOf(i.type) < 0 ||
				keys.indexOf(String(i.type)) < 0
			) {
				continue; // hide specific type danmaku
			}

			if (
				!isOwner &&
				filter.blackList &&
				blackList.find(u => {
					return (
						u === getUserInfo(i).userID ||
						u.userID === getUserInfo(i).userID
					);
				})
			) {
				hasBlackList = true;
				continue; // filter out blackList
			}

			if (
				!isOwner &&
				filter.clubOnly &&
				rank.clubName &&
				getMedal(i)?.clubName !== rank.clubName
			) {
				continue; // filter out no club member
			}
			if (!isOwner && getMedal(i)?.level < clubLevel) {
				continue;
			}
			if (
				!isOwner &&
				i.type === 1000 &&
				keywords.find(u => {
					return getContent(i).includes(u);
				})
			) {
				hasKeywordBlocked = true;
				continue; // filter out keyword
			} else if (i.type === 1001 && filter.combineLike) {
				this.likeList = this.likeList.slice(0, 5);
				const like = this.likeList.find((l: any) => samePerson(i, l));
				if (like) {
					like.combineCount += 1;
					hasCombined = true;
					continue;
				} else {
					needFreeze = false;
					i = reactive({
						...i,
						combineCount: 1
					});
					this.likeList.unshift(i);
				}
			} else if (i.type === 1002 && filter.combineEnter) {
				this.enterList = this.enterList.slice(0, 10);
				const enter = this.enterList.find((l: any) => samePerson(i, l));
				if (enter) {
					enter.combineCount += 1;
					hasCombined = true;
					continue;
				} else {
					needFreeze = false;
					i = reactive({
						...i,
						combineCount: 1
					});
					this.enterList.unshift(i);
				}
			} else if (i.type === 1005 && filter.combineGift) {
				const now = Date.now();
				this.giftList = this.giftList.filter(
					(i: any) => now < i.expire
				);
				const gift = this.giftList.find(
					(g: any) => samePerson(i, g) && sameGift(i, g)
				);
				if (gift) {
					gift.count += i.data.count;
					gift.expire = now + 5000;
					hasCombined = true;
					continue;
				} else {
					needFreeze = false;
					i = reactive({
						...i,
						expire: now + 5000,
						count: i.data.count
					});
					this.giftList.unshift(i);
				}
			}
			output.push(needFreeze ? Object.freeze(i) : i);
			count++;
		}

		return {
			filtered: output,
			hasCombined,
			hasBlackList,
			hasKeywordBlocked
		};
	};

	filterUpdate = (
		changedDanmaku: Array<any>,
		OldDanmaku: Array<any>,
		settings: Settings,
		commonSettings: CommonSettings,
		rank: Rank
	) => {
		const result = this.filter(
			changedDanmaku,
			settings,
			commonSettings,
			rank
		);
		return {
			list: this.filterMaxnium(
				[...result.filtered.reverse(), ...OldDanmaku],
				settings
			),
			...result
		};
	};

	filterMaxnium = (danmaku: Array<any>, settings: Settings) => {
		if (danmaku.length > settings.maxNum * 2) {
			return danmaku.slice(0, settings.maxNum);
		}
		return danmaku;
	};
}

export const menu = (
	danmaku: any,
	store: Store<any>
): Array<rightClickMenuItem> => {
	if (!danmaku) {
		return [];
	}
	const userProfile = getUserInfo(danmaku);
	const isOwner = ownerTest(danmaku, store.state);
	const isManager = managerTest(danmaku, store.state);
	const isBlackList = store.state.danmakuProfile.common.blackList.find(
		(i: any) => i.userID === userProfile.userID
	);
	const likeList = store.state.danmakuProfile.common.likeList || [];
	const isLikeList = likeList.find(
		(i: any) => i.userID === userProfile.userID
	);
	return [
		{
			name: `当前选择:${getUserInfo(danmaku).nickname}`,
			icon: "el-icon-user-solid",
			show: true,
			disabled: true
		},
		{
			name: "个人主页",
			icon: "el-icon-arrow-right",
			show: true,
			disabled: false,
			event: () => {
				window.open(`https://www.acfun.cn/u/${getUID(danmaku)}`);
			}
		},
		{
			name: "取消房管",
			icon: "el-icon-arrow-right",
			show: !isOwner && isManager,
			disabled: false,
			event: () => {
				store.commit("removeManager", userProfile.userID);
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}解除房管`
				});
			}
		},
		{
			name: "添加房管",
			icon: "el-icon-arrow-right",
			show: !isOwner && !isManager,
			disabled: false,
			event: () => {
				store.commit("addManager", userProfile.userID);
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}设为房管`
				});
			}
		},
		{
			name: "加入特别关心",
			icon: "el-icon-arrow-right",
			show: !isOwner && !isLikeList,
			disabled: false,
			event: () => {
				store.commit("addLikeList", {
					userID: userProfile.userID,
					nickname: userProfile.nickname
				});
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}加入特别关心`
				});
			}
		},
		{
			name: "取消特别关心",
			icon: "el-icon-arrow-right",
			show: !isOwner && isLikeList,
			disabled: false,
			event: () => {
				store.commit("removeLikeList", {
					userID: userProfile.userID,
					nickname: userProfile.nickname
				});
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}移出特别关心`
				});
			}
		},
		{
			name: "原谅他（解除拉黑）",
			icon: "el-icon-arrow-right",
			show: !isOwner && isBlackList,
			disabled: false,
			event: () => {
				store.commit("removeBlackList", {
					userID: userProfile.userID,
					nickname: userProfile.nickname
				});
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}移出黑名单`
				});
			}
		},
		{
			name: "拉黑他！",
			icon: "el-icon-arrow-right",
			show: !isOwner && !isBlackList,
			disabled: false,
			event: () => {
				store.commit("addBlackList", {
					userID: userProfile.userID,
					nickname: userProfile.nickname
				});
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}拉黑`
				});
			}
		},
		{
			name: "踢出去！",
			icon: "el-icon-arrow-right",
			show: !isOwner,
			disabled: false,
			event: () => {
				store.commit("kickOut", userProfile.userID);
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将${userProfile.nickname}踢出直播间`
				});
			}
		},
		{
			name: "屏蔽该关键词",
			icon: "el-icon-arrow-right",
			show: Boolean(getContent(danmaku)),
			disabled: false,
			event: () => {
				store.commit("addKeyword", getContent(danmaku));
				ElMessage({
					duration: 1500,
					type: "success",
					message: `已将 ${getContent(danmaku)} 设为屏蔽词`
				});
			}
		}
	];
};
