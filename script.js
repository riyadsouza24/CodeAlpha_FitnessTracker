const STEP_GOAL = 10000;
const WORKOUT_GOAL = 60;

let activity = JSON.parse(localStorage.getItem("fitnessActivity")) || {
steps: 0,
workoutMinutes: 0,
history: []
};

const stepCount = document.getElementById("stepCount");
const calorieCount = document.getElementById("calorieCount");
const workoutMinutes = document.getElementById("workoutMinutes");

const stepProgress = document.getElementById("stepProgress");
const workoutProgress = document.getElementById("workoutProgress");

const stepPercentage = document.getElementById("stepPercentage");
const workoutPercentage = document.getElementById("workoutPercentage");

const stepsInput = document.getElementById("stepsInput");
const workoutInput = document.getElementById("workoutInput");

const addActivityBtn = document.getElementById("addActivityBtn");
const resetBtn = document.getElementById("resetBtn");

const historyList = document.getElementById("historyList");
const message = document.getElementById("message");

function saveActivity() {
localStorage.setItem("fitnessActivity", JSON.stringify(activity));
}

function renderActivity() {
stepCount.textContent = activity.steps.toLocaleString();
workoutMinutes.textContent = activity.workoutMinutes;

// Rough estimate: approximately 0.04 calories per step.
const calories = Math.round(activity.steps * 0.04);
calorieCount.textContent = calories.toLocaleString();

const stepPercent = Math.min(
    (activity.steps / STEP_GOAL) * 100,
    100
);

const workoutPercent = Math.min(
    (activity.workoutMinutes / WORKOUT_GOAL) * 100,
    100
);

stepProgress.style.width = stepPercent + "%";
workoutProgress.style.width = workoutPercent + "%";

stepPercentage.textContent =
    Math.round(stepPercent) + "% of daily step goal";

workoutPercentage.textContent =
    Math.round(workoutPercent) + "% of daily workout goal";

historyList.innerHTML = "";

if (activity.history.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No activities added yet.";
    historyList.appendChild(item);
} else {
    activity.history.slice().reverse().forEach(function (entry) {
        const item = document.createElement("li");

        item.textContent =
            entry.date +
            " — " +
            entry.steps.toLocaleString() +
            " steps, " +
            entry.minutes +
            " workout minutes";

        historyList.appendChild(item);
    });
}

}

addActivityBtn.addEventListener("click", function () {
const steps = Number(stepsInput.value || 0);
const minutes = Number(workoutInput.value || 0);

if (
    stepsInput.value.trim() === "" &&
    workoutInput.value.trim() === ""
) {
    message.textContent = "Please enter steps or workout minutes.";
    return;
}

if (
    !Number.isFinite(steps) ||
    !Number.isFinite(minutes) ||
    steps < 0 ||
    minutes < 0 ||
    !Number.isInteger(steps) ||
    !Number.isInteger(minutes)
) {
    message.textContent =
        "Enter valid, non-negative whole numbers.";
    return;
}

if (steps === 0 && minutes === 0) {
    message.textContent =
        "Enter at least one step or workout minute.";
    return;
}

activity.steps += steps;
activity.workoutMinutes += minutes;

activity.history.push({
    date: new Date().toLocaleString(),
    steps: steps,
    minutes: minutes
});

saveActivity();
renderActivity();

stepsInput.value = "";
workoutInput.value = "";

message.textContent = "Activity added successfully! 💪";

});

resetBtn.addEventListener("click", function () {
const confirmed = confirm(
"Are you sure you want to reset all activity and history?"
);

if (!confirmed) {
    return;
}

activity = {
    steps: 0,
    workoutMinutes: 0,
    history: []
};

saveActivity();
renderActivity();

message.textContent = "Activity reset successfully.";

});

renderActivity();