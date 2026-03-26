import { eq, and, like, gte, lte, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  patients,
  InsertPatient,
  Patient,
  doctors,
  InsertDoctor,
  Doctor,
  appointments,
  InsertAppointment,
  Appointment,
  medicalRecords,
  InsertMedicalRecord,
  MedicalRecord,
  prescriptions,
  InsertPrescription,
  Prescription,
  bills,
  InsertBill,
  Bill,
  payments,
  InsertPayment,
  Payment,
  documents,
  InsertDocument,
  Document,
  notifications,
  InsertNotification,
  Notification,
  stripeCustomers,
  InsertStripeCustomer,
  StripeCustomer,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= USER QUERIES =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= PATIENT QUERIES =============

export async function createPatient(patient: InsertPatient): Promise<Patient> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(patients).values(patient);
  const patientId = result[0].insertId;
  const newPatient = await db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId as number))
    .limit(1);

  return newPatient[0];
}

export async function getPatientById(id: number): Promise<Patient | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPatients(): Promise<Patient[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(patients).orderBy(desc(patients.createdAt));
}

export async function searchPatients(query: string): Promise<Patient[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(patients)
    .where(
      or(
        like(patients.firstName, `%${query}%`),
        like(patients.lastName, `%${query}%`),
        like(patients.email, `%${query}%`),
        like(patients.phone, `%${query}%`)
      )
    )
    .orderBy(desc(patients.createdAt));
}

export async function updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(patients).set(patient).where(eq(patients.id, id));
  return getPatientById(id);
}

export async function deletePatient(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(patients).where(eq(patients.id, id));
  return true;
}

// ============= DOCTOR QUERIES =============

export async function createDoctor(doctor: InsertDoctor): Promise<Doctor> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(doctors).values(doctor);
  const doctorId = result[0].insertId;
  const newDoctor = await db
    .select()
    .from(doctors)
    .where(eq(doctors.id, doctorId as number))
    .limit(1);

  return newDoctor[0];
}

export async function getDoctorById(id: number): Promise<Doctor | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(doctors).where(eq(doctors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDoctors(): Promise<Doctor[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(doctors).orderBy(desc(doctors.createdAt));
}

export async function getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(doctors)
    .where(eq(doctors.specialization, specialization))
    .orderBy(desc(doctors.createdAt));
}

export async function searchDoctors(query: string): Promise<Doctor[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(doctors)
    .where(
      or(
        like(doctors.firstName, `%${query}%`),
        like(doctors.lastName, `%${query}%`),
        like(doctors.specialization, `%${query}%`)
      )
    )
    .orderBy(desc(doctors.createdAt));
}

export async function updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(doctors).set(doctor).where(eq(doctors.id, id));
  return getDoctorById(id);
}

export async function getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(doctors)
    .where(eq(doctors.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= APPOINTMENT QUERIES =============

export async function createAppointment(appointment: InsertAppointment): Promise<Appointment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(appointments).values(appointment);
  const appointmentId = result[0].insertId;
  const newAppointment = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId as number))
    .limit(1);

  return newAppointment[0];
}

export async function getAppointmentById(id: number): Promise<Appointment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.doctorId, doctorId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getAppointmentsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, startDate),
        lte(appointments.appointmentDate, endDate)
      )
    )
    .orderBy(asc(appointments.appointmentDate));
}

export async function updateAppointment(
  id: number,
  appointment: Partial<InsertAppointment>
): Promise<Appointment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(appointments).set(appointment).where(eq(appointments.id, id));
  return getAppointmentById(id);
}

export async function deleteAppointment(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(appointments).where(eq(appointments.id, id));
  return true;
}

// ============= MEDICAL RECORD QUERIES =============

export async function createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(medicalRecords).values(record);
  const recordId = result[0].insertId;
  const newRecord = await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.id, recordId as number))
    .limit(1);

  return newRecord[0];
}

export async function getMedicalRecordById(id: number): Promise<MedicalRecord | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.patientId, patientId))
    .orderBy(desc(medicalRecords.visitDate));
}

