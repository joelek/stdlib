export type Entry<A> = {
	key: number;
	value: A;
};

export type Operator = "<" | "<=" | "=" | ">=" | ">";

export type Filter = {
	operator: Operator;
	key: number;
};

export class Node<A> {
	private key: number;
	private value: A;
	private height: number;
	private parent: Node<A> | undefined;
	private lower: Node<A> | undefined;
	private upper: Node<A> | undefined;

	constructor(key: number, value: A, height?: number) {
		this.key = key;
		this.value = value;
		this.height = height ?? 1;
		this.parent = undefined;
		this.lower = undefined;
		this.upper = undefined;
	}

	compare(filter: Filter): number | undefined {
		let operator = filter.operator;
		let key = filter.key;
		if (operator === "<") {
			if (key < this.key) {
				return;
			} else if (key > this.key) {
				return 0;
			} else {
				return -1;
			}
		} else if (operator === "<=") {
			if (key < this.key) {
				return;
			} else if (key > this.key) {
				return 0;
			} else {
				return 0;
			}
		} else if (operator === "=") {
			if (key < this.key) {
				return -1;
			} else if (key > this.key) {
				return 1;
			} else {
				return 0;
			}
		} else if (operator === ">=") {
			if (key < this.key) {
				return 0;
			} else if (key > this.key) {
				return;
			} else {
				return 0;
			}
		} else if (operator === ">") {
			if (key < this.key) {
				return 0;
			} else if (key > this.key) {
				return;
			} else {
				return 1;
			}
		}
	}

	computeBalance(): number {
		return (this.upper?.height ?? 0) - (this.lower?.height ?? 0);
	}

	computeHeight(): number {
		return Math.max((this.lower?.height ?? 0), (this.upper?.height ?? 0)) + 1;
	}

	entry(): Entry<A> {
		return {
			key: this.key,
			value: this.value
		};
	}

	* filter(...filters: Array<Filter>): Iterable<Entry<A>> {
		let lower = true;
		let current = true;
		let upper = true;
		for (let filter of filters) {
			let comparison = this.compare(filter);
			if (comparison == null) {
				return;
			}
			lower = lower && comparison <= 0;
			current = current && comparison === 0;
			upper = upper && comparison >= 0;
		}
		if (lower && this.lower != null) {
			yield * this.lower.filter(...filters);
		}
		if (current) {
			yield this.entry();
		}
		if (upper && this.upper != null) {
			yield * this.upper.filter(...filters);
		}
	}

	getMaximum(): Node<A> {
		let node = this as Node<A>;
		while (node.upper != null) {
			node = node.upper;
		}
		return node;
	}

	getMinimum(): Node<A> {
		let node = this as Node<A>;
		while (node.lower != null) {
			node = node.lower;
		}
		return node;
	}

	getLowerParent(): Node<A> | undefined {
		let parent = this.parent;
		let child = this as Node<A>;
		while (parent != null && child === parent.lower) {
			child = parent;
			parent = parent.parent;
		}
		return parent;
	}

	getUpperParent(): Node<A> | undefined {
		let parent = this.parent;
		let child = this as Node<A>;
		while (parent != null && child === parent.upper) {
			child = parent;
			parent = parent.parent;
		}
		return parent;
	}

	getPredecessor(): Node<A> | undefined {
		if (this.lower != null) {
			return this.lower.getMaximum();
		}
		return this.getLowerParent();
	}

	getSuccessor(): Node<A> | undefined {
		if (this.upper != null) {
			return this.upper.getMinimum();
		}
		return this.getUpperParent();
	}

	insert(node: Node<A>): Node<A> {
		if (node.key === this.key) {
			this.value = node.value;
			return this;
		}
		if (node.key < this.key) {
			if (this.lower == null) {
				this.setLower(node);
			} else {
				this.setLower(this.lower.insert(node));
			}
		} else {
			if (this.upper == null) {
				this.setUpper(node);
			} else {
				this.setUpper(this.upper.insert(node));
			}
		}
		this.setHeight(this.computeHeight());
		return this.rebalance();
	}

	locate(filter: Filter): Node<A> | undefined {
		if (filter.key === this.key) {
			if (filter.operator === "<") {
				return this.getPredecessor();
			}
			if (filter.operator === "<=") {
				return this;
			}
			if (filter.operator === "=") {
				return this;
			}
			if (filter.operator === ">=") {
				return this;
			}
			if (filter.operator === ">") {
				return this.getSuccessor();
			}
		}
		if (filter.key < this.key) {
			if (this.lower != null) {
				return this.lower.locate(filter);
			} else {
				if (filter.operator === "<") {
					return this.getLowerParent();
				}
				if (filter.operator === "<=") {
					return this.getLowerParent();
				}
				if (filter.operator === ">=") {
					return this;
				}
				if (filter.operator === ">") {
					return this;
				}
			}
		} else {
			if (this.upper != null) {
				return this.upper.locate(filter);
			} else {
				if (filter.operator === "<") {
					return this;
				}
				if (filter.operator === "<=") {
					return this;
				}
				if (filter.operator === ">=") {
					return this.getUpperParent();
				}
				if (filter.operator === ">") {
					return this.getUpperParent();
				}
			}
		}
	}

