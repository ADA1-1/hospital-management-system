import * as db from "./db";
import { ENV } from "./_core/env";

/**
 * Notification service for sending emails and SMS
 * Uses the Manus built-in notification API
 */

interface EmailNotification {
  to: string;
  subject: string;
  html: string;
}

interface SMSNotification {
  phone: string;
  message: string;
}

/**
 * Send email notification using Manus built-in API
 */
export async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/v1/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: notification.to,
        subject: notification.subject,
        html: notification.html,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send email:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Send SMS notification using Manus built-in API
 */
export async function sendSMS(notification: SMSNotification): Promise<boolean> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/v1/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        phone: notification.phone,
        message: notification.message,
      }),
    });

    if (!response.ok) {
      console.error("[SMS] Failed to send SMS:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[SMS] Error sending SMS:", error);
    return false;
  }
}

/**
 * Send appointment reminder email to patient
 */
export async function sendAppointmentReminderEmail(
  patientEmail: string,
  patientName: string,
  doctorName: string,
  appointmentDate: Date,
  appointmentTime: string
): Promise<boolean> {
  const formattedDate = appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a reminder about your upcoming appointment:</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
      <p>Please arrive 10 minutes early. If you need to reschedule, please contact us as soon as possible.</p>
      <p>Thank you,<br/>Hospital Management System</p>
    </div>
  `;

  return await sendEmail({
    to: patientEmail,
    subject: `Appointment Reminder - ${formattedDate}`,
    html,
  });
}

/**
 * Send appointment reminder SMS to patient
 */
export async function sendAppointmentReminderSMS(
  patientPhone: string,
  patientName: string,
  doctorName: string,
  appointmentTime: string
): Promise<boolean> {
  const message = `Hi ${patientName}, reminder: You have an appointment with Dr. ${doctorName} at ${appointmentTime}. Please arrive 10 minutes early.`;

  return await sendSMS({
    phone: patientPhone,
    message,
  });
}

/**
 * Send billing notification email to patient
 */
export async function sendBillingNotificationEmail(
  patientEmail: string,
  patientName: string,
  billNumber: string,
  totalAmount: string,
  dueDate: Date
): Promise<boolean> {
  const formattedDueDate = dueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">Invoice - Payment Due</h2>
      <p>Dear ${patientName},</p>
      <p>Your medical bill is now ready for payment.</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Bill Number:</strong> ${billNumber}</p>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>
        <p><strong>Due Date:</strong> ${formattedDueDate}</p>
      </div>
      <p>Please make payment by the due date. You can pay online through our hospital portal.</p>
      <p>If you have any questions, please contact our billing department.</p>
      <p>Thank you,<br/>Hospital Management System</p>
    </div>
  `;

  return await sendEmail({
    to: patientEmail,
    subject: `Invoice ${billNumber} - Payment Due`,
    html,
  });
}

/**
 * Send billing notification SMS to patient
 */
export async function sendBillingNotificationSMS(
  patientPhone: string,
  patientName: string,
  billNumber: string,
  totalAmount: string
): Promise<boolean> {
  const message = `Hi ${patientName}, your bill ${billNumber} for $${totalAmount} is due. Please pay at your earliest convenience.`;

  return await sendSMS({
    phone: patientPhone,
    message,
  });
}

/**
 * Send prescription alert email to patient
 */
export async function sendPrescriptionAlertEmail(
  patientEmail: string,
  patientName: string,
  medicationName: string,
  dosage: string,
  frequency: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a73e8;">New Prescription</h2>
      <p>Dear ${patientName},</p>
      <p>You have been prescribed a new medication:</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Medication:</strong> ${medicationName}</p>
        <p><strong>Dosage:</strong> ${dosage}</p>
        <p><strong>Frequency:</strong> ${frequency}</p>
      </div>
      <p>Please follow the dosage instructions carefully. If you experience any side effects, contact your doctor immediately.</p>
      <p>Thank you,<br/>Hospital Management System</p>
    </div>
  `;

  return await sendEmail({
    to: patientEmail,
    subject: `New Prescription - ${medicationName}`,
    html,
  });
}

/**
 * Send prescription alert SMS to patient
 */
export async function sendPrescriptionAlertSMS(
  patientPhone: string,
  patientName: string,
  medicationName: string,
  frequency: string
): Promise<boolean> {
  const message = `Hi ${patientName}, you have been prescribed ${medicationName} - take ${frequency}. Follow doctor's instructions.`;

  return await sendSMS({
    phone: patientPhone,
    message,
  });
}

