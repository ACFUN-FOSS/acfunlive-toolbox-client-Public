import { shallowMount } from "@vue/test-utils";

/*
 * 测试组件HelloWorld
 * 传入：属性 msg
 * 预期：组件中显示内容包含msg
 */
describe("HelloWorld.vue", () => {
	it("renders props.msg when passed", () => {
		const msg = "new message";
		const wrapper = shallowMount(require("@/electron_browser/components/HelloWorld.vue").default, {
			props: { msg }
		});
		expect(wrapper.text()).toMatch(msg);
	});
});
