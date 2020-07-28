"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespacedMessageRouter = exports.MessageRouter = void 0;
class MessageRouter {
    constructor() {
        this.observers = new Map();
    }
    addObserver(type, observer) {
        let observers = this.observers.get(type);
        if (observers === undefined) {
            observers = new Set();
            this.observers.set(type, observers);
        }
        observers.add(observer);
    }
    removeObserver(type, observer) {
        let observers = this.observers.get(type);
        if (observers !== undefined) {
            observers.delete(observer);
        }
    }
    route(type, message) {
        let observers = this.observers.get(type);
        if (observers !== undefined) {
            for (let observer of observers) {
                observer(message);
            }
        }
    }
}
exports.MessageRouter = MessageRouter;
;
class NamespacedMessageRouter {
    constructor() {
        this.routers = new Map();
    }
    addObserver(namespace, type, observer) {
        let router = this.routers.get(namespace);
        if (router === undefined) {
            router = new MessageRouter();
            this.routers.set(namespace, router);
        }
        router.addObserver(type, observer);
    }
    removeObserver(namespace, type, observer) {
        let router = this.routers.get(namespace);
        if (router !== undefined) {
            router.removeObserver(type, observer);
        }
    }
    route(namespace, type, message) {
        let router = this.routers.get(namespace);
        if (router !== undefined) {
            router.route(type, message);
        }
    }
}
exports.NamespacedMessageRouter = NamespacedMessageRouter;
;
