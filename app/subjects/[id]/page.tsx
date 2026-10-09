import SubjectDetails, { SubjectDetailsProps } from "@/components/SubjectDetails";
import TaskList from "@/components/TaskList";
import { getTasksForUser, getSubjectOptions } from "@/lib/tasks";
import { getSubjectById } from "@/lib/actions";
import { requireUserId } from "@/lib/session";
import TaskModal from "@/components/TaskModal";
import { notFound } from "next/navigation";
import { getSubjectStatus } from "@/lib/tasks";
import { getProgressBySubject } from "@/lib/tasks";


export default async function SubjectDetailsPage( { params }: { params: Promise<{id: string}>}) {
    const { id } = await params;
    const userId = await requireUserId();
    const subject = await getSubjectById(id);
    const [ tasks, subjects ] = await Promise.all([
        getTasksForUser(userId),
        getSubjectOptions(userId)
    ]);

    const filteredTasks = tasks.filter(task => task.subjectId === id);

    if (!subject) {
        notFound();
    }

    const progressBySubject = await getProgressBySubject(userId); 

    const subjectDetails: SubjectDetailsProps = {
        id,
        name: subject.name,
        code: subject.code,
        instructor: subject.instructor,
        status: getSubjectStatus(subject.status, filteredTasks),
        progress: progressBySubject[id] ?? 0,
        color: subject.color,
        startDate: subject.startDate,
        endDate: subject.endDate,
    };    

    return (
        <div className="flex flex-col items-center pt-4 min-h-screen w-full bg-gray-100">
            <div 
                className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md flex flex-col gap-8"
                style={{ borderLeft: `10px solid ${subjectDetails.color}` }}>
                <div>
                    <SubjectDetails
                        subject={subjectDetails} 
                        progress={subjectDetails.progress ?? 0} />                   
                </div>
                <div className="flex gap-4 justify-between">
                    <h2 className="text-lg font-bold">Tasks</h2>
                    <TaskModal subjects={subjects} defaultSubjectId={id} />
                </div>
                {filteredTasks.length > 0 ? (
                    <TaskList subjects={subjects} tasks={filteredTasks} />
                ) : (

                <p className="h-[100px] text-gray-500 bg-white p-4 border-dashed border-1 border-gray-300 rounded-lg flex justify-center items-center">You have no tasks for this Subject. Click "New Task" to add a task.</p>

                )}
            </div>
        </div>
    )
}