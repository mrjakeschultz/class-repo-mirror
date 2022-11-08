const a = process.argv[3];
const b = process.argv[2];

if (a === b) {
	console.log(true);
} else {
	console.log(false);
}

console.log(a === b ? true : false);

console.log(a === b);
