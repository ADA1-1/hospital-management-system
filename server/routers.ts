import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// ============= HELPER PROCEDURES =============

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const doctorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "doctor" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Doctor access required" });
  }
  return next({ ctx });
});

const receptionistProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (
    ctx.user.role !== "receptionist" &&
    ctx.user.role !== "admin"
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Receptionist access required" });
  }
  return next({ ctx });
});

// ============= PATIENT ROUTER =============

const patientRouter = router({
  create: receptionistProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().min(1),
        dateOfBirth: z.date().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        bloodType: z.string().optional(),
        allergies: z.string().optional(),
        medicalHistory: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createPatient(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getPatientById(input.id);
    }),

  getAll: protectedProcedure.query(async () => {
    return await db.getAllPatients();
  }),

  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await db.searchPatients(input.query);
    }),

  update: receptionistProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        bloodType: z.string().optional(),
        allergies: z.string().optional(),
        medicalHistory: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updatePatient(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deletePatient(input.id);
    }),
});

// ============= DOCTOR ROUTER =============

const doctorRouter = router({
  create: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        specialization: z.string().min(1),
        licenseNumber: z.string().min(1),
        qualifications: z.string().optional(),
        yearsOfExperience: z.number().optional(),
        consultationFee: z.string().optional(),
        isAvailable: z.boolean().optional(),
        workingHoursStart: z.string().optional(),
        workingHoursEnd: z.string().optional(),
        workingDays: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createDoctor(input as any);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getDoctorById(input.id);
    }),

  getAll: protectedProcedure.query(async () => {
    return await db.getAllDoctors();
  }),

  getBySpecialization: protectedProcedure
    .input(z.object({ specialization: z.string() }))
    .query(async ({ input }) => {
      return await db.getDoctorsBySpecialization(input.specialization);
    }),

  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await db.searchDoctors(input.query);
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        specialization: z.string().optional(),
        qualifications: z.string().optional(),
        yearsOfExperience: z.number().optional(),
        consultationFee: z.string().optional(),
        isAvailable: z.boolean().optional(),
        workingHoursStart: z.string().optional(),
        workingHoursEnd: z.string().optional(),
        workingDays: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateDoctor(id, data as any);
    }),

  getByUserId: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await db.getDoctorByUserId(input.userId);
    }),
});

// ============= APPOINTMENT ROUTER =============

const appointmentRouter = router({
  create: receptionistProcedure
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number(),
        appointmentDate: z.date(),
        appointmentTime: z.string(),
        reason: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createAppointment(input as any);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getAppointmentById(input.id);
    }),

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAppointmentsByPatient(input.patientId);
    }),

  getByDoctor: doctorProcedure
    .input(z.object({ doctorId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAppointmentsByDoctor(input.doctorId);
    }),

  getByDateRange: protectedProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ input }) => {
      return await db.getAppointmentsByDateRange(input.startDate, input.endDate);
    }),

  update: receptionistProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["scheduled", "completed", "cancelled", "no-show"]).optional(),
        appointmentDate: z.date().optional(),
        appointmentTime: z.string().optional(),
        reason: z.string().optional(),
        notes: z.string().optional(),
        reminderSent: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateAppointment(id, data as any);
    }),

  delete: receptionistProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deleteAppointment(input.id);
    }),
});

// ============= MEDICAL RECORD ROUTER =============

const medicalRecordRouter = router({
  create: doctorProcedure
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number(),
        appointmentId: z.number().optional(),
        visitDate: z.date(),
        diagnosis: z.string().optional(),
        treatment: z.string().optional(),
        notes: z.string().optional(),
        vitals: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createMedicalRecord(input as any);
    }),

  getById: doctorProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getMedicalRecordById(input.id);
    }),

  getByPatient: doctorProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await db.getMedicalRecordsByPatient(input.patientId);
    }),

  update: doctorProcedure
    .input(
      z.object({
        id: z.number(),
        diagnosis: z.string().optional(),
        treatment: z.string().optional(),
        notes: z.string().optional(),
        vitals: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateMedicalRecord(id, data as any);
    }),
});

