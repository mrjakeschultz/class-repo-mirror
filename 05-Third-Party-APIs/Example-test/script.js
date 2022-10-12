var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
	// create elements that make up a task item
	var taskLi = $("<li>").addClass("list-group-item");
	var taskSpan = $("<span>")
		.addClass("badge badge-primary badge-pill")
		.text(taskDate);
	var taskP = $("<p>").addClass("m-1").text(taskText);

	// append span and p element to parent li
	taskLi.append(taskSpan, taskP);

	// check due date
	auditTask(taskLi);

	// append to ul list on the page
	$("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
	tasks = JSON.parse(localStorage.getItem("tasks"));

	// if nothing in localStorage, create a new object to track all task status arrays
	if (!tasks) {
		tasks = {
			toDo: [],
			inProgress: [],
			inReview: [],
			done: [],
		};
	}

	// loop over object properties
	$.each(tasks, function (list, arr) {
		// then loop over sub-array
		arr.forEach(function (task) {
			createTask(task.text, task.date, list);
		});
	});
};

var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasks));
};

var auditTask = function (taskEl) {
	// get date from task element
	var date = $(taskEl).find("span").text().trim();

	console.log(date);

	// convert to moment object at 5:00pm
	var time = moment(date, "L").set("hour", 17);

	console.log(time);

	// remove any old classes from element
	$(taskEl).removeClass("list-group-item-warning list-group-item-danger");

	// apply new class if task is near/over due date
	if (moment().isAfter(time)) {
		$(taskEl).addClass("list-group-item-danger");
	} else if (Math.abs(moment().diff(time, "days")) <= 2) {
		$(taskEl).addClass("list-group-item-warning");
	}
};

// enable draggable/sortable feature on list-group elements
$(".card .list-group").sortable({
	// enable dragging across lists
	connectWith: $(".card .list-group"),
	scroll: false,
	tolerance: "pointer",
	helper: "clone",
	activate: function (event, ui) {
		console.log(ui);
	},
	deactivate: function (event, ui) {
		console.log(ui);
	},
	over: function (event) {
		console.log(event);
	},
	out: function (event) {
		console.log(event);
	},
	update: function () {
		var tempArr = [];
		// loop over current set of children in sortable list
		$(this)
			.children()
			.each(function () {
				// save values in temp array
				tempArr.push({
					text: $(this).find("p").text().trim(),
					date: $(this).find("span").text().trim(),
				});
			});
		// trim down list's ID to match object property
		var arrName = $(this).attr("id").replace("list-", "");

		// update array on tasks object and save
		tasks[arrName] = tempArr;
		saveTasks();
	},
	stop: function (event) {
		$(this).removeClass("dropover");
	},
});

// trash icon can be dropped onto
$("#trash").droppable({
	accept: ".card .list-group-item",
	tolerance: "touch",
	drop: function (event, ui) {
		// remove dragged element from the dom
		ui.draggable.remove();
	},
	over: function (event, ui) {
		console.log(ui);
	},
	out: function (event, ui) {
		console.log(ui);
	},
});

