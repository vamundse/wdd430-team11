import type { SubjectDetailsProps } from "../components/SubjectDetails";

export const testSubjects: SubjectDetailsProps[] = [
	{
		name: "Web Development",
		code: "WDD430",
		instructor: "Dr. Morgan",
		status: "In progress",
		progress: 65,
		tasks: [
			"Complete responsive layout",
			"Review API routing",
			"Submit project milestone",
		],
	},
	{
		name: "Database Design",
		code: "CSEE310",
		instructor: "Prof. Reyes",
		status: "Not started",
		progress: 0,
		tasks: ["Read normalization chapter", "Design the schema"],
	},
	{
		name: "Technical Writing",
		code: "ENGG301",
		status: "Completed",
		progress: 100,
		tasks: ["Revise final draft"],
	},
];