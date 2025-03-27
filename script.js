document.addEventListener("DOMContentLoaded", function () {
	if (window.location.pathname.includes("goal-details.html")) {
		loadGoalDetails();
	} else {
		fetchGoals();
	}
});

function fetchGoals() {
	const goalCategories = {
		"goals-doing": [
			{ name: "Cooking", image: "cooking.jpeg" },
			{ name: "Learning Spanish", image: "learn_spanish.jpeg" },
			{ name: "Learning Korean", image: "learn_korean.jpeg" },
			{ name: "Workout 5 Days a Week", image: "gym.jpeg" },
			{ name: "Drink 2 Litres of Water Daily", image: "water_bottle.jpeg" },
			{ name: "Read 1 Book a Month", image: "reading.jpeg" }
		],
		"goals-did": [
			{ name: "Finished a Book", image: "book.jpeg" },
			{ name: "Completed Marathon", image: "marathon.jpeg" }
		],
		"goals-not-started": [
			{ name: "Learn Guitar", image: "guitar.jpeg" },
			{ name: "Take Art Classes", image: "art_class.jpeg" }
		],
		"goals-didnt-do": [
			{ name: "Skydiving", image: "sky_diving.jpeg" },
			{ name: "Start a Podcast", image: "podcast.jpeg" }
		]
	};

	// ✅ Get current category from body class
	const bodyClassList = document.body.classList;
	let category = Object.keys(goalCategories).find(cat => bodyClassList.contains(cat));

	if (!category) {
		console.log("No category found — defaulting to showing all goals.");
		category = "goals-doing"; // fallback just in case
	}

	const pagePath = window.location.pathname;
	const goalList = document.getElementById("goal-list");
	if (!goalList) return;
	goalList.innerHTML = "";

	let allGoals = [];
	for (const cat in goalCategories) {
		allGoals = allGoals.concat(goalCategories[cat]);
	}

	let filteredGoals = [];

	if (pagePath.includes("index.html")) {
		filteredGoals = allGoals;
	} else if (pagePath.includes("not-started.html")) {
		filteredGoals = allGoals.filter(goal => {
			const progress = parseInt(localStorage.getItem(`progress-${goal.name}`)) || 0;
			return progress === 0;
		});
	} else if (pagePath.includes("did.html")) {
		filteredGoals = allGoals.filter(goal => {
			const progress = parseInt(localStorage.getItem(`progress-${goal.name}`)) || 0;
			return progress === 100;
		});
	} else if (pagePath.includes("didnt-do.html")) {
		filteredGoals = goalCategories["goals-didnt-do"];
	}

	filteredGoals.forEach(goal => {
		const progress = parseInt(localStorage.getItem(`progress-${goal.name}`)) || 0;

		const goalElement = document.createElement("div");
		goalElement.classList.add("goal");

		goalElement.innerHTML = `
			<img src="images/${goal.image}" alt="${goal.name}" class="goal-image">
			<a href="goal-details.html?goal=${encodeURIComponent(goal.name)}&category=${encodeURIComponent(category)}" class="goal-details">${goal.name}</a>
			<div class="progress-container">
				<img src="images/medal.png" alt="medal" class="medal-image" style="display: ${progress === 100 ? "block" : "none"};" />
				<p>Progress</p>
				<div class="progress">
					<div class="progress-bar ${progress === 100 ? "green-bar" : "yellow-bar"}" data-progress="${progress}" style="width: ${progress}%;"></div>
				</div>
			</div>
		`;

		goalList.appendChild(goalElement);
	});

	animateProgressBars();
}


function loadGoalDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	const goalName = urlParams.get("goal") || "Unknown Goal";
	const category = urlParams.get("category") || "goals-doing";

	document.getElementById("goal-title").textContent = goalName + " Goal";

	const goalImageMap = {
		Cooking: "cooking.jpeg",
		"Learning Spanish": "learn_spanish.jpeg",
		"Learning Korean": "learn_korean.jpeg",
		"Workout 5 Days a Week": "gym.jpeg",
		"Drink 2 Litres of Water Daily": "water_bottle.jpeg",
		"Read 1 Book a Month": "reading.jpeg",
		"Finished a Book": "book.jpeg",
		"Completed Marathon": "marathon.jpeg",
		"Learn Guitar": "guitar.jpeg",
		"Take Art Classes": "art_class.jpeg",
		Skydiving: "sky_diving.jpeg",
		"Start a Podcast": "podcast.jpeg"
	};

	const goalImage = document.getElementById("goal-image");
	goalImage.src = `images/${goalImageMap[goalName] || "cooking.jpeg"}`;
	goalImage.alt = goalName;

	// ✅ Back button returns to the correct category page
	const categoryPages = {
		"goals-doing": "index.html",
		"goals-did": "did.html",
		"goals-not-started": "not-started.html",
		"goals-didnt-do": "didnt-do.html"
	};
	document.getElementById("back-button").href = categoryPages[category] || "index.html";

	const tasks = {
		Cooking: ["Find cooking class", "Cook an egg", "Cook pasta", "Go to cooking class 2"],
		"Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
		"Learning Korean": ["Learn Hangul", "Practice writing", "Watch a K-drama"],
		"Workout 5 Days a Week": ["Create workout plan", "Workout Day 1", "Workout Day 2", "Workout Day 3", "Workout Day 4", "Workout Day 5"],
		"Drink 2 Litres of Water Daily": ["Buy a reusable water bottle", "Track your water intake", "Finish 2L by evening"],
		"Read 1 Book a Month": ["Pick a book", "Read daily", "Finish book"],
		"Finished a Book": ["Choose a book", "Read 10 pages a day", "Finish book"],
		"Completed Marathon": ["Train for 6 months", "Run 10K", "Complete race"],
		"Learn Guitar": ["Buy a guitar", "Learn 3 chords", "Play a song"],
		"Take Art Classes": ["Sign up for class", "Attend first class", "Finish first project"],
		Skydiving: ["Find a location", "Book session", "Jump!"],
		"Start a Podcast": ["Pick a topic", "Record first episode", "Launch podcast"]
	};

	const goalStepsContainer = document.getElementById("goal-steps");
	goalStepsContainer.innerHTML = "";

	let completedSteps = JSON.parse(localStorage.getItem(`completed-${goalName}`)) ||
		Array(tasks[goalName]?.length || 0).fill(false);

	tasks[goalName]?.forEach((task, index) => {
		const stepElement = document.createElement("div");
		stepElement.classList.add("step");

		const taskContainer = document.createElement("div");
		taskContainer.classList.add("task-container");

		const taskImage = document.createElement("img");
		taskImage.src = `images/${goalImageMap[goalName] || "cooking.jpeg"}`;
		taskImage.alt = task;
		taskImage.classList.add("task-image");

		const taskText = document.createElement("span");
		taskText.classList.add("task-text");
		taskText.innerHTML = completedSteps[index] ? `✔ ${task}` : `✖ ${task}`;

		taskContainer.appendChild(taskImage);
		taskContainer.appendChild(taskText);
		stepElement.appendChild(taskContainer);

		if (completedSteps[index]) {
			stepElement.classList.add("completed");
		} else {
			stepElement.classList.add("not-completed");
		}

		stepElement.addEventListener("click", function () {
			completedSteps[index] = !completedSteps[index];
			localStorage.setItem(`completed-${goalName}`, JSON.stringify(completedSteps));
			stepElement.classList.toggle("completed");
			stepElement.classList.toggle("not-completed");
			taskText.innerHTML = completedSteps[index] ? `✔ ${task}` : `✖ ${task}`;
			updateProgressBar(goalName);
		});

		goalStepsContainer.appendChild(stepElement);
	});

	updateProgressBar(goalName);
}


function updateProgressBar(goalName) {
	const tasks = {
		Cooking: ["Find cooking class", "Cook an egg", "Cook pasta", "Go to cooking class 2"],
		"Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
		"Learning Korean": ["Learn Hangul", "Practice writing", "Watch a K-drama"],
		"Workout 5 Days a Week": ["Make a schedule", "Do 5 workouts", "Rest day"],
		"Drink 2 Litres of Water Daily": ["Buy a water bottle", "Track water", "Reach daily goal"],
		"Read 1 Book a Month": ["Pick a book", "Read daily", "Finish book"],
		"Finished a Book": ["Choose a book", "Read 10 pages a day", "Finish book"],
		"Completed Marathon": ["Train for 6 months", "Run 10K", "Complete race"],
		"Learn Guitar": ["Buy a guitar", "Learn 3 chords", "Play a song"],
		"Take Art Classes": ["Sign up", "Attend first class", "Complete artwork"],
		Skydiving: ["Find a location", "Book session", "Jump!"],
		"Start a Podcast": ["Pick a topic", "Record first episode", "Launch podcast"],
	};

	const completedSteps = JSON.parse(localStorage.getItem(`completed-${goalName}`)) || [];
	const totalSteps = tasks[goalName]?.length || 0;

	const progressPercent = totalSteps > 0
		? Math.round((completedSteps.filter(Boolean).length / totalSteps) * 100)
		: 0;

	localStorage.setItem(`progress-${goalName}`, progressPercent);

	if (document.getElementById("progress-bar")) {
		const progressBar = document.getElementById("progress-bar");
		progressBar.style.width = `${progressPercent}%`;
		progressBar.className = `progress-bar ${progressPercent === 100 ? "green-bar" : "yellow-bar"}`;
	}

	if (!window.location.pathname.includes("goal-details.html")) {
		fetchGoals();
	}
}

function animateProgressBars() {
	const progressBars = document.querySelectorAll(".progress-bar");
	progressBars.forEach(bar => {
		const progress = bar.getAttribute("data-progress");
		bar.style.width = progress + "%";
	});
}
