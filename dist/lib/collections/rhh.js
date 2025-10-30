"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobinHoodHash = void 0;
class RobinHoodHash {
    slots;
    slotsUsed;
    constructor() {
        this.slots = new Array(1);
        this.slotsUsed = 0;
    }
    computeOptimalSlot(key) {
        let hash = 2166136261;
        while (key > 0) {
            let byte = key & 0xFF;
            hash = Math.imul(hash ^ byte, 16777619) >>> 0;
            key >>>= 8;
        }
        return hash % this.slots.length;
    }
    doInsert(key, value) {
        let slotIndex = this.computeOptimalSlot(key);
        let probeDistance = 0;
        for (let i = 0; i < this.slots.length; i++) {
            let slot = this.slots[slotIndex];
            if (slot == null) {
                this.slots[slotIndex] = {
                    key,
                    value,
                    probeDistance
                };
                return slotIndex;
            }
            if (slot.key === key) {
                slot.value = value;
                return;
            }
            if (probeDistance > slot.probeDistance) {
                this.slots[slotIndex] = {
                    key,
                    value,
                    probeDistance
                };
                key = slot.key;
                value = slot.value;
                probeDistance = slot.probeDistance;
            }
            slotIndex = (slotIndex + 1) % this.slots.length;
            probeDistance += 1;
        }
    }
    doLookup(key) {
        let slotIndex = this.computeOptimalSlot(key);
        let probeDistance = 0;
        for (let i = 0; i < this.slots.length; i++) {
            let slot = this.slots[slotIndex];
            if (slot == null || probeDistance > slot.probeDistance) {
                return;
            }
            if (slot.key === key) {
                return slotIndex;
            }
            slotIndex = (slotIndex + 1) % this.slots.length;
            probeDistance += 1;
        }
    }
    doRemove(key) {
        let slotIndex = this.computeOptimalSlot(key);
        let probeDistance = 0;
        for (let i = 0; i < this.slots.length; i++) {
            let slot = this.slots[slotIndex];
            if (slot == null || probeDistance > slot.probeDistance) {
                return;
            }
            if (slot.key === key) {
                this.slots[slotIndex] = undefined;
                return slotIndex;
            }
            slotIndex = (slotIndex + 1) % this.slots.length;
            probeDistance += 1;
        }
    }
    propagateBackwards(slotIndex) {
        for (let i = 0; i < this.slots.length; i++) {
            let nextSlot = this.slots[(slotIndex + 1) % this.slots.length];
            if (nextSlot == null || nextSlot.probeDistance === 0) {
                this.slots[slotIndex] = undefined;
                break;
            }
            this.slots[slotIndex] = {
                ...nextSlot,
                probeDistance: nextSlot.probeDistance - 1
            };
            slotIndex = (slotIndex + 1) % this.slots.length;
        }
    }
    resizeIfNecessary() {
        let currentLoadFactor = this.slotsUsed / this.slots.length;
        let desiredSlotCount = this.slots.length;
        if (currentLoadFactor <= 0.25) {
            desiredSlotCount = Math.ceil(this.slots.length / 2);
        }
        if (currentLoadFactor >= 0.75) {
            desiredSlotCount = this.slots.length * 2;
        }
        if (desiredSlotCount === this.slots.length) {
            return;
        }
        let entries = new Array();
        for (let i = 0; i < this.slots.length; i++) {
            let slot = this.slots[i];
            if (slot != null) {
                entries.push(slot);
            }
        }
        this.slots = new Array(desiredSlotCount);
        for (let { key, value } of entries) {
            this.doInsert(key, value);
        }
    }
    *[Symbol.iterator]() {
        for (let slot of this.slots) {
            if (slot == null) {
                continue;
            }
            let { key, value } = { ...slot };
            yield {
                key,
                value
            };
        }
    }
    insert(key, value) {
        let slotIndex = this.doInsert(key, value);
        if (slotIndex == null) {
            return false;
        }
        this.slotsUsed += 1;
        this.resizeIfNecessary();
        return true;
    }
    length() {
        return this.slotsUsed;
    }
    lookup(key) {
        let slotIndex = this.doLookup(key);
        if (slotIndex == null) {
            return;
        }
        let slot = this.slots[slotIndex];
        if (slot == null) {
            return;
        }
        return slot.value;
    }
    remove(key) {
        let slotIndex = this.doRemove(key);
        if (slotIndex == null) {
            return false;
        }
        this.slotsUsed -= 1;
        this.propagateBackwards(slotIndex);
        this.resizeIfNecessary();
        return true;
    }
    vacate() {
        this.slots = new Array(1);
        this.slotsUsed = 0;
    }
}
exports.RobinHoodHash = RobinHoodHash;
;