// ============= PRESCRIPTION ROUTER =============

const prescriptionRouter = router({
  create: doctorProcedure
    .input(
      z.object({
        medicalRecordId: z.number(),
        patientId: z.number(),
        doctorId: z.number(),
        medicationName: z.string().min(1),
        dosage: z.string().min(1),
        frequency: z.string().min(1),
        duration: z.string().optional(),
        instructions: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createPrescription(input as any);
    }),

  getByPatient: doctorProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPrescriptionsByPatient(input.patientId);
    }),

  getByMedicalRecord: doctorProcedure
    .input(z.object({ medicalRecordId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPrescriptionsByMedicalRecord(input.medicalRecordId);
    }),

  update: doctorProcedure
    .input(
      z.object({
        id: z.number(),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.string().optional(),
        instructions: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updatePrescription(id, data as any);
    }),
});

// ============= BILL ROUTER =============

const billRouter = router({
  create: receptionistProcedure
    .input(
      z.object({
        patientId: z.number(),
        billNumber: z.string().min(1),
        billDate: z.date(),
        dueDate: z.date().optional(),
        treatmentCost: z.string().optional(),
        medicationCost: z.string().optional(),
        consultationFee: z.string().optional(),
        otherCharges: z.string().optional(),
        discount: z.string().optional(),
        totalAmount: z.string().min(1),
        paymentStatus: z.enum(["pending", "partial", "paid", "overdue"]).optional(),
        paymentMethod: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createBill(input as any);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getBillById(input.id);
    }),

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await db.getBillsByPatient(input.patientId);
    }),

  getByStatus: receptionistProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await db.getBillsByStatus(input.status);
    }),

  update: receptionistProcedure
    .input(
      z.object({
        id: z.number(),
        paymentStatus: z.enum(["pending", "partial", "paid", "overdue"]).optional(),
        paymentMethod: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateBill(id, data as any);
    }),
});

// ============= PAYMENT ROUTER =============

const paymentRouter = router({
  create: receptionistProcedure
    .input(
      z.object({
        billId: z.number(),
        patientId: z.number(),
        amount: z.string().min(1),
        paymentMethod: z.string().min(1),
        transactionId: z.string().optional(),
        status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createPayment(input as any);
    }),

  getByBill: protectedProcedure
    .input(z.object({ billId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPaymentsByBill(input.billId);
    }),

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPaymentsByPatient(input.patientId);
    }),

  update: receptionistProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updatePayment(id, data as any);
    }),
});

// ============= DOCUMENT ROUTER =============

const documentRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number().optional(),
        fileName: z.string().min(1),
        fileType: z.string().optional(),
        fileSize: z.number().optional(),
        fileUrl: z.string().url(),
        fileKey: z.string().min(1),
        documentType: z.enum(["report", "xray", "lab_result", "prescription", "other"]).optional(),
        uploadedBy: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.createDocument({
        ...input,
        uploadedBy: ctx.user.id,
      } as any);
    }),

  getByPatient: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return await db.getDocumentsByPatient(input.patientId);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deleteDocument(input.id);
    }),
});

// ============= NOTIFICATION ROUTER =============

const notificationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        patientId: z.number().optional(),
        appointmentId: z.number().optional(),
        billId: z.number().optional(),
        type: z.enum(["appointment_reminder", "billing", "prescription", "general"]),
        channel: z.enum(["email", "sms", "in_app"]),
        subject: z.string().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createNotification(input as any);
    }),

  getByUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await db.getNotificationsByUser(input.userId);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "sent", "failed"]).optional(),
        sentAt: z.date().optional(),
        failureReason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateNotification(id, data as any);
    }),
});

// ============= MAIN ROUTER =============

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  patient: patientRouter,
  doctor: doctorRouter,
  appointment: appointmentRouter,
  medicalRecord: medicalRecordRouter,
  prescription: prescriptionRouter,
  bill: billRouter,
  payment: paymentRouter,
  document: documentRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
