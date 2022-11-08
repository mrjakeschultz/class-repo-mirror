const inquirer = require("inquirer");
const fs = require("fs");

inquirer
	.prompt([
		{
			type: "input",
			message: "What is your name?",
			name: "full_name",
		},
		{
			type: "checkbox",
			message: "What languages do you know?",
			name: "languages",
			choices: ["CSS", "HTML", "JavaScript", "PHP"],
		},
		{
			type: "list",
			message: "What is your preferred method of comms?",
			name: "communication preference",
			choices: ["email", "phone", "mail", "telegram"],
		},
	])
	.then((responses) => {
		console.log(responses);
		fs.appendFile("log.txt", `${responses}\n`, (err) =>
			// TODO: Describe how this ternary operator works
			err ? console.error(err) : console.log("Successfully written to log.txt")
		);
	});
