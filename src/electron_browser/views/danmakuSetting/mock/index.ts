import mockData from "./danmaku.json";
import cloneDeep from "lodash/cloneDeep";
import sampleSize from "lodash/sampleSize";
import sample from "lodash/sample";
import { basicComponentTester } from "@front/components/danmakuFlow/utils/tester";
import {
	setTime,
	getGiftValue
} from "@front/components/danmakuFlow/utils/getter";
let timestamp = new Date().getTime();
export const initMock = (): Array<any> => {
	return getMock(10);
};

export const getMock = (mockNum = 1): Array<any> => {
	const result: any = [];
	sampleSize(mockData, mockNum).forEach((mock: any) => {
		result.unshift(Object.freeze(setTime(cloneDeep(mock), timestamp)));
		timestamp += 1000;
	});
	return result;
};

export const getMockByType = (type: number | string): any => {
	if (!type) {
		return mockData[0];
	}

	// @ts-ignore
	const testers = basicComponentTester[type];
	return setTime(
		{
			...sample(
				mockData.filter((i: any) => {
					let pass = String(i.type) === String(type);
					if (pass && testers && testers.length) {
						testers.forEach((tester: any) => {
							if (!tester(i)) pass = false;
						});
					}
					return pass;
				})
			)
		},
		Date.now()
	);
};

export const getPaidGift = (): any => {
	return sample(
		mockData.filter((i: any) => {
			return i.type === 1005 && getGiftValue(i) > 0;
		})
	);
};
