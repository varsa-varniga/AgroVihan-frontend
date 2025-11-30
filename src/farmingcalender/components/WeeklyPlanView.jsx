import React from "react";

const WeeklyPlanView = ({ cropInfo, onTaskUpdate }) => {
  console.log("📊 WeeklyPlanView received:", cropInfo);

  if (!cropInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading weekly plan...</p>
      </div>
    );
  }

  // Get today's date for comparison
  const today = new Date().toISOString().split("T")[0];

  // Extract daily plans from the cropInfo structure
  const dailyPlans = cropInfo.daily_plans || {};
  const weekSummary = cropInfo.week_summary || [];

  // Function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Function to generate single line display
  const generateSingleLineDisplay = (tasks) => {
    if (!tasks || tasks.length === 0) {
      return "No tasks scheduled";
    }

    const taskEmojis = {
      irrigation: "💧",
      fertilizer: "🌱",
      pest_control: "🐛",
      harvest: "🌾",
      pruning: "✂️",
      weeding: "🌿",
      general_care: "✅",
      drainage_check: "🌧️",
      shade_management: "☀️",
      frost_protection: "❄️",
    };

    const mainTask = tasks[0];
    const emoji = taskEmojis[mainTask.task] || "✅";
    const taskName = capitalizeWords(mainTask.task || "General Care");

    if (tasks.length > 1) {
      return `${emoji} ${taskName} (+${tasks.length - 1})`;
    }

    return `${emoji} ${taskName}`;
  };

  // If no week_summary exists, create it from daily_plans
  const effectiveWeekSummary =
    weekSummary.length > 0
      ? weekSummary.map((day) => ({
          ...day,
          single_line_display:
            day.single_line_display ||
            generateSingleLineDisplay(day.tasks || []),
        }))
      : Object.entries(dailyPlans).map(([date, plan]) => ({
          date,
          day_name:
            plan.day_name ||
            new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
          is_today: date === today,
          main_task: plan.tasks?.[0] || null,
          additional_tasks: plan.tasks?.slice(1) || [],
          postponed_count: plan.postponed_tasks?.length || 0,
          total_duration: plan.total_duration || 0,
          single_line_display: generateSingleLineDisplay(plan.tasks || []),
        }));

  const handleTaskComplete = (date, task) => {
    if (onTaskUpdate) {
      onTaskUpdate("completed", task, date, "User marked complete");
    }
  };

  const handleTaskPostpone = (date, task) => {
    const reason = prompt("Why are you postponing this task?");
    if (reason && onTaskUpdate) {
      onTaskUpdate("postponed", task, date, reason);
    }
  };

  // Get today's detailed tasks
  const todaysPlan = dailyPlans[today] || {};
  const todaysTasks = todaysPlan.tasks || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">
          📅 7-Day Farming Plan
        </h2>
        <div className="text-sm text-gray-600">
          Crop:{" "}
          <span className="font-semibold capitalize">
            {cropInfo.crop || "Unknown"}
          </span>{" "}
          • Stage:{" "}
          <span className="font-semibold capitalize">
            {cropInfo.current_stage || "Unknown"}
          </span>
        </div>
      </div>

      {/* Weekly Goals */}
      {cropInfo.weekly_goals && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">🎯 Weekly Goals:</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            {cropInfo.weekly_goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Single-Line Weekly Calendar */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">
          This Week's Schedule:
        </h3>

        <div className="space-y-2">
          {effectiveWeekSummary.map((day, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                day.is_today
                  ? "bg-green-50 border-green-400 shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:bg-white"
              }`}
            >
              {/* Day Info */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-20 text-center ${
                    day.is_today ? "text-green-700 font-bold" : "text-gray-600"
                  }`}
                >
                  <div className="text-sm font-medium">{day.day_name}</div>
                  <div className="text-lg">{day.date.split("-")[2]}</div>
                  {day.is_today && (
                    <div className="text-xs text-green-600 font-medium">
                      TODAY
                    </div>
                  )}
                </div>

                {/* Task Display */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-medium ${
                        day.is_today ? "text-green-800" : "text-gray-700"
                      }`}
                    >
                      {day.single_line_display}
                    </span>

                    {day.postponed_count > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {day.postponed_count} carried over
                      </span>
                    )}
                  </div>

                  {day.is_today && day.main_task && (
                    <p className="text-sm text-gray-600 mt-1">
                      {day.main_task.reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions for Today */}
              {day.is_today && day.main_task && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTaskComplete(day.date, day.main_task)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors font-medium"
                  >
                    ✅ Complete
                  </button>
                  <button
                    onClick={() => handleTaskPostpone(day.date, day.main_task)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors font-medium"
                  >
                    ⏸️ Postpone
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Today's Tasks */}
      {todaysTasks.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">
            📋 Today's Detailed Tasks:
          </h3>
          <div className="space-y-3">
            {todaysTasks.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {generateSingleLineDisplay([task]).split(" ")[0]}
                    </span>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        {capitalizeWords(task.task || "General Task")}
                      </h4>
                      <p className="text-gray-600 mt-1">{task.reason}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority || "medium"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-500">
                    Duration: ~{task.estimated_duration || 1}h • Type:{" "}
                    {capitalizeWords(task.type || "general")}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTaskComplete(today, task)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => handleTaskPostpone(today, task)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Postpone
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carry-over Tasks */}
      {todaysPlan.postponed_tasks && todaysPlan.postponed_tasks.length > 0 && (
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-3">
            ⏳ Carry-over Tasks ({todaysPlan.postponed_tasks.length})
          </h3>
          <div className="space-y-2">
            {todaysPlan.postponed_tasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-orange-100 rounded"
              >
                <span className="text-sm text-orange-800">
                  {capitalizeWords(task.task || "Task")}
                </span>
                <span className="text-xs text-orange-600">
                  {task.postpone_reason
                    ? `Reason: ${task.postpone_reason}`
                    : "Previously postponed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanView;
