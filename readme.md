# @joelek/ts-stdlib

TypeScript standard library.

## Features

### Routing

The message router can be used to route messages between senders and observers.

```ts
import * as stdlib from "@joelek/ts-stdlib";

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
import * as stdlib from "@joelek/ts-stdlib";

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
npm install joelek/ts-stdlib#semver:^1.1
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install joelek/ts-stdlib#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Migrate generic code from other projects.
