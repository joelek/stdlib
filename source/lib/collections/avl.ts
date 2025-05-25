export type Key = string | number | boolean | undefined | null | bigint;

export type GenericEntry<A, B extends Key> = {
	key: B;
	value: A;
};

export type Entry<A> = GenericEntry<A, number>;

export type Operator = "<" | "<=" | "=" | ">=" | ">";

export type GenericFilter<A extends Key> = {
	operator: Operator;
	key: A;
};

export type Filter = GenericFilter<number>;

export type CollatorResult = "ONE_COMES_FIRST" | "IDENTICAL" | "TWO_COMES_FIRST";

export type Collator<A> = (one: A, two: A) => CollatorResult;

export const COLLATOR: Collator<Key> = (one, two) => {
	if (one == null) {
		if (two == null) {
			return "IDENTICAL";
		} else {
			return "ONE_COMES_FIRST";
		}
	} else {
		if (two == null) {
			return "TWO_COMES_FIRST";
		} else {
			if (one < two) {
				return "ONE_COMES_FIRST";
			}
			if (two < one) {
				return "TWO_COMES_FIRST";
			}
			return "IDENTICAL";
		}
	}
};

export class GenericNode<A, B extends Key> {
	private key: B;
	private value: A;
	private height: number;
	private parent: GenericNode<A, B> | undefined;
	private lower: GenericNode<A, B> | undefined;
	private upper: GenericNode<A, B> | undefined;

	constructor(key: B, value: A, height?: number) {
		this.key = key;
		this.value = value;
		this.height = height ?? 1;
		this.parent = undefined;
		this.lower = undefined;
		this.upper = undefined;
	}

	compare(filter: GenericFilter<B>): number {
		let position = COLLATOR(this.key, filter.key);
		if (filter.operator === "<") {
			if (position === "TWO_COMES_FIRST") {
				return -1;
			} else if (position === "ONE_COMES_FIRST") {
				return 0;
			} else {
				return -1;
			}
		}
		if (filter.operator === "<=") {
			if (position === "TWO_COMES_FIRST") {
				return -1;
			} else if (position === "ONE_COMES_FIRST") {
				return 0;
			} else {
				return 0;
			}
		}
		if (filter.operator === "=") {
			if (position === "TWO_COMES_FIRST") {
				return -1;
			} else if (position === "ONE_COMES_FIRST") {
				return 1;
			} else {
				return 0;
			}
		}
		if (filter.operator === ">=") {
			if (position === "TWO_COMES_FIRST") {
				return 0;
			} else if (position === "ONE_COMES_FIRST") {
				return 1;
			} else {
				return 0;
			}
		}
		if (filter.operator === ">") {
			if (position === "TWO_COMES_FIRST") {
				return 0;
			} else if (position === "ONE_COMES_FIRST") {
				return 1;
			} else {
				return 1;
			}
		}
		throw `Expected code to be unreachable!`;
	}

	computeBalance(): number {
		return (this.upper?.height ?? 0) - (this.lower?.height ?? 0);
	}

	computeHeight(): number {
		return Math.max((this.lower?.height ?? 0), (this.upper?.height ?? 0)) + 1;
	}

	entry(): GenericEntry<A, B> {
		return {
			key: this.key,
			value: this.value
		};
	}

