const tasks = [];

const taskForm = document.querySelector("#task-form");
const taskDescription = document.querySelector("#task-description");
const todoList = document.querySelector("#todo-list");
const doneList = document.querySelector("#done-list");
const deleteAllButton = document.querySelector("#delete-all");
const totalTasks = document.querySelector("#total-tasks");
const pendingTasks = document.querySelector("#pending-tasks");
const doneTasks = document.querySelector("#done-tasks");

function formatDate(date, includeTime = false) {
	const options = {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
	};

	if (includeTime) {
		options.hour = "2-digit";
		options.minute = "2-digit";
	}

	return new Intl.DateTimeFormat("en-GB", options).format(date);
}

function showGreetingAndDate() {
	const now = new Date();
	const hour = now.getHours();
	let greeting;

	if (hour < 4 || hour >= 19) {
		greeting = "Good night";
	} else if (hour < 11) {
		greeting = "Good morning";
	} else if (hour < 15) {
		greeting = "Good afternoon";
	} else {
		greeting = "Good evening";
	}

	document.querySelector("#greeting-heading").firstChild.textContent = `${greeting}, `;
	document.querySelector("#current-date").textContent = formatDate(now);
}

function updateSummary() {
	const pendingCount = tasks.filter((task) => task.completed === false).length;
	const doneCount = tasks.filter((task) => task.completed === true).length;

	totalTasks.textContent = tasks.length;
	pendingTasks.textContent = pendingCount;
	doneTasks.textContent = doneCount;
}

function createTaskElement(task) {
	const taskItem = document.createElement("li");
	taskItem.className = task.completed ? "task-item is-completed" : "task-item";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = "task-checkbox";
	checkbox.checked = task.completed;
	checkbox.setAttribute(
		"aria-label",
		task.completed ? `Mark ${task.description} as pending` : `Mark ${task.description} as complete`,
	);
	checkbox.addEventListener("change", () => {
		const selectedTask = tasks.find((item) => item.id === task.id);
		if (!selectedTask) {
			return;
		}

		selectedTask.completed = checkbox.checked;
		renderTasks();
	});

	const taskContent = document.createElement("div");
	taskContent.className = "task-content";

	const description = document.createElement("p");
	description.className = "task-description";
	description.textContent = task.description;

	const taskMeta = document.createElement("div");
	taskMeta.className = "task-meta";

	const priorityBadge = document.createElement("span");
	priorityBadge.className = `priority-badge priority-${task.priority.toLowerCase()}`;
	priorityBadge.textContent = task.priority;

	const createdDate = document.createElement("time");
	createdDate.dateTime = task.createdAt.toISOString();
	createdDate.textContent = formatDate(task.createdAt, true);

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.className = "task-delete";
	deleteButton.textContent = "Delete";
	deleteButton.setAttribute("aria-label", `Delete ${task.description}`);
	deleteButton.addEventListener("click", () => {
		const taskIndex = tasks.findIndex((item) => item.id === task.id);
		if (taskIndex === -1) {
			return;
		}

		tasks.splice(taskIndex, 1);
		renderTasks();
	});

	taskMeta.append(priorityBadge, createdDate);
	taskContent.append(description, taskMeta);
	taskItem.append(checkbox, taskContent, deleteButton);

	return taskItem;
}

function renderTasks() {
	todoList.replaceChildren();
	doneList.replaceChildren();

	tasks.forEach((task) => {
		const taskItem = createTaskElement(task);
		const taskList = task.completed ? doneList : todoList;
		taskList.append(taskItem);
	});

	updateSummary();
}

deleteAllButton.addEventListener("click", () => {
	tasks.length = 0;
	renderTasks();
});

taskDescription.addEventListener("input", () => {
	taskDescription.setCustomValidity("");
});

taskForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const description = taskDescription.value.trim();
	if (!description) {
		taskDescription.setCustomValidity("Please enter a task.");
		taskDescription.reportValidity();
		return;
	}

	taskDescription.setCustomValidity("");

	const selectedPriority = taskForm.querySelector('input[name="priority"]:checked')?.value;
	const validPriorities = ["Low", "Medium", "High"];
	if (!validPriorities.includes(selectedPriority)) {
		return;
	}

	tasks.push({
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		description,
		priority: selectedPriority,
		createdAt: new Date(),
		completed: false,
	});

	taskForm.reset();
	renderTasks();
});

showGreetingAndDate();
renderTasks();
