"use client";
import { useState, useEffect } from "react";

interface TaskData {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TaskData) => void;
  taskData?: TaskData | null;
}

export default function TaskModal({ open, onClose, onSave, taskData }: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: "",
    description: "",
    dueDate: "",
    status: "In Progress",
    priority: "Medium",
  });

  useEffect(() => {
    if (taskData) {
      setFormData(taskData);
    }
  }, [taskData]);

  if (!open) return null;

  return (
    <div className="fixed mt-16 inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          {taskData ? "Edit Task" : "Add Task"}
        </h2>

        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded focus:outline-none"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <textarea
            className="w-full p-2 border rounded focus:outline-none"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input
            className="w-full p-2 border rounded focus:outline-none"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
          <select
            className="w-full p-2 border rounded focus:outline-none"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option>Completed</option>
            <option>In Progress</option>
          </select>
          <select
            className="w-full p-2 border rounded focus:outline-none"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(formData);
              setFormData({
                title: "",
                description: "",
                dueDate: "",
                status: "In Progress",
                priority: "Medium",
              })
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
