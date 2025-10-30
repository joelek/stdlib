export type Expression = RegExp;

export type Expressions<A extends Expressions<A>> = {
	[B in Extract<keyof A, string>]: Expression;
};

export type Token<A extends string> = {
	row: number;
	col: number;
	type: A;
	value: string;
};

export class UnexpectedEndError extends Error {
	constructor() {
		super();
	}

	get message(): string {
		return `Unexpectedly reached end of token stream!`;
	}
};

export class UnexpectedExecutionError extends Error {
	constructor() {
		super();
	}

	get message(): string {
		return `Unexpectedly reached code believed to be unreachable!`;
	}
};

export class UnexpectedTokenError extends Error {
	readonly token: Token<string>;

	constructor(token: Token<string>) {
		super();
		this.token = token;
	}

	get message(): string {
		return `Unexpected token "${this.token.type}" at row ${this.token.row}, col ${this.token.col}!`;
	}
};

export class UnrecognizedTokenError extends Error {
	readonly row: number;
	readonly col: number;

	constructor(row: number, col: number) {
		super();
		this.row = row;
		this.col = col;
	}

	get message(): string {
		return `Unrecognized token at row ${this.row}, col ${this.col}!`;
	}
};

export class UnexpectedAnchor extends Error {
	constructor() {
		super();
	}

	get message(): string {
		return `Unexpected anchor in regular expression!`;
	}
};

export type Producer<A extends Expressions<A>, B> = (read: Parser<A>["read"], peek: Parser<A>["peek"], skip: Parser<A>["skip"]) => B;

export type Producers<A extends Expressions<A>, B extends any[]> = {
	[C in keyof B]: (parser: Parser<A>) => B[C];
};

export class Parser<A extends Expressions<A>> {
	protected expressions: Expressions<A>;
	protected generator: Generator<Token<Extract<keyof A, string>>>;
	protected tokens: Array<Token<Extract<keyof A, string>>>;
	protected token_index: number;
	protected filter: Array<Extract<keyof A, string>>;
	protected bound_read = this.read.bind(this);
	protected bound_peek = this.peek.bind(this);
	protected bound_skip = this.skip.bind(this);

	protected getNextToken(): Token<Extract<keyof A, string>> | undefined {
		if (this.token_index < this.tokens.length) {
			return this.tokens[this.token_index];
		} else {
			let token = this.generator.next().value;
			if (token == null) {
				return;
			}
			this.tokens.push(token);
			return token;
		}
	}

	protected peek(): Token<Extract<keyof A, string>>;
	protected peek<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined;
	protected peek<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined {
		let token = this.skip(...this.filter);
		if (token == null) {
			return;
		}
		if (types.length === 0) {
			return token;
		}
		for (let type of types) {
			if (token.type === type) {
				return token;
			}
		}
		for (let type of types) {
			if (this.expressions[type].test(token.value)) {
				return {
					...token,
					type: type
				};
			}
		}
	}

	protected read(): Token<Extract<keyof A, string>>;
	protected read<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>>;
	protected read<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> {
		let token = this.skip(...this.filter);
		if (token == null) {
			throw new UnexpectedEndError();
		}
		this.token_index += 1;
		if (types.length === 0) {
			return token;
		}
		for (let type of types) {
			if (token.type === type) {
				return token;
			}
		}
		for (let type of types) {
			if (this.expressions[type].test(token.value)) {
				return {
					...token,
					type: type
				};
			}
		}
		throw new UnexpectedTokenError(token);
	}

	protected skip(): Token<Extract<keyof A, string>>;
	protected skip<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined;
	protected skip<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined {
		if (types.length === 0) {
			return this.getNextToken();
		}
		while (true) {
			let token = this.getNextToken();
			if (token == null) {
				return;
			}
			let matches = false;
			for (let type of types) {
				if (token.type === type) {
					matches = true;
					break;
				}
			}
			if (matches) {
				this.token_index += 1;
				continue;
			}
			for (let type of types) {
				if (this.expressions[type].test(token.value)) {
					matches = true;
					break;
				}
			}
			if (matches) {
				this.token_index += 1;
				continue;
			}
			return token;
		}
	}

	constructor(expressions: A, generator: Generator<Token<Extract<keyof A, string>>>) {
		this.expressions = {} as A;
		for (let type in expressions) {
			let expression = expressions[type];
			this.expressions[type] = new RegExp(`^(${expression.source})$`, `${expression.ignoreCase ? "isu" : "su"}`) as any;
		}
		this.generator = generator;
		this.tokens = [];
		this.token_index = 0;
		this.filter = [];
	}

	parse<B>(filter: Array<Extract<keyof A, string>>, producer: Producer<A, B>): B {
		let previous_filter = this.filter;
		let previous_token_index = this.token_index;
		try {
			this.filter = filter;
			try {
				return producer(this.bound_read, this.bound_peek, this.bound_skip);
			} catch (error) {
				this.token_index = previous_token_index;
				throw error;
			}
		} finally {
			this.filter = previous_filter;
		}
	}

