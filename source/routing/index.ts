export type Message = any;

export type MessageObserver<A extends Message> = {
	(message: A): void;
};

export type MessageMap<A extends MessageMap<A>> = {
	[B in keyof A]: Message;
};

export class MessageRouter<A extends MessageMap<A>> {
	protected observers: Map<keyof A, Set<MessageObserver<A[keyof A]>>>;

	constructor() {
		this.observers = new Map<keyof A, Set<MessageObserver<A[keyof A]>>>();
	}

	addObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void {
		let observers = this.observers.get(type) as Set<MessageObserver<A[B]>> | undefined;
		if (observers === undefined) {
			observers = new Set<MessageObserver<A[B]>>();
			this.observers.set(type, observers);
		}
		observers.add(observer);
	}

	removeObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void {
		let observers = this.observers.get(type) as Set<MessageObserver<A[B]>> | undefined;
		if (observers !== undefined) {
			observers.delete(observer);
		}
	}

	route<B extends keyof A>(type: B, message: A[B]): void {
		let observers = this.observers.get(type) as Set<MessageObserver<A[B]>> | undefined;
		if (observers !== undefined) {
			for (let observer of observers) {
				observer(message);
			}
		}
	}
};

export type NamespacedMessageMap<A extends NamespacedMessageMap<A>> = {
	[B in keyof A]: MessageMap<A[B]>;
};

export class NamespacedMessageRouter<A extends NamespacedMessageMap<A>> {
	protected routers: Map<keyof A, MessageRouter<A[keyof A]>>;

	constructor() {
		this.routers = new Map<keyof A, MessageRouter<A[keyof A]>>();
	}

	addObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void {
		let router = this.routers.get(namespace) as MessageRouter<A[B]> | undefined;
		if (router === undefined) {
			router = new MessageRouter<A[B]>();
			this.routers.set(namespace, router as any);
		}
		router.addObserver(type, observer);
	}

	removeObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void {
		let router = this.routers.get(namespace) as MessageRouter<A[B]> | undefined;
		if (router !== undefined) {
			router.removeObserver(type, observer);
		}
	}

	route<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, message: A[B][C]): void {
		let router = this.routers.get(namespace) as MessageRouter<A[B]> | undefined;
		if (router !== undefined) {
			router.route(type, message);
		}
	}
};
