import { z } from "zod";
import { positiveIdSchema } from "./common.js";

// ตรวจสอบ Parameter :id ใน URL
export const studentIdParamsSchema = z.strictObject({
  id: positiveIdSchema,
});

// ตรวจสอบ Request Body ตอน POST (สร้าง)
export const studentCreateSchema = z.strictObject({
  studentId: z.string().trim().min(1, "Student ID is required").max(20),
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  birthDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date format must be YYYY-MM-DD"),
  gender: z.string().trim().min(1, "Gender is required"),
});

// ตรวจสอบ Request Body ตอน PATCH (แก้ไข - ส่งฟิลด์ใดฟิลด์หนึ่งได้)
export const studentUpdateSchema = studentCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required to update" },
);