export interface rightClickMenuItem {
	name: string;
	icon: string;
	show: boolean;
	disabled?: boolean;
	event?: any;
	children?: Array<rightClickMenuItem>;
}