export async function updateMedicalRecord(
  id: number,
  record: Partial<InsertMedicalRecord>
): Promise<MedicalRecord | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(medicalRecords).set(record).where(eq(medicalRecords.id, id));
  return getMedicalRecordById(id);
}

// ============= PRESCRIPTION QUERIES =============

export async function createPrescription(prescription: InsertPrescription): Promise<Prescription> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(prescriptions).values(prescription);
  const prescriptionId = result[0].insertId;
  const newPrescription = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, prescriptionId as number))
    .limit(1);

  return newPrescription[0];
}

export async function getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.patientId, patientId))
    .orderBy(desc(prescriptions.createdAt));
}

export async function getPrescriptionsByMedicalRecord(medicalRecordId: number): Promise<Prescription[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.medicalRecordId, medicalRecordId));
}

export async function updatePrescription(
  id: number,
  prescription: Partial<InsertPrescription>
): Promise<Prescription | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(prescriptions).set(prescription).where(eq(prescriptions.id, id));
  const result = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= BILL QUERIES =============

export async function createBill(bill: InsertBill): Promise<Bill> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bills).values(bill);
  const billId = result[0].insertId;
  const newBill = await db
    .select()
    .from(bills)
    .where(eq(bills.id, billId as number))
    .limit(1);

  return newBill[0];
}

export async function getBillById(id: number): Promise<Bill | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(bills).where(eq(bills.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBillsByPatient(patientId: number): Promise<Bill[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(bills)
    .where(eq(bills.patientId, patientId))
    .orderBy(desc(bills.billDate));
}

export async function getBillsByStatus(status: string): Promise<Bill[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(bills)
    .where(eq(bills.paymentStatus, status as any))
    .orderBy(desc(bills.billDate));
}

export async function updateBill(id: number, bill: Partial<InsertBill>): Promise<Bill | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(bills).set(bill).where(eq(bills.id, id));
  return getBillById(id);
}

// ============= PAYMENT QUERIES =============

export async function createPayment(payment: InsertPayment): Promise<Payment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(payments).values(payment);
  const paymentId = result[0].insertId;
  const newPayment = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId as number))
    .limit(1);

  return newPayment[0];
}

export async function getPaymentsByBill(billId: number): Promise<Payment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(payments)
    .where(eq(payments.billId, billId))
    .orderBy(desc(payments.paymentDate));
}

export async function getPaymentsByPatient(patientId: number): Promise<Payment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(payments)
    .where(eq(payments.patientId, patientId))
    .orderBy(desc(payments.paymentDate));
}

export async function updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(payments).set(payment).where(eq(payments.id, id));
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= DOCUMENT QUERIES =============

export async function createDocument(document: InsertDocument): Promise<Document> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(documents).values(document);
  const documentId = result[0].insertId;
  const newDocument = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId as number))
    .limit(1);

  return newDocument[0];
}

export async function getDocumentsByPatient(patientId: number): Promise<Document[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(documents)
    .where(eq(documents.patientId, patientId))
    .orderBy(desc(documents.createdAt));
}

export async function deleteDocument(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(documents).where(eq(documents.id, id));
  return true;
}

// ============= NOTIFICATION QUERIES =============

export async function createNotification(notification: InsertNotification): Promise<Notification> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  const notificationId = result[0].insertId;
  const newNotification = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, notificationId as number))
    .limit(1);

  return newNotification[0];
}

export async function getNotificationsByUser(userId: number): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function updateNotification(
  id: number,
  notification: Partial<InsertNotification>
): Promise<Notification | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(notifications).set(notification).where(eq(notifications.id, id));
  const result = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= STRIPE CUSTOMER QUERIES =============

export async function createStripeCustomer(
  stripeCustomer: InsertStripeCustomer
): Promise<StripeCustomer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(stripeCustomers).values(stripeCustomer);
  const customerId = result[0].insertId;
  const newCustomer = await db
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.id, customerId as number))
    .limit(1);

  return newCustomer[0];
}

export async function getStripeCustomerByPatientId(patientId: number): Promise<StripeCustomer | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.patientId, patientId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Helper function for OR conditions
function or(...conditions: any[]) {
  return conditions.reduce((acc, cond) => (acc ? { or: [acc, cond] } : cond));
}
