"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = exports.Parser = exports.UnexpectedAnchor = exports.UnrecognizedTokenError = exports.UnexpectedTokenError = exports.UnexpectedExecutionError = exports.UnexpectedEndError = void 0;
class UnexpectedEndError extends Error {
    constructor() {
        super();
    }
    toString() {
        return `Unexpectedly reached end of token stream!`;
    }
}
exports.UnexpectedEndError = UnexpectedEndError;
;
class UnexpectedExecutionError extends Error {
    constructor() {
        super();
    }
    toString() {
        return `Unexpectedly reached code believed to be unreachable!`;
    }
}
exports.UnexpectedExecutionError = UnexpectedExecutionError;
;
class UnexpectedTokenError extends Error {
    constructor(token) {
        super();
        this.token = token;
    }
    toString() {
        return `Unexpected token "${this.token.type}" at row ${this.token.row}, col ${this.token.col}!`;
    }
}
exports.UnexpectedTokenError = UnexpectedTokenError;
;
class UnrecognizedTokenError extends Error {
    constructor(row, col) {
        super();
        this.row = row;
        this.col = col;
    }
    toString() {
        return `Unrecognized token at row ${this.row}, col ${this.col}!`;
    }
}
exports.UnrecognizedTokenError = UnrecognizedTokenError;
;
class UnexpectedAnchor extends Error {
    constructor() {
        super();
    }
    toString() {
        return `Unexpected anchor in regular expression!`;
    }
}
exports.UnexpectedAnchor = UnexpectedAnchor;
;
class Parser {
    getNextToken() {
        if (this.token_index < this.tokens.length) {
            return this.tokens[this.token_index];
        }
        else {
            let token = this.generator.next().value;
            if (token == null) {
                return;
            }
            this.tokens.push(token);
            return token;
        }
    }
    peek(...types) {
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
                return Object.assign(Object.assign({}, token), { type: type });
            }
        }
    }
    read(...types) {
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
                return Object.assign(Object.assign({}, token), { type: type });
            }
        }
        throw new UnexpectedTokenError(token);
    }
    skip(...types) {
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
    constructor(expressions, generator) {
        this.bound_read = this.read.bind(this);
        this.bound_peek = this.peek.bind(this);
        this.bound_skip = this.skip.bind(this);
        this.expressions = {};
        for (let type in expressions) {
            let expression = expressions[type];
            this.expressions[type] = new RegExp(`^(${expression.source})$`, `${expression.ignoreCase ? "isu" : "su"}`);
        }
        this.generator = generator;
        this.tokens = [];
        this.token_index = 0;
        this.filter = [];
    }
    parse(filter, producer) {
        let previous_filter = this.filter;
        let previous_token_index = this.token_index;
        try {
            this.filter = filter;
            try {
                return producer(this.bound_read, this.bound_peek, this.bound_skip);
            }
            catch (error) {
                this.token_index = previous_token_index;
                throw error;
            }
        }
        finally {
            this.filter = previous_filter;
        }
    }
    parseFirst(...producers) {
        let unexpected_end_errors = [];
        let unexpected_token_errors = [];
        let unrecognized_token_errors = [];
        let other_errors = [];
        for (let producer of producers) {
            try {
                return producer(this);
            }
            catch (error) {
                if (error instanceof UnexpectedEndError) {
                    unexpected_end_errors.push(error);
                }
                else if (error instanceof UnexpectedTokenError) {
                    unexpected_token_errors.push(error);
                }
                else if (error instanceof UnrecognizedTokenError) {
                    unrecognized_token_errors.push(error);
                }
                else {
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
    parseLongest(...producers) {
        let unexpected_end_errors = [];
        let unexpected_token_errors = [];
        let unrecognized_token_errors = [];
        let other_errors = [];
        let results = [];
        let token_index = this.token_index;
        for (let producer of producers) {
            try {
                let result = producer(this);
                let token_index = this.token_index;
                results.push({
                    result,
                    token_index
                });
            }
            catch (error) {
                if (error instanceof UnexpectedEndError) {
                    unexpected_end_errors.push(error);
                }
                else if (error instanceof UnexpectedTokenError) {
                    unexpected_token_errors.push(error);
                }
                else if (error instanceof UnrecognizedTokenError) {
                    unrecognized_token_errors.push(error);
                }
                else {
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
}
exports.Parser = Parser;
;
// The first successfully matched branch of a branched expression is matched instead of the longest successfully matched branch.
class Tokenizer {
    constructor(expressions) {
        this.expressions = {};
        for (let type in expressions) {
            let expression = expressions[type];
            if (expression.source.startsWith("^")) {
                throw new UnexpectedAnchor();
            }
            if (expression.source.endsWith("$")) {
                throw new UnexpectedAnchor();
            }
            this.expressions[type] = new RegExp(`^(${expression.source})`, `${expression.ignoreCase ? "isu" : "su"}`);
        }
    }
    *tokens(string) {
        let row = 1;
        let col = 1;
        while (string.length > 0) {
            let token;
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
    tokenize(string) {
        return new Parser(this.expressions, this.tokens(string));
    }
}
exports.Tokenizer = Tokenizer;
;
