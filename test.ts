import * as libcp from "child_process";
import * as libfs from "fs";
import * as libpath from "path";

function run(path: string): void {
	let entries = libfs.readdirSync(path, { withFileTypes: true });
	for (let entry of entries) {
		let childPath = libpath.join(path, entry.name);
		if (entry.isDirectory()) {
			run(childPath);
			continue;
		}
		if (entry.isFile() && entry.name.endsWith(".test.ts")) {
			console.log(`Running test ${childPath}`);
			let buffer = libcp.execSync(`ts-node ${childPath}`);
			process.stdout.write(buffer);
		}
	}
}

run("./source/");
