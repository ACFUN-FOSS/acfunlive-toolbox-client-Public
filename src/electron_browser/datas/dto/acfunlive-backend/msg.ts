// tsdoc imports ====
import {
	getBackendMsgType,
	getBackendMsgDataAsBackendPushDanmakuMsgData
} from "@front/components/danmakuFlow/utils/getter";
import * as DanmakuFlowGetterUtil from "@front/components/danmakuFlow/utils/getter";
// ==================

/**
 * acfunlive-backend websocket 发送的消息的分类（type）的枚举。
 * 通过 {@link getBackendMsgType} 函数获取一个枚举。
 */
// TODO: 将所有的acfunlive-backend websocket 发来的消息的分类在该枚举中表示。
export enum BackendMsgType {
	/**
	 * 推送弹幕（对应 {@link BackendMsgPushDanmakuData}）
	 * @see https://github.com/ACFUN-FOSS/acfunlive-backend/blob/main/doc/%E5%90%8E%E7%AB%AFWebSocket%E6%8E%A5%E5%8F%A3.md#%E5%BC%B9%E5%B9%95
	 */
	PUSH_DANMAKU
}

/* ====== acfunlive-backend websocket 的消息的 data 字段的封裝 ======
 */

/**
 * acfunlive-backend websocket 的**推送彈幕**消息的 data 字段的數據結構的封裝。
 * 本结构体并非**获取弹幕命令**的响应。
 * @see https://github.com/ACFUN-FOSS/acfunlive-backend/blob/main/doc/%E5%90%8E%E7%AB%AFWebSocket%E6%8E%A5%E5%8F%A3.md#%E5%BC%B9%E5%B9%95
 * 获取一个 BackendMsgPushDanmakuData 的相关的信息时，应该尽量采取 {@link DanmakuFlowGetterUtil} 中的函数，而不是直接访问本 interface 的字段。
 */
export interface BackendMsgPushDanmakuData {
	danmuInfo: {
		sendTime: number;
		// TODO: 將 userInfo 封裝成 interface
		userInfo: Record<string, any>;
	};
	content: string;
}

/** TODO: 将更多的对 acfunlive-backend 的请求和响应数据的 data 字段封装成为 interface
 * 写在下面，然后做这些事：
 * - 修改 {@link BackendMsgDataType}
 * - 修改 {@link getBackendMsgType}
 * - 仿照 {@link getBackendMsgDataAsBackendPushDanmakuMsgData}，在其下面编写一个
 * 作用类似的名为 `getBackendMsgDataAsXxxxx` 的函数。
 */

/**
 * 所有可能的acfunlive-backend websocket 发送的消息的 data 类型。
 */
type BackendMsgDataType = BackendMsgPushDanmakuData | any | undefined;

/* =================================================================
 */

/**
 * 對 acfunlive-backend websocket 发送的消息（非心跳包）的數據結構的封裝。
 * @see https://github.com/ACFUN-FOSS/acfunlive-backend/blob/main/doc/%E5%90%8E%E7%AB%AFWebSocket%E6%8E%A5%E5%8F%A3.md
 * @param T data 的类型。
 */
export interface BackendMsg<T extends BackendMsgDataType> {
	type: number;
	requestID: string;
	data: T;
}