// convert text field into a jquery date picker
$("#modalDueDate").datepicker({
	// force user to select a future date
	minDate: 1,
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
	// clear values
	$("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
	// highlight textarea
	$("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
	// get form values
	var taskText = $("#modalTaskDescription").val();
	var taskDate = $("#modalDueDate").val();

	if (taskText && taskDate) {
		createTask(taskText, taskDate, "toDo");

		// close modal
		$("#task-form-modal").modal("hide");

		// save in tasks array
		tasks.toDo.push({
			text: taskText,
			date: taskDate,
		});

		saveTasks();
	}
});

// task text was clicked
$(".list-group").on("click", "p", function () {
	// get current text of p element
	var text = $(this).text().trim();

	// replace p element with a new textarea
	var textInput = $("<textarea>").addClass("form-control").val(text);
	$(this).replaceWith(textInput);

	// auto focus new element
	textInput.trigger("focus");
});

// editable field was un-focused
$(".list-group").on("blur", "textarea", function () {
	// get current value of textarea
	var text = $(this).val();

	// get status type and position in the list
	var status = $(this).closest(".list-group").attr("id").replace("list-", "");
	var index = $(this).closest(".list-group-item").index();

	// update task in array and re-save to localstorage
	tasks[status][index].text = text;
	saveTasks();

	// recreate p element
	var taskP = $("<p>").addClass("m-1").text(text);

	// replace textarea with new content
	$(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function () {
	// get current text
	var date = $(this).text().trim();

	// create new input element
	var dateInput = $("<input>")
		.attr("type", "text")
		.addClass("form-control")
		.val(date);
	$(this).replaceWith(dateInput);

	// enable jquery ui date picker
	dateInput.datepicker({
		minDate: 1,
		onClose: function () {
			// when calendar is closed, force a "change" event
			$(this).trigger("change");
		},
	});

	// automatically bring up the calendar
	dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("change", "input[type='text']", function () {
	var date = $(this).val();

	// get status type and position in the list
	var status = $(this).closest(".list-group").attr("id").replace("list-", "");
	var index = $(this).closest(".list-group-item").index();

	// update task in array and re-save to localstorage
	tasks[status][index].date = date;
	saveTasks();

	// recreate span and insert in place of input element
	var taskSpan = $("<span>")
		.addClass("badge badge-primary badge-pill")
		.text(date);
	$(this).replaceWith(taskSpan);
	auditTask($(taskSpan).closest(".list-group-item"));
});

// remove all tasks
$("#remove-tasks").on("click", function () {
	for (var key in tasks) {
		tasks[key].length = 0;
		$("#list-" + key).empty();
	}
	console.log(tasks);
	saveTasks();
});

// load tasks for the first time
loadTasks();

$("modaDueDate").datepicker();
var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
	// create elements that make up a task item
	var taskLi = $("<li>").addClass("list-group-item");
	var taskSpan = $("<span>")
		.addClass("badge badge-primary badge-pill")
		.text(taskDate);
	var taskP = $("<p>").addClass("m-1").text(taskText);

	// append span and p element to parent li
	taskLi.append(taskSpan, taskP);

	// check due date
	auditTask(taskLi);

	// append to ul list on the page
	$("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
	tasks = JSON.parse(localStorage.getItem("tasks"));

	// if nothing in localStorage, create a new object to track all task status arrays
	if (!tasks) {
		tasks = {
			toDo: [],
			inProgress: [],
			inReview: [],
			done: [],
		};
	}

	// loop over object properties
	$.each(tasks, function (list, arr) {
		// then loop over sub-array
		arr.forEach(function (task) {
			createTask(task.text, task.date, list);
		});
	});
};
//The saveTasks() function simply saves the tasks object in localStorage, as we can see here:
var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasks));
};

var auditTask = function (taskEl) {
	// get date from task element
	var date = $(taskEl).find("span").text().trim();

	// convert to moment object at 5:00pm
	var time = moment(date, "L").set("hour", 17);

	// remove any old classes from element
	$(taskEl).removeClass("list-group-item-warning list-group-item-danger");

	// apply new class if task is near/over due date
	if (moment().isAfter(time)) {
		$(taskEl).addClass("list-group-item-danger");
	} else if (Math.abs(moment().diff(time, "days")) <= 2) {
		$(taskEl).addClass("list-group-item-warning");
	}
};

// enable draggable/sortable feature on list-group elements
$(".card .list-group").sortable({
	// enable dragging across lists
	connectWith: $(".card .list-group"),
	scroll: false,
	tolerance: "pointer",
	helper: "clone",
	activate: function (event, ui) {
		$(this).addClass("dropover");
		$(".bottom-trash").addClass("bottom-trash-drag");
	},
	deactivate: function (event, ui) {
		$(this).removeClass("dropover");
		$(".bottom-trash").removeClass("bottom-trash-drag");
	},
	over: function (event) {
		$(event.target).addClass("dropover-active");
	},
	out: function (event) {
		$(event.target).removeClass("dropover-active");
	},
	update: function () {
		var tempArr = [];

		// loop over current set of children in sortable list
		$(this)
			.children()
			.each(function () {
				// save values in temp array
				tempArr.push({
					text: $(this).find("p").text().trim(),
					date: $(this).find("span").text().trim(),
				});
			});

		// trim down list's ID to match object property
		var arrName = $(this).attr("id").replace("list-", "");

		// update array on tasks object and save
		tasks[arrName] = tempArr;
		saveTasks();
	},
});

// trash icon can be dropped onto
$("#trash").droppable({
	accept: ".card .list-group-item",
	tolerance: "touch",
	drop: function (event, ui) {
		// remove dragged element from the dom
		ui.draggable.remove();
		$(".bottom-trash").removeClass("bottom-trash-active");
	},
	over: function (event, ui) {
		console.log(ui);
		$(".bottom-trash").addClass("bottom-trash-active");
	},
	out: function (event, ui) {
		$(".bottom-trash").removeClass("bottom-trash-active");
	},
});

// convert text field into a jquery date picker
$("#modalDueDate").datepicker({
	// force user to select a future date
	minDate: 1,
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
	// clear values
	$("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
	// highlight textarea
	$("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-save").click(function () {
	// get form values
	var taskText = $("#modalTaskDescription").val();
	var taskDate = $("#modalDueDate").val();

	if (taskText && taskDate) {
		createTask(taskText, taskDate, "toDo");

		// close modal
		$("#task-form-modal").modal("hide");

		// save in tasks array
		tasks.toDo.push({
			text: taskText,
			date: taskDate,
		});

		saveTasks();
	}
});

// task text was clicked
//In jQuery's example, click event listeners on all <tr> elements are delegated to a parent <tbody> element—hence the extra argument in the on() method: $("#dataTable tbody").on("click", "tr"). We'll do something similar with the <p> elements, delegating clicks to the parent <ul> with class list-group.
//In previous projects, we used event.target to get the affected element, and that'd certainly still work here. Another common trick (particularly when using jQuery) is to use the this keyword. We've used this in relation to objects to refer to themselves; DOM elements are objects too, so there's no reason why we can't use this in event callbacks.

//Update the on() callback to look like this instead:
$(".list-group").on("click", "p", function () {
	// get current text of p element
	var text = $(this).text().trim();

	// replace p element with a new textarea
	//While $("textarea") tells jQuery to find all existing <textarea> elements, as we've seen before, $("<textarea>") tells jQuery to create a new <textarea> element. The former uses the element name as a selector, the latter uses the HTML syntax for an opening tag to indicate the element to be created.
	var textInput = $("<textarea>").addClass("form-control").val(text);
	$(this).replaceWith(textInput);

	// auto focus new element
	textInput.trigger("focus");
});

// editable field was un-focused
$(".list-group").on("blur", "textarea", function () {
	// get current value of textarea
	var text = $(this).val();

	// get status type and position in the list
	var status = $(this).closest(".list-group").attr("id").replace("list-", "");
	// get the task's position in the list of other li elements
	//This blur event will trigger as soon as the user interacts with anything other than the <textarea> element. When that happens, we need to collect a few pieces of data: the current value of the element,
	//the parent element's ID, and the element's position in the list. These data points will help us update the correct task in the tasks object.
	var index = $(this).closest(".list-group-item").index();

	// update task in array and re-save to localstorage
	//Because we don't know the values, we'll have to use the variable names as placeholders. Underneath the three variables, add the following lines:
	//tasks[status][index].text = text;

	//tasks is an object.

	//tasks[status] returns an array (e.g., toDo).

	//tasks[status][index] returns the object at the given index in the array.

	//tasks[status][index].text returns the text property of the object at the given index.

	saveTasks();

	// recreate p element
	var taskP = $("<p>").addClass("m-1").text(text);

	// replace textarea with new content
	$(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function () {
	// get current text
	var date = $(this).text().trim();

	// create new input element
	//The main difference here is that we're creating an <input> element and using jQuery's attr() method to set it as type="text".
	// In jQuery, attr() can serve two purposes. With one argument, it gets an attribute (e.g., attr("id")).
	//With two arguments, it sets an attribute (e.g., attr("type", "text")).
	var dateInput = $("<input>")
		.attr("type", "text")
		.addClass("form-control")
		.val(date);
	$(this).replaceWith(dateInput);

	// enable jquery ui date picker
	dateInput.datepicker({
		minDate: 1,
		onClose: function () {
			// when calendar is closed, force a "change" event
			$(this).trigger("change");
		},
	});

	// automatically bring up the calendar
	dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("change", "input[type='text']", function () {
	var date = $(this).val();

	// get status type and position in the list
	var status = $(this).closest(".list-group").attr("id").replace("list-", "");
	var index = $(this).closest(".list-group-item").index();

	// update task in array and re-save to localstorage
	tasks[status][index].date = date;
	saveTasks();

	// recreate span and insert in place of input element
	var taskSpan = $("<span>")
		.addClass("badge badge-primary badge-pill")
		.text(date);
	$(this).replaceWith(taskSpan);
	auditTask($(taskSpan).closest(".list-group-item"));
});

// remove all tasks
$("#remove-tasks").on("click", function () {
	for (var key in tasks) {
		tasks[key].length = 0;
		$("#list-" + key).empty();
	}
	console.log(tasks);
	saveTasks();
});

// load tasks for the first time
loadTasks();

// audit task due dates every 30 minutes
setInterval(function () {
	$(".card .list-group-item").each(function () {
		auditTask($(this));
	});
}, 1800000);
