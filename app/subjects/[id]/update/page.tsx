import SubjectUpdateForm from "@/components/SubjectUpdateForm";
import { getSubjectById } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function UpdateSubject({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const subject = await getSubjectById(id);

    if (!subject) {
        notFound();
    }

const formSubject = {
    id,
    name: subject?.name,
    code: subject?.code,
    instructor: subject?.instructor,
    color: subject?.color,
    startDate: subject?.startDate,
    endDate: subject?.endDate,
}

    return (
        <div className="flex flex-col items-center pt-4 min-h-screen w-full bg-gray-100">
            <div className="mt-4 w-full text-gray-700">
                <SubjectUpdateForm subject={formSubject} />
            </div>
        </div>
    )
}