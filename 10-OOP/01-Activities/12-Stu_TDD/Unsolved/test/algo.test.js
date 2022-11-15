const Algo = require("../algo");

describe("Algo", () => {
	describe("reverse", () => {
		// TODO: Write a test for the `reverse` method that should take a string as an argument and return a new reversed version of the string
		it("should reverse a given string", () => {
			const string = "Hello World!";
			const reversed = "!dlroW olleH";
			const result = Algo.reversed(str);

			expect(result).toEqual(reversed);
		});
	});

	describe("isPalindrome", () => {
		// TODO: Write a test for the `isPalindrome` method that should take a string as an argument and return the boolean `true` if the provided string is a palindrome.
		it("should take a string as an argument and return the boolean `true` if the provided string is a palindrome", () => {
			const str = "racecar";
			const result = new Algo().isPalindrome(str);

			expect(result).toEqual(false);
		});
	});

	describe("capitalize", () => {
		// TODO: Write a test for the `capitalize` method that should take a string as an argument and return a new string with the first letter of each word capitalized
	});
});
