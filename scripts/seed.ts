import { connectToDatabase } from "../lib/mongodb";
import { User } from "../models/User";
import { Subject } from "../models/Subject";
import { Task } from "../models/Task";
import { Event } from "../models/Event";

async function seed() {
  console.log("Connecting to database...");
  await connectToDatabase();

  // Limpa dados antigos de teste (opcional, útil pra rodar o script várias vezes)
  await User.deleteMany({ email: "test@studyhub.dev" });
  console.log("Old test data cleared.");

  // 1. Cria um usuário de teste
  const user = await User.create({
    name: "Test Student",
    email: "test@studyhub.dev",
  });
  console.log("User created:", user._id);

  // 2. Cria uma disciplina relacionada a esse usuário
  const subject = await Subject.create({
    userId: user._id, // <-- aqui está o relacionamento
    name: "Database Systems",
    code: "CS 340",
    instructor: "Prof. Smith Johnson",
    color: "#2f5fe0",
    status: "in_progress",
    progress: 80,
  });
  console.log("Subject created:", subject._id);

  // 3. Cria uma tarefa relacionada ao usuário E à disciplina
  const task = await Task.create({
    userId: user._id,
    subjectId: subject._id, // <-- relacionamento com Subject
    title: "Final project - Databases",
    dueDate: new Date("2026-09-09"),
    status: "pending",
    priority: "high",
  });
  console.log("Task created:", task._id);

  // 4. Cria um evento de calendário relacionado ao usuário e à disciplina
  const event = await Event.create({
    userId: user._id,
    subjectId: subject._id,
    title: "Databases final exam",
    type: "exam",
    date: new Date("2026-09-11"),
    time: "14:00",
  });
  console.log("Event created:", event._id);

  // 5. Prova que o relacionamento funciona: busca a tarefa e "populate" a disciplina
  const taskWithSubject = await Task.findById(task._id).populate("subjectId");
  console.log(
    "Task with populated subject:",
    JSON.stringify(taskWithSubject, null, 2)
  );

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
