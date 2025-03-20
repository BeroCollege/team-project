document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("goal-details.html")) {
        loadGoalDetails(); // Load details dynamically
    } else {
        fetchGoals(); // Load goals list correctly
    }
});

// Function to Fetch Goals Dynamically and Apply Correct Progress
function fetchGoals() {
    const goalCategories = {
        "goals-doing": [
            { name: "Cooking", image: "cooking.jpg", detailsPage: "goal-details.html" },
            { name: "Learning Spanish", image: "spanish.jpg", detailsPage: "goal-details.html" }
        ],
        "goals-did": [
            { name: "Finished a Book", image: "book.jpg", detailsPage: "goal-details.html" },
            { name: "Completed Marathon", image: "marathon.jpg", detailsPage: "goal-details.html" }
        ],
        "goals-not-started": [
            { name: "Learn Guitar", image: "guitar.jpg", detailsPage: "goal-details.html" },
            { name: "Take Art Classes", image: "art.jpg", detailsPage: "goal-details.html" }
        ],
        "goals-didnt-do": [
            { name: "Skydiving", image: "skydiving.jpg", detailsPage: "goal-details.html" },
            { name: "Start a Podcast", image: "podcast.jpg", detailsPage: "goal-details.html" }
        ]
    };

    let category = Object.keys(goalCategories).find(cat => document.body.classList.contains(cat));
    if (!category) return;

    const goals = goalCategories[category];
    const goalList = document.getElementById("goal-list");
    if (!goalList) return;

    goalList.innerHTML = ""; // Clear existing content

    goals.forEach(goal => {
        let savedProgress = localStorage.getItem(`progress-${goal.name}-${category}`) || 0;
        savedProgress = parseInt(savedProgress);

        const goalElement = document.createElement("div");
        goalElement.classList.add("goal");

        goalElement.innerHTML = `
            <img src="images/${goal.image}" alt="${goal.name}" class="goal-image">
            <a href="goal-details.html?goal=${encodeURIComponent(goal.name)}&category=${category}" class="goal-details">
                ${goal.name}
            </a>
            <div class="progress-container">
                <p>Progress</p>
                <div class="progress">
                    <div class="progress-bar yellow-bar" data-progress="${savedProgress}" style="width: ${savedProgress}%;"></div>
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
    const category = urlParams.get("category") || "goals-doing"; // Default to Goals I'm Doing

    document.getElementById("goal-title").textContent = goalName + " Goal";

    const goalImage = document.getElementById("goal-image");
    goalImage.src = `images/${goalName.toLowerCase().replace(/\s/g, "-")}.jpg`;
    goalImage.alt = goalName;

    // Correct category-to-file mapping
    const categoryPages = {
        "goals-doing": "index.html",
        "goals-did": "did.html",
        "goals-not-started": "not-started.html",
        "goals-didnt-do": "didnt-do.html"
    };

    // Set back button to correct page
    document.getElementById("back-button").href = categoryPages[category] || "index.html";

    const tasks = {
        "Cooking": ["Find cooking class", "Cook an egg", "Cook pasta", "Go to cooking class 2"],
        "Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
        "Finished a Book": ["Choose a book", "Read 10 pages a day", "Finish book"],
        "Completed Marathon": ["Train for 6 months", "Run 10K", "Complete race"],
        "Learn Guitar": ["Buy a guitar", "Learn 3 chords", "Play a song"],
        "Take Art Classes": ["Sign up", "Attend first class", "Complete artwork"],
        "Skydiving": ["Find a location", "Book session", "Jump!"],
        "Start a Podcast": ["Pick a topic", "Record first episode", "Launch podcast"]
    };

    const goalStepsContainer = document.getElementById("goal-steps");
    goalStepsContainer.innerHTML = ""; // Clear existing tasks

    let completedSteps = JSON.parse(localStorage.getItem(`completed-${goalName}-${category}`)) || Array(tasks[goalName].length).fill(false);

    tasks[goalName].forEach((task, index) => {
        const stepElement = document.createElement("div");
        stepElement.classList.add("step");

        if (completedSteps[index]) {
            stepElement.classList.add("completed");
            stepElement.innerHTML = `✔ ${task}`;
        } else {
            stepElement.classList.add("not-completed");
            stepElement.innerHTML = `✖ ${task}`;
        }

        stepElement.addEventListener("click", function () {
            completedSteps[index] = !completedSteps[index];
            localStorage.setItem(`completed-${goalName}-${category}`, JSON.stringify(completedSteps));

            stepElement.classList.toggle("completed");
            stepElement.classList.toggle("not-completed");
            stepElement.innerHTML = completedSteps[index] ? `✔ ${task}` : `✖ ${task}`;

            updateProgressBar(goalName, category);
        });

        goalStepsContainer.appendChild(stepElement);
    });

    updateProgressBar(goalName, category);
}





// Function to Update Progress Bar Dynamically
function updateProgressBar(goalName, category) {
    const tasks = {
        "Cooking": ["Find cooking class", "Cook an egg", "Cook pasta", "Go to cooking class 2"],
        "Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
        "Finished a Book": ["Choose a book", "Read 10 pages a day", "Finish book"],
        "Completed Marathon": ["Train for 6 months", "Run 10K", "Complete race"],
        "Learn Guitar": ["Buy a guitar", "Learn 3 chords", "Play a song"],
        "Take Art Classes": ["Sign up", "Attend first class", "Complete artwork"],
        "Skydiving": ["Find a location", "Book session", "Jump!"],
        "Start a Podcast": ["Pick a topic", "Record first episode", "Launch podcast"]
    };

    let completedSteps = JSON.parse(localStorage.getItem(`completed-${goalName}-${category}`)) || Array(tasks[goalName].length).fill(false);
    
    let totalSteps = tasks[goalName].length;
    let progressPercent = totalSteps > 0 ? Math.round((completedSteps.filter(Boolean).length / totalSteps) * 100) : 0;

    // Save updated progress
    localStorage.setItem(`progress-${goalName}-${category}`, progressPercent);

    // Update progress bar inside goal details page
    if (document.getElementById("progress-bar")) {
        document.getElementById("progress-bar").style.width = progressPercent + "%";
    }

    // 🔥 Now refresh the main page so it updates the progress correctly
    if (!window.location.pathname.includes("goal-details.html")) {
        fetchGoals();  // Refresh the main page goal list
    }
}


