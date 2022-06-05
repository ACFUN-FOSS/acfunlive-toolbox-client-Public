import * as common from "./common";
import * as danmaku from "./danmaku";
import * as room from "./room";
// export * as server from "./server";
import * as stream from "./stream";
import * as user from "./user";
import * as statistic from "./statistic";
export { wsevent } from "./wsbus";

const allApi = {
	...common,
	...danmaku,
	...room,
	...stream,
	...user,
	...statistic
};
export { common, danmaku, room, stream, user, statistic, allApi };
