import TaskCard from "./TaskCard";
import type { SubjectOption, TaskListItem } from "@/lib/tasks";

interface TaskListProps {
    tasks: TaskListItem[];
    subjects: SubjectOption[];
}

export default async function TaskList({ tasks, subjects }: TaskListProps) {
    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {tasks.map((task) => (
                <TaskCard 
                task={task}
                subjects={subjects}
                key={task.id} />
            ))}
        </ul>
    );
}