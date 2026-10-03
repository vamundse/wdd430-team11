import SubjectCard from "./SubjectCard";
import { getSubjects } from "../lib/actions";
import { requireUserId } from "@/lib/session";
import { getProgressBySubject } from "@/lib/tasks";


export default async function SubjectList() {
    
    const userId = await requireUserId();
    const [subjects, progressBySubject] = await Promise.all([
    getSubjects(),
    getProgressBySubject(userId),
    ]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {subjects.map((subject) => (
                <SubjectCard 
                subject={subject} 
                progress={progressBySubject[subject.id] ?? 0}
                key={subject.code} />
            ))}
        </div>
    );
}