	parseFirst<B extends any[]>(...producers: Producers<A, B>): B[number] {
		let unexpected_end_errors = [] as Array<UnexpectedEndError>;
		let unexpected_token_errors = [] as Array<UnexpectedTokenError>;
		let unrecognized_token_errors = [] as Array<UnrecognizedTokenError>;
		let other_errors = [] as Array<any>;
		for (let producer of producers) {
			try {
				return producer(this);
			} catch (error) {
				if (error instanceof UnexpectedEndError) {
					unexpected_end_errors.push(error);
				} else if (error instanceof UnexpectedTokenError) {
					unexpected_token_errors.push(error);
				} else if (error instanceof UnrecognizedTokenError) {
					unrecognized_token_errors.push(error);
				} else {
					other_errors.push(error);
				}
			}
		}
		let unexpected_end_error = unexpected_end_errors.pop();
		if (unexpected_end_error != null) {
			throw unexpected_end_error;
		}
		unexpected_token_errors.sort((one, two) => {
			if (one.token.row < two.token.row) {
				return -1;
			}
			if (one.token.row > two.token.row) {
				return 1;
			}
			if (one.token.col < two.token.col) {
				return -1;
			}
			if (one.token.col > two.token.col) {
				return 1;
			}
			return 0;
		});
		let unexpected_token_error = unexpected_token_errors.pop();
		if (unexpected_token_error != null) {
			throw unexpected_token_error;
		}
		let unrecognized_token_error = unrecognized_token_errors.pop();
		if (unrecognized_token_error != null) {
			throw unrecognized_token_error;
		}
		let other_error = other_errors.pop();
		if (other_error != null) {
			throw other_error;
		}
		throw new UnexpectedExecutionError();
	}

	parseLongest<B extends any[]>(...producers: Producers<A, B>): B[number] {
		let unexpected_end_errors = [] as Array<UnexpectedEndError>;
		let unexpected_token_errors = [] as Array<UnexpectedTokenError>;
		let unrecognized_token_errors = [] as Array<UnrecognizedTokenError>;
		let other_errors = [] as Array<any>;
		let results = [] as Array<{
			result: B[number];
			token_index: number;
		}>;
		let token_index = this.token_index;
		for (let producer of producers) {
			try {
				let result = producer(this);
				let token_index = this.token_index;
				results.push({
					result,
					token_index
				});
			} catch (error) {
				if (error instanceof UnexpectedEndError) {
					unexpected_end_errors.push(error);
				} else if (error instanceof UnexpectedTokenError) {
					unexpected_token_errors.push(error);
				} else if (error instanceof UnrecognizedTokenError) {
					unrecognized_token_errors.push(error);
				} else {
					other_errors.push(error);
				}
			}
			this.token_index = token_index;
		}
		results.sort((one, two) => one.token_index - two.token_index);
		let result = results.pop();
		if (result != null) {
			this.token_index = result.token_index;
			return result.result;
		}
		let unexpected_end_error = unexpected_end_errors.pop();
		if (unexpected_end_error != null) {
			throw unexpected_end_error;
		}
		unexpected_token_errors.sort((one, two) => {
			if (one.token.row < two.token.row) {
				return -1;
			}
			if (one.token.row > two.token.row) {
				return 1;
			}
			if (one.token.col < two.token.col) {
				return -1;
			}
			if (one.token.col > two.token.col) {
				return 1;
			}
			return 0;
		});
		let unexpected_token_error = unexpected_token_errors.pop();
		if (unexpected_token_error != null) {
			throw unexpected_token_error;
		}
		let unrecognized_token_error = unrecognized_token_errors.pop();
		if (unrecognized_token_error != null) {
			throw unrecognized_token_error;
		}
		let other_error = other_errors.pop();
		if (other_error != null) {
			throw other_error;
		}
		throw new UnexpectedExecutionError();
	}
};

// The first successfully matched branch of a branched expression is matched instead of the longest successfully matched branch.
export class Tokenizer<A extends Expressions<A>> {
	protected expressions: A;

	constructor(expressions: A) {
		this.expressions = {} as A;
		for (let type in expressions) {
			let expression = expressions[type];
			if (expression.source.startsWith("^")) {
				throw new UnexpectedAnchor();
			}
			if (expression.source.endsWith("$")) {
				throw new UnexpectedAnchor();
			}
			this.expressions[type] = new RegExp(`^(${expression.source})`, `${expression.ignoreCase ? "isu" : "su"}`) as any;
		}
	}

	* tokens(string: string): Generator<Token<Extract<keyof A, string>>> {
		let row = 1;
		let col = 1;
		while (string.length > 0) {
			let token: Token<Extract<keyof A, string>> | undefined;
			for (let type in this.expressions) {
				let parts = this.expressions[type].exec(string);
				if (parts == null) {
					continue;
				}
				let value = parts[1];
				if (token == null) {
					token = {
						row,
						col,
						type,
						value
					};
					continue;
				}
				if (value.length > token.value.length) {
					token = {
						row,
						col,
						type,
						value
					};
					continue;
				}
			}
			if (token == null) {
				throw new UnrecognizedTokenError(row, col);
			}
			yield token;
			string = string.slice(token.value.length);
			let lines = token.value.split(/\r?\n/);
			if (lines.length > 1) {
				row += lines.length - 1;
				col = 1;
			}
			col += lines[lines.length - 1].length;
		}
	}

	tokenize(string: string): Parser<A> {
		return new Parser<A>(this.expressions, this.tokens(string));
	}
};
