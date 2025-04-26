"use client";
import './globals.css'
import { useEffect, useState } from "react";
import TaskModal from "@/components/TaskModal";

interface TaskData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
}

export default function TaskTable() {
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<TaskData[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [openTaskIds, setOpenTaskIds] = useState<number[]>([]);

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Newest");

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  
    // Add a small delay to show preloader
    setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5 second delay
  }, []);
  


  const handleSave = (data: Omit<TaskData, "id">) => {
    if (selectedTask) {
      setTasks((prev) =>
        prev.map((task) => (task.id === selectedTask.id ? { ...task, ...data } : task))
      );
    } else {
      setTasks((prev) => [
        ...prev,
        { ...data, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
      ]);
    }
  };


  const toggleTaskDetails = (taskId: number) => {
    setOpenTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId) // close it
        : [...prev, taskId] // open it
    );
  };

  const getProcessedTasks = () => {
    let filteredTasks = [...tasks];
  
    // Filter by Status
    if (filterStatus !== "All") {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus);
    }
  
    // Sort by Due Date
    filteredTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
  
      if (sortOrder === "Newest") {
        return dateB - dateA; // latest first
      } else {
        return dateA - dateB; // oldest first
      }
    });
  
    return filteredTasks;
  };  


  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if(storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    getProcessedTasks()
  }, [tasks])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-600">Tasks</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setOpenModal(true);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-4">
        <select
          className="border p-2 rounded-md"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
        </select>

        <select
          className="border p-2 rounded-md"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
      </div>


      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-red-300 p-4">
      {getProcessedTasks().length > 0 ? (
          <table className="w-full text-left text-sm">
          <thead className="bg-red-100">
            <tr>
              <th className="p-3 text-left">SL.No</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getProcessedTasks().map((task, idx) => (
              <tr key={task.id} className="border-b last:border-none">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.description}</td>
                <td className="p-3">{task.dueDate}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3">{task.priority}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="text-blue-500"
                    onClick={() => {
                      setSelectedTask(task);
                      setOpenModal(true);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                    }}
                  >
                  🗑️
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No tasks found.
          </div>
        )}
        
      </div>

     {/* Mobile View */}
      <div className="md:hidden space-y-4">
      {getProcessedTasks().length > 0 ? (
        getProcessedTasks().map((task) => (
            <div key={task.id} className="border rounded-lg p-4">
              {/* Basic Info */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-red-600 font-bold">Title</div>
                  <div>{task.title}</div>

                  <div className="text-sm text-red-600 font-bold mt-2">Due Date</div>
                  <div>{task.dueDate}</div>

                  <div className="text-sm text-red-600 font-bold mt-2">Status</div>
                  <div>{task.status}</div>
                </div>

                {/* Dropdown Button */}
                <button
                  onClick={() => toggleTaskDetails(task.id)}
                  className="text-gray-700 text-xl"
                >
                  {openTaskIds.includes(task.id) ? "▲" : "▼"}
                </button>
              </div>

              {/* Expanded Details */}
              {openTaskIds.includes(task.id) && (
                <div className="mt-4 text-sm">
                  <div className="text-red-600 font-bold">Description</div>
                  <div>{task.description}</div>

                  <div className="text-red-600 font-bold mt-2">Priority</div>
                  <div>{task.priority}</div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-4 justify-end">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenModal(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => {
                        setTasks((prev) => prev.filter((t) => t.id !== task.id));
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          // your mobile <div> card here
        ))
      ) : (
        <div className="text-center text-gray-500 py-10">
          No tasks found.
        </div>
      )}
      </div>


      {/* Modal */}
      <TaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        taskData={selectedTask}
      />
    </div>
  );
}
