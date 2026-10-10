import SubjectCreateForm from "../../../components/SubjectCreateForm";

export default function CreateSubject() {
    return (
        <div className="flex flex-col items-center pt-4 min-h-screen w-full bg-gray-100">
            <div className="mt-4 w-full text-gray-700">
                <SubjectCreateForm />
            </div>
        </div>
    )
}