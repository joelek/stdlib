"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespacedMessageRouter = exports.MessageRouter = void 0;
class MessageRouter {
    constructor() {
        this.observers = Object.create(null);
    }
    addObserver(type, observer) {
        let observers = this.observers[type];
        if (observers === undefined) {
            observers = new Set();
            this.observers[type] = observers;
        }
        observers.add(observer);
    }
    removeObserver(type, observer) {
        let observers = this.observers[type];
        if (observers !== undefined) {
            observers.delete(observer);
            if (observers.size === 0) {
                delete this.observers[type];
            }
        }
    }
    route(type, message) {
        let observers = this.observers[type];
        if (observers !== undefined) {
            for (let observer of observers) {
                observer(message);
            }
        }
    }
    size() {
        return Object.keys(this.observers).length;
    }
}
exports.MessageRouter = MessageRouter;
;
class NamespacedMessageRouter {
    constructor() {
        this.routers = Object.create(null);
    }
    addObserver(namespace, type, observer) {
        let router = this.routers[namespace];
        if (router === undefined) {
            router = new MessageRouter();
            this.routers[namespace] = router;
        }
        router.addObserver(type, observer);
    }
    removeObserver(namespace, type, observer) {
        let router = this.routers[namespace];
        if (router !== undefined) {
            router.removeObserver(type, observer);
            if (router.size() === 0) {
                delete this.routers[namespace];
            }
        }
    }
    route(namespace, type, message) {
        let router = this.routers[namespace];
        if (router !== undefined) {
            router.route(type, message);
        }
    }
}
exports.NamespacedMessageRouter = NamespacedMessageRouter;
;