/**
 * Create and send appointment reminder notifications
 */
export async function createAndSendAppointmentReminder(
  appointmentId: number,
  patientId: number,
  doctorId: number,
  channel: "email" | "sms" | "both" = "email"
): Promise<void> {
  try {
    const appointment = await db.getAppointmentById(appointmentId);
    const patient = await db.getPatientById(patientId);
    const doctor = await db.getDoctorById(doctorId);

    if (!appointment || !patient || !doctor) {
      console.error("[Notification] Missing appointment, patient, or doctor data");
      return;
    }

    const doctorFullName = `${doctor.firstName} ${doctor.lastName}`;
    const appointmentTime = appointment.appointmentTime;
    let success = false;

    if (channel === "email" || channel === "both") {
      if (patient.email) {
        success = await sendAppointmentReminderEmail(
          patient.email,
          patient.firstName,
          doctorFullName,
          appointment.appointmentDate,
          appointmentTime
        );
      }
    }

    if (channel === "sms" || channel === "both") {
      if (patient.phone) {
        success = await sendAppointmentReminderSMS(
          patient.phone,
          patient.firstName,
          doctorFullName,
          appointmentTime
        );
      }
    }

    // Mark reminder as sent
    if (success) {
      await db.updateAppointment(appointmentId, { reminderSent: true });
    }
  } catch (error) {
    console.error("[Notification] Error creating appointment reminder:", error);
  }
}

/**
 * Create and send billing notifications
 */
export async function createAndSendBillingNotification(
  billId: number,
  patientId: number,
  channel: "email" | "sms" | "both" = "email"
): Promise<void> {
  try {
    const bill = await db.getBillById(billId);
    const patient = await db.getPatientById(patientId);

    if (!bill || !patient) {
      console.error("[Notification] Missing bill or patient data");
      return;
    }

    if (channel === "email" || channel === "both") {
      if (patient.email) {
        await sendBillingNotificationEmail(
          patient.email,
          patient.firstName,
          bill.billNumber,
          bill.totalAmount.toString(),
          bill.dueDate || new Date()
        );
      }
    }

    if (channel === "sms" || channel === "both") {
      if (patient.phone) {
        await sendBillingNotificationSMS(
          patient.phone,
          patient.firstName,
          bill.billNumber,
          bill.totalAmount.toString()
        );
      }
    }
  } catch (error) {
    console.error("[Notification] Error creating billing notification:", error);
  }
}

/**
 * Create and send prescription alerts
 */
export async function createAndSendPrescriptionAlert(
  prescriptionId: number,
  patientId: number,
  channel: "email" | "sms" | "both" = "email"
): Promise<void> {
  try {
    const prescription = await db.getPrescriptionsByPatient(patientId);
    const patient = await db.getPatientById(patientId);

    if (!prescription || !patient) {
      console.error("[Notification] Missing prescription or patient data");
      return;
    }

    const presc = prescription.find((p) => p.id === prescriptionId);
    if (!presc) {
      console.error("[Notification] Prescription not found");
      return;
    }

    if (channel === "email" || channel === "both") {
      if (patient.email) {
        await sendPrescriptionAlertEmail(
          patient.email,
          patient.firstName,
          presc.medicationName,
          presc.dosage,
          presc.frequency
        );
      }
    }

    if (channel === "sms" || channel === "both") {
      if (patient.phone) {
        await sendPrescriptionAlertSMS(
          patient.phone,
          patient.firstName,
          presc.medicationName,
          presc.frequency
        );
      }
    }
  } catch (error) {
    console.error("[Notification] Error creating prescription alert:", error);
  }
}
