import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  studentCreateSchema,
  studentIdParamsSchema,
  studentUpdateSchema,
} from "../schemas/students.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  studentCodeExists,
  updateStudent,
} from "../services/students.js";

export const studentsController = new Hono();

// GET / -> ดึงทั้งหมด
studentsController.get("/", async (c) => c.json(await getStudents()));

// GET /:id -> ดึงรายคน
studentsController.get("/:id", zValidator("param", studentIdParamsSchema), async (c) => {
  const { id } = c.req.valid("param");
  const student = await getStudentById(id);
  if (!student) return c.json({ error: "Student not found" }, 404);
  return c.json(student);
});

// POST / -> สร้างนักศึกษาใหม่
studentsController.post("/", zValidator("json", studentCreateSchema), async (c) => {
  const input = c.req.valid("json");
  if (await studentCodeExists(input.studentId)) {
    return c.json({ error: "Student ID already exists" }, 409);
  }
  const student = await createStudent(input);
  return c.json(student, 201);
});

// PATCH /:id -> อัปเดตข้อมูล
studentsController.patch(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  zValidator("json", studentUpdateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const changes = c.req.valid("json");
    const student = await updateStudent(id, changes);
    if (!student) return c.json({ error: "Student not found" }, 404);
    return c.json(student);
  },
);

// DELETE /:id -> ลบข้อมูล
studentsController.delete("/:id", zValidator("param", studentIdParamsSchema), async (c) => {
  const { id } = c.req.valid("param");
  const success = await deleteStudent(id);
  if (!success) return c.json({ error: "Student not found" }, 404);
  return c.body(null, 204);
});