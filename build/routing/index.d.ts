export declare type Message = any;
export declare type MessageObserver<A extends Message> = {
    (message: A): void;
};
export declare type MessageMap<A extends MessageMap<A>> = {
    [B in keyof A]: Message;
};
export declare class MessageRouter<A extends MessageMap<A>> {
    protected observers: Map<keyof A, Set<MessageObserver<A[keyof A]>>>;
    constructor();
    addObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void;
    removeObserver<B extends keyof A>(type: B, observer: MessageObserver<A[B]>): void;
    route<B extends keyof A>(type: B, message: A[B]): void;
}
export declare type NamespacedMessageMap<A extends NamespacedMessageMap<A>> = {
    [B in keyof A]: MessageMap<A[B]>;
};
export declare class NamespacedMessageRouter<A extends NamespacedMessageMap<A>> {
    protected routers: Map<keyof A, MessageRouter<A[keyof A]>>;
    constructor();
    addObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void;
    removeObserver<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, observer: MessageObserver<A[B][C]>): void;
    route<B extends keyof A, C extends keyof A[B]>(namespace: B, type: C, message: A[B][C]): void;
}
