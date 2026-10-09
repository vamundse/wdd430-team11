import SubjectCard from "./SubjectCard";
import { requireUserId } from "@/lib/session";
import { getProgressBySubject } from "@/lib/tasks";
import type { SubjectDetailsProps } from "./SubjectDetails";

interface SubjectListProps {
    subjects: SubjectDetailsProps[];
}

export default async function SubjectList({ subjects }: SubjectListProps) {
    
    const userId = await requireUserId();
    const progressBySubject = await getProgressBySubject(userId);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {subjects.map((subject) => (
                <SubjectCard
                    subject={{
                        id: subject.id,
                        name: subject.name,
                        code: subject.code,
                        instructor: subject.instructor,
                        color: subject.color,
                        status: subject.status,
                    }}
                    progress={progressBySubject[subject.id] ?? 0}
                    key={subject.id}
                />
            ))}
        </div>
    );
}