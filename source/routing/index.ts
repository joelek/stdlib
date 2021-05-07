export type Message = any;

export type MessageObserver<A extends Message> = {
	(message: A): void;
};

export type MessageMap<A extends MessageMap<A>> = {
	[B in keyof A]: Message;
};

export type MessageObserverMap<A extends MessageMap<A>> = {
	[B in keyof A]: Set<MessageObserver<A[B]>>;
};

export class MessageRouter<A extends MessageMap<A>> {
	protected observers: MessageObserverMap<A>;

	constructor() {
		this.observers = Object.create(null);
	}

	addObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void {
		let observers = this.observers[type] as Set<MessageObserver<A[B]>> | undefined;
		if (observers === undefined) {
			observers = new Set<MessageObserver<A[B]>>();
			this.observers[type] = observers;
		}
		observers.add(observer);
	}

	removeObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void {
		let observers = this.observers[type] as Set<MessageObserver<A[B]>> | undefined;
		if (observers !== undefined) {
			observers.delete(observer);
		}
	}

	route<B extends keyof A>(type: B, message: A[B]): void {
		let observers = this.observers[type] as Set<MessageObserver<A[B]>> | undefined;
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

export type MessageRouterMap<A extends NamespacedMessageMap<A>> = {
	[B in keyof A]: MessageRouter<A[B]>;
};

export class NamespacedMessageRouter<A extends NamespacedMessageMap<A>> {
	protected routers: MessageRouterMap<A>;

	constructor() {
		this.routers = Object.create(null);
	}

	addObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void {
		let router = this.routers[namespace] as MessageRouter<A[B]> | undefined;
		if (router === undefined) {
			router = new MessageRouter<A[B]>();
			this.routers[namespace] = router;
		}
		router.addObserver(type, observer);
	}

	removeObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void {
		let router = this.routers[namespace] as MessageRouter<A[B]> | undefined;
		if (router !== undefined) {
			router.removeObserver(type, observer);
		}
	}

	route<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, message: A[B][C]): void {
		let router = this.routers[namespace] as MessageRouter<A[B]> | undefined;
		if (router !== undefined) {
			router.route(type, message);
		}
	}
};
