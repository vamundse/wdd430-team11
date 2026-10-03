import SubjectDetails from "../../../components/SubjectDetails";

export default async function SubjectDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="flex flex-col items-center pt-4 min-h-screen w-full bg-gray-100">
            <SubjectDetails id={id} />
        </div>
    )
}