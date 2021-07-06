/*
 * AcFunlive toolbox client, AcFun直播工具箱的客戶端
 * 版權所有 (C) 2020 ACFUN-FOC(ACFUN自由與開源9課)
 * 此程序爲自由軟件：本程序遵守自由軟件聯盟(FSF)所發佈之GNU Affero通用公共許可第三版。
 * 在此條約下、伱可以再發行・修改之。
 * 我等開發者希望本程序能是實用的軟件、竝心懷如此願望而發佈。但此程序
 * ！       ！       ！       ！
 * 無       有       擔       保  。
 * ！       ！       ！       ！
 * 無 有 任 何 擔 保 。甚至不保證它能有用・能對伱產生經濟效益。
 * 伱應該收到了一份GNU Affero通用公共許可第三版、它伴隨着本程序。若伱沒有收到，請查閱
 * <http://www.gnu.org/licenses/>。同時提供伱的電子郵寄地址或傳統的郵件聯繫方式。
 */
import "@front/styles/index.scss";
import ElementPlus from "element-plus";

import store from "@front/store";
import router from "@front/router";
import App from "@front/App.vue";
import { initGlobalComp } from "@front/components/injector";
import { registerMethod } from "@front/util_function/globalRegister";
import { createApp, h } from "vue";

const app = createApp({
	render: () => h(App)
})
	.use(ElementPlus)
	.use(router)
	.use(store);
initGlobalComp(app);
registerMethod();
app.mount("body");