	* filter(...filters: Array<GenericFilter<B>>): Iterable<GenericEntry<A, B>> {
		let lower = true;
		let current = true;
		let upper = true;
		for (let filter of filters) {
			let comparison = this.compare(filter);
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

	getMaximum(): GenericNode<A, B> {
		let node = this as GenericNode<A, B>;
		while (node.upper != null) {
			node = node.upper;
		}
		return node;
	}

	getMinimum(): GenericNode<A, B> {
		let node = this as GenericNode<A, B>;
		while (node.lower != null) {
			node = node.lower;
		}
		return node;
	}

	getLowerParent(): GenericNode<A, B> | undefined {
		let parent = this.parent;
		let child = this as GenericNode<A, B>;
		while (parent != null && child === parent.lower) {
			child = parent;
			parent = parent.parent;
		}
		return parent;
	}

	getUpperParent(): GenericNode<A, B> | undefined {
		let parent = this.parent;
		let child = this as GenericNode<A, B>;
		while (parent != null && child === parent.upper) {
			child = parent;
			parent = parent.parent;
		}
		return parent;
	}

	getPredecessor(): GenericNode<A, B> | undefined {
		if (this.lower != null) {
			return this.lower.getMaximum();
		}
		return this.getLowerParent();
	}

	getSuccessor(): GenericNode<A, B> | undefined {
		if (this.upper != null) {
			return this.upper.getMinimum();
		}
		return this.getUpperParent();
	}

	insert(node: GenericNode<A, B>): GenericNode<A, B> {
		let position = COLLATOR(node.key, this.key);
		if (position === "IDENTICAL") {
			this.value = node.value;
			return this;
		}
		if (position === "ONE_COMES_FIRST") {
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

	locate(filter: GenericFilter<B>): GenericNode<A, B> | undefined {
		let position = COLLATOR(filter.key, this.key);
		if (position === "IDENTICAL") {
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
		if (position === "ONE_COMES_FIRST") {
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

	rebalance(): GenericNode<A, B> {
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

	remove(key: B): GenericNode<A, B> | undefined {
		let position = COLLATOR(key, this.key);
		if (position === "IDENTICAL") {
			if (this.lower != null) {
				if (this.upper != null) {
					let { key, value } = this.upper.getMinimum();
					this.setUpper(this.upper.remove(key));
					this.key = key;
					this.value = value;
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
		if (position === "ONE_COMES_FIRST") {
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

	rotateLeft(): GenericNode<A, B> {
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

	rotateRight(): GenericNode<A, B> {
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

	getParent(): GenericNode<A, B> | undefined {
		return this.parent;
	}

	setParent(parent: GenericNode<A, B> | undefined): void {
		if (this.parent != null) {
			if (this.parent.lower === this) {
				this.parent.lower = undefined;
			} else if (this.parent.upper === this) {
				this.parent.upper = undefined;
			}
		}
		this.parent = parent;
	}

	getLower(): GenericNode<A, B> | undefined {
		return this.lower;
	}

	setLower(lower: GenericNode<A, B> | undefined): void {
		if (lower != null) {
			lower.setParent(this);
		}
		if (this.lower != null) {
			this.lower.setParent(undefined);
		}
		this.lower = lower;
	}

	getUpper(): GenericNode<A, B> | undefined {
		return this.upper;
	}

	setUpper(upper: GenericNode<A, B> | undefined): void {
		if (upper != null) {
			upper.setParent(this);
		}
		if (this.upper != null) {
			this.upper.setParent(undefined);
		}
		this.upper = upper;
	}
};

export class Node<A> extends GenericNode<A, number> {};

export class GenericTree<A, B extends Key> {
	private root: GenericNode<A, B> | undefined;

	constructor() {
		this.root = undefined;
	}

	* [Symbol.iterator](): Iterator<GenericEntry<A, B>> {
		yield * this.filter();
	}

	clear(): void {
		this.vacate();
	}

	* filter(...filters: GenericFilter<B>[]): Iterable<GenericEntry<A, B>> {
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

	insert(key: B, value: A): void {
		let node = new GenericNode<A, B>(key, value);
		if (this.root != null) {
			this.root = this.root.insert(node);
			this.root?.setParent(undefined);
		} else {
			this.root = node;
		}
	}

	length(): number {
		let length = 0;
		for (let entry of this) {
			length += 1;
		}
		return length;
	}

	locate(filter: GenericFilter<B>): GenericEntry<A, B> | undefined {
		if (this.root != null) {
			return this.root.locate(filter)?.entry();
		}
	}

	lookup(key: B): A | undefined {
		return this.locate({ operator: "=", key: key })?.value;
	}

	remove(key: B): void {
		if (this.root != null) {
			this.root = this.root.remove(key);
			this.root?.setParent(undefined);
		}
	}

	vacate(): void {
		this.root = undefined;
	}
};

export class Tree<A> extends GenericTree<A, number> {};
