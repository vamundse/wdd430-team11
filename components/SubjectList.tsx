import SubjectCard from "./SubjectCard";
import { getSubjects } from "../lib/actions";

export default async function SubjectList() {
    const subjects = await getSubjects();

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {subjects.map((subject) => (
                <SubjectCard subject={subject} key={subject.code} />
            ))}
        </div>
    );
}