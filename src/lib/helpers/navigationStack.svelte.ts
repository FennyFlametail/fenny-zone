export default class NavigationStack<ItemType> {
	stack: ItemType[];
	index = $state(0);
	readonly current: ItemType;
	readonly length: number;
	callback: (() => void) | undefined;

	constructor(initialValue: ItemType, onChange?: () => void) {
		this.stack = $state([initialValue]);
		this.current = $derived(this.stack[this.index]);
		this.length = $derived(this.stack.length);
		this.callback = onChange;
	}

	push = (value: ItemType) => {
		this.stack = this.stack.slice(0, this.index + 1);
		this.stack.push(value);
		this.index++;
		this.callback?.();
	};

	back = () => {
		console.debug(this.index);
		if (this.index === 0) return;
		this.index--;
		this.callback?.();
	};

	forward = () => {
		if (this.index === this.stack.length - 1) return;
		this.index++;
		this.callback?.();
	};

	clear = () => {
		this.stack = [];
		this.index = 0;
	};
}
