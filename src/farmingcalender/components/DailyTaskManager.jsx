import React, { useState } from "react";

const DailyTaskManager = ({
  dailyChecklist,
  pendingTasks,
  onCompleteTask,
  onPostponeTask,
  onRefreshChecklist,
}) => {
  const [postponeReason, setPostponeReason] = useState("");
  const [showPostponeModal, setShowPostponeModal] = useState(null);

  const handleCompleteTask = (taskId, taskData) => {
    onCompleteTask(taskId, taskData);
  };

  const handlePostponeTask = (taskId, taskData) => {
    if (postponeReason.trim()) {
      onPostponeTask(taskId, taskData, postponeReason);
      setPostponeReason("");
      setShowPostponeModal(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-300 text-red-800";
      case "high":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "low":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getTaskEmoji = (taskType) => {
    const emojiMap = {
      irrigation: "💧",
      fertilizer: "🌱",
      pest_control: "🐛",
      harvest: "🌾",
      pruning: "✂️",
      weeding: "🌿",
      soil_testing: "🧪",
      general_care: "✅",
      drainage_check: "🌧️",
      shade_management: "☀️",
      frost_protection: "❄️",
    };
    return emojiMap[taskType] || "✅";
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">
          📅 Today's Farming Plan
        </h2>
        <button
          onClick={onRefreshChecklist}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Pending Tasks from Previous Days */}
      {pendingTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-3">
            ⏳ Carried-over Tasks ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className={`p-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg flex justify-between items-center`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getTaskEmoji(task.task)}</span>
                  <div>
                    <p className="font-medium">
                      {task.task.replace(/_/g, " ").toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">{task.reason}</p>
                    {task.days_pending && (
                      <p className="text-xs text-orange-600">
                        Pending for {task.days_pending} day(s)
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Checklist */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 mb-3">
          🎯 Today's Recommendations ({dailyChecklist.length})
        </h3>

        {dailyChecklist.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No tasks generated for today
            </p>
            <p className="text-gray-400 text-sm">Check back later or refresh</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyChecklist.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTaskEmoji(task.task)}</span>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {task.task.replace(/_/g, " ").toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {task.reason}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Type: {task.type.replace(/_/g, " ").toLowerCase()} •
                        Duration: ~{task.estimated_duration || 1}h
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCompleteTask(task.id, task)}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-medium transition-colors"
                  >
                    ✅ Mark Complete
                  </button>
                  <button
                    onClick={() => setShowPostponeModal(task.id)}
                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 font-medium transition-colors"
                  >
                    ⏸️ Postpone
                  </button>
                </div>

                {/* Postpone Modal */}
                {showPostponeModal === task.id && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 mb-2">
                      Why are you postponing this task?
                    </p>
                    <input
                      type="text"
                      value={postponeReason}
                      onChange={(e) => setPostponeReason(e.target.value)}
                      placeholder="e.g., Waiting for better weather, equipment issue..."
                      className="w-full p-2 border border-yellow-300 rounded mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePostponeTask(task.id, task)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Confirm Postpone
                      </button>
                      <button
                        onClick={() => setShowPostponeModal(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple status message */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 text-center">
          🌱 Tasks are automatically adjusted based on weather and crop
          conditions
        </p>
      </div>
    </div>
  );
};

export default DailyTaskManager;
