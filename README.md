# Colors:
- Yellow: #FFCC00
- Blue: #2872DD
- Green: #27BE1C
- Red: #DD284A


 How It Works:
Each category has its own list of goals, each with a progress bar.
Clicking a goal opens its detailed page, where users can complete tasks.
Clicking on tasks marks them as completed (green) or not completed (red).
Progress bars automatically update based on completed tasks.
Back button returns to the correct category page instead of always going to the home page.
All progress is saved, so updates remain even after refreshing the page.

 How to Add More Goals
The database is in JavaScript as an object inside script.js.
To add a new goal, edit the goalCategories object in fetchGoals().
When added, the goal automatically appears on the correct main page and links to its detail page.
The teacher's system will eventually handle adding goals dynamically.