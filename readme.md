# @joelek/stdlib

TypeScript standard library.

## Features

### Codepages

The Codepage class can be used to convert strings to and from single-byte codepages.

```ts
import * as stdlib from "@joelek/stdlib";

let codepage = new stdlib.codepages.codepage.Codepage([
	"🚀".codePointAt(0) as number,
	"🍕".codePointAt(0) as number
]);
let string = codepage.decode(Uint8Array.from([0, 1])); // String will contain "🚀🍕".
let buffer = codepage.encode(string); // Buffer will contain [0, 1].
```

### Collections

#### AVL-Tree

The AVL-Tree can be used to store key-value pairs. Values may be retrieved using the corresponding key in the same fashion as for a standard JavaScript Map.

```ts
import * as stdlib from "@joelek/stdlib";

let tree = new stdlib.collections.avl.Tree<string>();
tree.insert(1, "hello");
tree.insert(2, "world");
console.log(tree.lookup(1)); // Outputs entry whose value is "hello".
console.log(tree.lookup(2)); // Outputs entry whose value is "world".
```

The AVL-Tree adds filtering functionality that may be used to retrieve all entries whose keys match the supplied filters. The tree supports the `<`, `<=`, `=`, `>=` and `>` filters.

```ts
import * as stdlib from "@joelek/stdlib";

let tree = new stdlib.collections.avl.Tree<string>();
tree.insert(1, "hello");
tree.insert(2, "world");
for (let entry of tree.filter({ operator: ">", key: 0 }, { operator: "<", key: 2 })) {
	console.log(entry); // Outputs entry whose value is "hello".
}
console.log(tree.locate({ operator: ">", key: 1 })); // Outputs entry whose value is "world".
```

Iteration is performed in key order. It is _not_ safe to mutate the tree during iteration.

| Operation          | Worst    | Average  |
| ------------------ | -------- | -------- |
| filter(...filters) | O(log n) | O(log n) |
| insert(key, value) | O(log n) | O(log n) |
| length()           | O(n)     | O(n)     |
| locate(filter)     | O(log n) | O(log n) |
| lookup(key)        | O(log n) | O(log n) |
| remove(key)        | O(log n) | O(log n) |
| vacate()           | O(1)     | O(1)     |

Please note that `length()` is lazily implemented and has terrible time complexity.

#### Doubly Linked List

The Doubly Linked List can be used to store sequences of values. Values may be retrieved from the start or end of the list.

```ts
import * as stdlib from "@joelek/stdlib";

let list = new stdlib.collections.dll.DoublyLinkedList<string>();
list.prepend("hello");
list.append("world");
console.log(list.unprepend()); // Outputs entry whose value is "hello".
console.log(map.unappend()); // Outputs entry whose value is "world".
```

Iteration is performed in sequence order. It is safe to mutate the list during iteration.

| Operation      | Worst | Average |
| -------------- | ----- | ------- |
| append(value)  | O(1)  | O(1)    |
| prepend(value) | O(1)  | O(1)    |
| remove(node)   | O(1)  | O(1)    |
| unappend()     | O(1)  | O(1)    |
| unprepend()    | O(1)  | O(1)    |

#### Linked Hash Map

The Linked Hash Map can be used to store key-value pairs. Values may be retrieved using the corresponding key in the same fashion as for a standard JavaScript Map.

```ts
import * as stdlib from "@joelek/stdlib";

let map = new stdlib.collections.lhm.LinkedHashMap<string>();
map.insert(1, "hello");
map.insert(2, "world");
console.log(map.lookup(1)); // Outputs entry whose value is "hello".
console.log(map.lookup(2)); // Outputs entry whose value is "world".
```

Iteration is performed in insertion order. It is safe to mutate the map during iteration.

| Operation          | Worst | Average |
| ------------------ | ----- | ------- |
| insert(key, value) | O(n)  | O(1)    |
| length()           | O(1)  | O(1)    |
| lookup(key)        | O(1)  | O(1)    |
| remove(key)        | O(n)  | O(1)    |
| vacate()           | O(1)  | O(1)    |

The Linked Hash Map supports FIFO operations in amortized constant time. This in constrast to standard JavaScript Maps in notable JavaScript engines such as V8 which only supports FIFO operations in quadratic (!) time. This is due to the implementation of the underlying compact dictionary used by V8.

#### Robin Hood Hash

The Robin Hood Hash can be used to store key-value pairs. Values may be retrieved using the corresponding key in the same fashion as for a standard JavaScript Map.

```ts
import * as stdlib from "@joelek/stdlib";

let map = new stdlib.collections.rhh.RobinHoodHash<string>();
map.insert(1, "hello");
map.insert(2, "world");
console.log(map.lookup(1)); // Outputs entry whose value is "hello".
console.log(map.lookup(2)); // Outputs entry whose value is "world".
```

Iteration is performed in no discernible order. It is _not_ safe to mutate the map during iteration.

| Operation          | Worst | Average |
| ------------------ | ----- | ------- |
| insert(key, value) | O(n)  | O(1)    |
| length()           | O(1)  | O(1)    |
| lookup(key)        | O(1)  | O(1)    |
| remove(key)        | O(n)  | O(1)    |
| vacate()           | O(1)  | O(1)    |

### Routing

The message router can be used to route messages between senders and observers.

```ts
import * as stdlib from "@joelek/stdlib";

type MyMessageMap = {
	"MyMessage": {
		title: string;
		message: string;
	};
};
const router = new stdlib.routing.MessageRouter<MyMessageMap>();
router.addObserver("MyMessage", (message) => {
	console.log(message);
});
router.route("MyMessage", {
	title: "Hello!",
	message: "Long time, no see."
});
```

The namespaced message router can be used to group messages into distinct namespaces.

```ts
import * as stdlib from "@joelek/stdlib";

type MyNamespacedMessageMap = {
	"UserMessages": {
		"MyMessage": {
			title: string;
			message: string;
		};
	};
};
const router = new stdlib.routing.NamespacedMessageRouter<MyNamespacedMessageMap>();
router.addObserver("UserMessages", "MyMessage", (message) => {
	console.log(message);
});
router.route("UserMessages", "MyMessage", {
	title: "Hello!",
	message: "Long time, no see."
});
```

NB: The message router is compile-time type-safe through the TypeScript compiler. The type-safety is not enforced at run-time!

## Sponsorship

The continued development of this software depends on your sponsorship. Please consider sponsoring this project if you find that the software creates value for you and your organization.

The sponsor button can be used to view the different sponsoring options. Contributions of all sizes are welcome.

Thank you for your support!

### Ethereum

Ethereum contributions can be made to address `0xf1B63d95BEfEdAf70B3623B1A4Ba0D9CE7F2fE6D`.

![](./eth.png)

## Installation

Releases follow semantic versioning and release packages are published using the GitHub platform. Use the following command to install the latest release.

```
npm install joelek/stdlib#semver:^1.6
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install joelek/stdlib#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Prevent AVL-tree from being mutated while iterating.
* Document data module.
* Write tests for XMLRPC module.
