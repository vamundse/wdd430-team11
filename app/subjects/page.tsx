import SubjectList from "../../components/SubjectList";
import { testSubjects } from "../../lib/testDb";

export default function Subjects() {
    return (
        <div className="flex flex-col items-center pt-4 min-h-screen w-full bg-gray-100">
            <h1 className="text-3xl font-semibold text-gray-700">Your Subjects</h1>
            <div className="mt-4 text-gray-700">
                <SubjectList subjects={testSubjects} />
            </div>
        </div>
    )
}