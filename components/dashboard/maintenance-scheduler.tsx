"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, AlertTriangle, Plus, Bell } from "lucide-react"

const maintenanceTasks = [
  {
    id: 1,
    task: "Oil Change",
    dueDate: "2025-01-20",
    priority: "Medium",
    estimatedCost: 80,
    estimatedTime: "1 hour",
    status: "upcoming",
    description: "Regular engine oil and filter replacement",
  },
  {
    id: 2,
    task: "Brake Inspection",
    dueDate: "2025-03-01",
    priority: "High",
    estimatedCost: 150,
    estimatedTime: "2 hours",
    status: "upcoming",
    description: "Complete brake system inspection and pad replacement if needed",
  },
  {
    id: 3,
    task: "Tire Rotation",
    dueDate: "2025-02-10",
    priority: "Low",
    estimatedCost: 40,
    estimatedTime: "30 minutes",
    status: "upcoming",
    description: "Rotate tires for even wear distribution",
  },
  {
    id: 4,
    task: "Air Filter Replacement",
    dueDate: "2025-01-15",
    priority: "Medium",
    estimatedCost: 25,
    estimatedTime: "15 minutes",
    status: "overdue",
    description: "Replace engine air filter for optimal performance",
  },
]

export function MaintenanceScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const upcomingTasks = maintenanceTasks.filter((task) => task.status === "upcoming")
  const overdueTasks = maintenanceTasks.filter((task) => task.status === "overdue")

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-[#2a3441] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Maintenance Schedule
              <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage your vehicle maintenance tasks and schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueTasks.length > 0 && (
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h4 className="font-medium text-red-400">Overdue Tasks</h4>
                  </div>
                  <div className="space-y-2">
                    {overdueTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-red-900/10 rounded">
                        <div>
                          <p className="font-medium text-white">{task.task}</p>
                          <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Schedule Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium text-white">Upcoming Tasks</h4>
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-[#1a2332] rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`
                          w-3 h-3 rounded-full
                          ${
                            task.priority === "High"
                              ? "bg-red-500"
                              : task.priority === "Medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }
                        `}
                        />
                        <div>
                          <h5 className="font-medium text-white">{task.task}</h5>
                          <p className="text-sm text-gray-400">{task.description}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          task.priority === "High"
                            ? "bg-red-600 text-white"
                            : task.priority === "Medium"
                              ? "bg-yellow-600 text-white"
                              : "bg-green-600 text-white"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-400">Due Date</p>
                        <p className="text-white">{task.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Est. Cost</p>
                        <p className="text-white">${task.estimatedCost}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Est. Time</p>
                        <p className="text-white">{task.estimatedTime}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Bell className="h-4 w-4 mr-2" />
                        Remind Me
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a3441] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Calendar</CardTitle>
            <CardDescription className="text-gray-400">Select a date to view scheduled tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-gray-600"
            />

            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-white">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Tasks</span>
                  <span className="text-white">{maintenanceTasks.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Overdue</span>
                  <span className="text-red-400">{overdueTasks.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-white">3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
