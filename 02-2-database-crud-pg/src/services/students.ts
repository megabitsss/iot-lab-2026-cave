import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { students, type NewStudent, type Student } from "../db/schema.js";

export type StudentInput = Omit<NewStudent, "id">;
export type StudentChanges = Partial<StudentInput>;

// 1. ดึงนักศึกษาทั้งหมด
export async function getStudents(): Promise<Student[]> {
  return db.select().from(students);
}

// 2. ดึงนักศึกษารายคนตาม ID
export async function getStudentById(id: number): Promise<Student | undefined> {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return student;
}

// 3. ตรวจสอบว่ารหัสนักศึกษา (studentId) ซ้ำหรือไม่
export async function studentCodeExists(studentId: string): Promise<boolean> {
  const [student] = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.studentId, studentId))
    .limit(1);
  return student !== undefined;
}

// 4. สร้างนักศึกษาใหม่
export async function createStudent(input: StudentInput): Promise<Student> {
  const [student] = await db.insert(students).values(input).returning();
  if (!student) throw new Error("Failed to create student");
  return student;
}

// 5. อัปเดตข้อมูลนักศึกษา
export async function updateStudent(id: number, changes: StudentChanges): Promise<Student | undefined> {
  const [student] = await db
    .update(students)
    .set(changes)
    .where(eq(students.id, id))
    .returning();
  return student;
}

// 6. ลบข้อมูลนักศึกษา
export async function deleteStudent(id: number): Promise<boolean> {
  const [deleted] = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning({ id: students.id });
  return deleted !== undefined;
}