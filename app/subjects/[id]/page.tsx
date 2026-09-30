import SubjectDetails from "../../../components/SubjectDetails";
import { testSubjects } from "../../../lib/testDb";


export default async function SubjectDetailsPage( { params }: { params: Promise<{id: string}>}) {
    const { id } = await params;
    const subject = testSubjects.find(sub => sub.code === id);

    if (!subject) {
        return <div>Subject not found</div>;
    }

    return (
        <div className="flex flex-col items-center pt-4 min-h-screen w-full bg-gray-100">
            <SubjectDetails {...subject} />
        </div>
    )
}