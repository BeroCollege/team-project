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
			{
				name: "Cooking",
				image: "cooking.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Learning Spanish",
				image: "learn_spanish.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Learning Korean",
				image: "learn_korean.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Workout 5 Days a Week",
				image: "gym.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Drink 2 Litres of Water Daily",
				image: "water_bottle.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Read 1 Book a Month",
				image: "reading.jpeg",
				detailsPage: "goal-details.html",
			},
		],
		"goals-did": [
			{
				name: "Finished a Book",
				image: "book.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Completed Marathon",
				image: "marathon.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Built My First Full-Stack App",
				image: "coding.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Meal Prepped for a Whole Week",
				image: "meal_prep.jpeg",
				detailsPage: "goal-details.html",
			},
		],
		"goals-not-started": [
			{
				name: "Learn Guitar",
				image: "guitar.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Take Art Classes",
				image: "art_class.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Publish First YouTube Devlog/TikTok Post",
				image: "first_youtube.jpeg",
				detailsPage: "goal-details.html",
			},
		],
		"goals-didnt-do": [
			{
				name: "Skydiving",
				image: "sky_diving.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Start a Podcast",
				image: "podcast.jpeg",
				detailsPage: "goal-details.html",
			},
			{
				name: "Learn Piano Basics",
				image: "piano.jpeg",
				detailsPage: "goal-details.html",
			},
		],
	};

	let category = Object.keys(goalCategories).find((cat) =>
		document.body.classList.contains(cat)
	);
	if (!category) return;

	const goals = goalCategories[category];
	const goalList = document.getElementById("goal-list");
	if (!goalList) return;

	goalList.innerHTML = "";

	goals.forEach((goal) => {
		let savedProgress =
			localStorage.getItem(`progress-${goal.name}-${category}`) || 0;
		savedProgress = parseInt(savedProgress);

		const goalElement = document.createElement("div");
		goalElement.classList.add("goal");

		goalElement.innerHTML = `
          <img src="images/${goal.image}" alt="${goal.name}" class="goal-image">
          <a href="goal-details.html?goal=${encodeURIComponent(
						goal.name
					)}&category=${category}" class="goal-details">
              ${goal.name}
          </a>
          <div class="progress-container">
              <p>Progress</p>
              <div class="progress">
                  <div class="progress-bar ${
										savedProgress === 100 ? "green-bar" : "yellow-bar"
									}"
                       data-progress="${savedProgress}"
                       style="width: ${savedProgress}%;"></div>
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

	// Map goal names to image filenames
	const goalImageMap = {
		Cooking: "cooking.jpeg",
		"Learning Spanish": "learn_spanish.jpeg",
		"Finished a Book": "book.jpeg",
		"Completed Marathon": "marathon.jpeg",
		"Learn Guitar": "guitar.jpeg",
		"Take Art Classes": "art_class.jpeg",
		Skydiving: "sky_diving.jpeg",
		"Start a Podcast": "podcast.jpeg",
	};

	const goalImage = document.getElementById("goal-image");
	goalImage.src = `images/${goalImageMap[goalName] || "cooking.jpeg"}`;
	goalImage.alt = goalName;

	const categoryPages = {
		"goals-doing": "index.html",
		"goals-did": "did.html",
		"goals-not-started": "not-started.html",
		"goals-didnt-do": "didnt-do.html",
	};

	document.getElementById("back-button").href =
		categoryPages[category] || "index.html";

	const tasks = {
		Cooking: [
			"Find cooking class",
			"Cook an egg",
			"Cook pasta",
			"Go to cooking class 2",
		],
		"Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
		"Finished a Book": ["Choose a book", "Read 10 pages a day", "Finish book"],
		"Completed Marathon": ["Train for 6 months", "Run 10K", "Complete race"],
		"Learn Guitar": ["Buy a guitar", "Learn 3 chords", "Play a song"],
		"Take Art Classes": ["Sign up", "Attend first class", "Complete artwork"],
		Skydiving: ["Find a location", "Book session", "Jump!"],
		"Start a Podcast": [
			"Pick a topic",
			"Record first episode",
			"Launch podcast",
		],
	};

	const goalStepsContainer = document.getElementById("goal-steps");
	goalStepsContainer.innerHTML = "";

	let completedSteps =
		JSON.parse(localStorage.getItem(`completed-${goalName}-${category}`)) ||
		Array(tasks[goalName].length).fill(false);

	// Since we don't have specific task images, we'll use the goal images for all tasks
	// This is a common approach when specific task images aren't available
	tasks[goalName].forEach((task, index) => {
		const stepElement = document.createElement("div");
		stepElement.classList.add("step");

		// Create a container for the task content
		const taskContainer = document.createElement("div");
		taskContainer.classList.add("task-container");

		// Add task image - using the goal image for all tasks
		const taskImage = document.createElement("img");
		taskImage.src = `images/${goalImageMap[goalName]}`;
		taskImage.alt = task;
		taskImage.classList.add("task-image");

		// Add task text with checkmark/x
		const taskText = document.createElement("span");
		taskText.classList.add("task-text");
		taskText.innerHTML = completedSteps[index] ? `✔ ${task}` : `✖ ${task}`;

		// Append elements
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
			localStorage.setItem(
				`completed-${goalName}-${category}`,
				JSON.stringify(completedSteps)
			);

			stepElement.classList.toggle("completed");
			stepElement.classList.toggle("not-completed");
			taskText.innerHTML = completedSteps[index] ? `✔ ${task}` : `✖ ${task}`;

			updateProgressBar(goalName, category);
		});

		goalStepsContainer.appendChild(stepElement);
	});

	updateProgressBar(goalName, category);
}

function updateProgressBar(goalName, category) {
	const tasks = {
		Cooking: [
			"Find cooking class",
			"Cook an egg",
			"Cook pasta",
			"Go to cooking class 2",
		],
		"Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
		"Finished a Book": ["Choose a book", "Read 10 pages a day", "Finish book"],
		"Completed Marathon": ["Train for 6 months", "Run 10K", "Complete race"],
		"Learn Guitar": ["Buy a guitar", "Learn 3 chords", "Play a song"],
		"Take Art Classes": ["Sign up", "Attend first class", "Complete artwork"],
		Skydiving: ["Find a location", "Book session", "Jump!"],
		"Start a Podcast": [
			"Pick a topic",
			"Record first episode",
			"Launch podcast",
		],
	};

	let completedSteps =
		JSON.parse(localStorage.getItem(`completed-${goalName}-${category}`)) ||
		Array(tasks[goalName].length).fill(false);

	let totalSteps = tasks[goalName].length;
	let progressPercent =
		totalSteps > 0
			? Math.round((completedSteps.filter(Boolean).length / totalSteps) * 100)
			: 0;

	localStorage.setItem(`progress-${goalName}-${category}`, progressPercent);

	if (document.getElementById("progress-bar")) {
		const progressBar = document.getElementById("progress-bar");
		progressBar.style.width = progressPercent + "%";
		progressBar.className = `progress-bar ${
			progressPercent === 100 ? "green-bar" : "yellow-bar"
		}`;
	}

	if (!window.location.pathname.includes("goal-details.html")) {
		fetchGoals();
	}
}

function animateProgressBars() {
	const progressBars = document.querySelectorAll(".progress-bar");
	progressBars.forEach((bar) => {
		const progress = bar.getAttribute("data-progress");
		bar.style.width = progress + "%";
	});
}
