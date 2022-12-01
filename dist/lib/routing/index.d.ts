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
export declare class MessageRouter<A extends MessageMap<A>> {
    protected observers: MessageObserverMap<A>;
    constructor();
    addObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void;
    removeObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void;
    route<B extends keyof A>(type: B, message: A[B]): void;
    size(): number;
}
export type NamespacedMessageMap<A extends NamespacedMessageMap<A>> = {
    [B in keyof A]: MessageMap<A[B]>;
};
export type MessageRouterMap<A extends NamespacedMessageMap<A>> = {
    [B in keyof A]: MessageRouter<A[B]>;
};
export declare class NamespacedMessageRouter<A extends NamespacedMessageMap<A>> {
    protected routers: MessageRouterMap<A>;
    constructor();
    addObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void;
    removeObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void;
    route<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, message: A[B][C]): void;
}