	rebalance(): Node<A> {
		let balance = this.computeBalance();
		if (balance < -1) {
			if (this.lower == null) {
				throw `Expected lower child to be non-null!`;
			}
			let balance = this.lower.computeBalance();
			if (balance <= 0) {
				return this.rotateRight();
			} else {
				this.setLower(this.lower.rotateLeft());
				return this.rotateRight();
			}
		}
		if (balance > 1) {
			if (this.upper == null) {
				throw `Expected upper child to be non-null!`;
			}
			let balance = this.upper.computeBalance();
			if (balance >= 0) {
				return this.rotateLeft();
			} else {
				this.setUpper(this.upper.rotateRight());
				return this.rotateLeft();
			}
		}
		return this;
	}

	remove(key: number): Node<A> | undefined {
		if (key === this.key) {
			if (this.lower != null) {
				if (this.upper != null) {
					let minimum = this.upper.getMinimum();
					let key = minimum.key;
					this.setUpper(this.upper.remove(key));
					this.key = key;
					this.setHeight(this.computeHeight());
					return this.rebalance();
				} else {
					return this.lower;
				}
			} else {
				if (this.upper != null) {
					return this.upper;
				} else {
					return;
				}
			}
		}
		if (key < this.key) {
			if (this.lower != null) {
				this.setLower(this.lower.remove(key));
			} else {
				return this;
			}
		} else {
			if (this.upper != null) {
				this.setUpper(this.upper.remove(key));
			} else {
				return this;
			}
		}
		this.setHeight(this.computeHeight());
		return this.rebalance();
	}

	rotateLeft(): Node<A> {
		let upper = this.upper;
		if (upper == null) {
			throw `Expected upper child to be non-null!`;
		}
		this.setUpper(upper.lower);
		upper.setLower(this);
		this.setHeight(this.computeHeight());
		upper.setHeight(upper.computeHeight());
		return upper;
	}

	rotateRight(): Node<A> {
		let lower = this.lower;
		if (lower == null) {
			throw `Expected lower child to be non-null!`;
		}
		this.setLower(lower.upper);
		lower.setUpper(this);
		this.setHeight(this.computeHeight());
		lower.setHeight(lower.computeHeight());
		return lower;
	}

	getHeight(): number {
		return this.height;
	}

	setHeight(height: number): number {
		return this.height = height;
	}

	getParent(): Node<A> | undefined {
		return this.parent;
	}

	setParent(parent: Node<A> | undefined): void {
		if (this.parent != null) {
			if (this.parent.lower === this) {
				this.parent.lower = undefined;
			} else if (this.parent.upper === this) {
				this.parent.upper = undefined;
			}
		}
		this.parent = parent;
	}

	getLower(): Node<A> | undefined {
		return this.lower;
	}

	setLower(lower: Node<A> | undefined): void {
		if (lower != null) {
			lower.setParent(this);
		}
		if (this.lower != null) {
			this.lower.setParent(undefined);
		}
		this.lower = lower;
	}

	getUpper(): Node<A> | undefined {
		return this.upper;
	}

	setUpper(upper: Node<A> | undefined): void {
		if (upper != null) {
			upper.setParent(this);
		}
		if (this.upper != null) {
			this.upper.setParent(undefined);
		}
		this.upper = upper;
	}
};

export class Tree<A> {
	private root: Node<A> | undefined;

	constructor() {
		this.root = undefined;
	}

	* [Symbol.iterator](): Iterable<Entry<A>> {
		yield * this.filter();
	}

	clear(): void {
		this.root = undefined;
	}

	* filter(...filters: Filter[]): Iterable<Entry<A>> {
		if (this.root == null) {
			return;
		}
		for (let node of this.root.filter(...filters)) {
			yield {
				key: node.key,
				value: node.value
			};
		}
	}

	insert(key: number, value: A): void {
		let node = new Node<A>(key, value);
		if (this.root != null) {
			this.root = this.root.insert(node);
		} else {
			this.root = node;
		}
	}

	length(): number {
		let length = 0;
		for (let entry in this) {
			length += 1;
		}
		return length;
	}

	locate(filter: Filter): Entry<A> | undefined {
		if (this.root != null) {
			return this.root.locate(filter)?.entry();
		}
	}

	lookup(key: number): A | undefined {
		return this.locate({ operator: "=", key: key })?.value;
	}

	remove(key: number): void {
		if (this.root != null) {
			this.root = this.root.remove(key);
		}
	}
};
