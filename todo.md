# Hospital Management System - TODO

## Core Features

### Patient Management
- [x] Patient registration and add new patient records
- [x] Update patient details
- [x] View patient records and history
- [x] Search patients by name, ID, phone
- [x] Delete patient records
- [ ] Patient profile page with complete history

### Doctor Management
- [ ] Add new doctors
- [ ] Update doctor information
- [ ] View doctor list with specializations
- [ ] Assign specializations to doctors
- [ ] Manage doctor schedules/availability
- [ ] Search doctors by name, specialization

### Appointment Management
- [ ] Schedule appointments between patients and doctors
- [ ] Reschedule appointments
- [ ] Cancel appointments
- [ ] View appointment list with filters
- [ ] Appointment calendar view
- [ ] Appointment status tracking (scheduled, completed, cancelled)

### Medical Records Management
- [ ] Record diagnoses for patient visits
- [ ] Record treatments and procedures
- [ ] Add prescriptions to medical records
- [ ] View patient visit history
- [ ] Update medical notes
- [ ] Medical records search and filtering

### Billing and Invoicing
- [ ] Generate bills for treatments
- [ ] Calculate total costs (treatment + medication + consultation)
- [ ] Track payment status
- [ ] View payment history
- [ ] Invoice generation and download
- [ ] Payment reconciliation

### Role-Based Access Control
- [ ] Admin role with full access to all features
- [ ] Doctor role with access to patient records and appointments
- [ ] Receptionist role with access to appointments and billing
- [ ] Role-based navigation and menu items
- [ ] Protected routes based on user role
- [ ] Permission checks on backend procedures

### Dashboard and Navigation
- [ ] Admin dashboard with key metrics
- [ ] Doctor dashboard with patient list and appointments
- [ ] Receptionist dashboard with appointment and billing overview
- [ ] Quick action buttons tailored to each role
- [ ] Sidebar navigation with role-based menu items
- [ ] User profile and logout functionality

### Search and Filter
- [ ] Search patients by name, ID, phone, email
- [ ] Search doctors by name, specialization
- [ ] Search appointments by patient, doctor, date range
- [ ] Filter appointments by status
- [ ] Filter medical records by date range
- [ ] Filter bills by payment status

## Advanced Features

### Notifications System
- [ ] Email notifications for appointment reminders
- [ ] SMS notifications for appointment reminders
- [ ] Billing notification emails
- [ ] Prescription alert notifications
- [ ] Notification scheduling and automation
- [ ] Notification preferences management

### Stripe Payment Integration
- [ ] Set up Stripe account and API keys
- [ ] Create payment processing backend
- [ ] Payment form UI for online bill payment
- [ ] Handle payment success and failure
- [ ] Store payment transaction records
- [ ] Payment receipt generation

### Cloud Storage for Medical Documents
- [ ] Upload medical reports and lab results
- [ ] Upload X-rays and medical images
- [ ] Upload prescriptions and documents
- [ ] Document management and organization
- [ ] Document download functionality
- [ ] Document access control

### Document Management UI
- [ ] Document upload interface
- [ ] Document list and preview
- [ ] Document categorization
- [ ] Document search and filtering
- [ ] Document sharing with doctors/patients

## Design and UI

### Cinematic Aesthetic
- [ ] Implement moody blurred background gradient (deep teal + burnt orange)
- [ ] Bold, centered white sans-serif typography
- [ ] Minimalist geometric accents in cyan and orange
- [ ] Dark atmospheric backdrop with depth and shadow
- [ ] Complementary color interplay
- [ ] Modern technical touch

### UI Components
- [ ] Global styling and theme setup
- [ ] Responsive design for all screen sizes
- [ ] Form components for data entry
- [ ] Table components for data display
- [ ] Modal dialogs for confirmations and forms
- [ ] Loading states and error handling

## Backend Infrastructure

### Database Schema
- [x] Users table (with role field)
- [x] Patients table
- [x] Doctors table
- [x] Appointments table
- [x] Medical Records table
- [x] Bills/Invoices table
- [x] Payments table
- [x] Documents/Files table
- [x] Notifications table
- [x] Prescriptions table

### API Procedures (tRPC)
- [x] Patient CRUD procedures
- [x] Doctor CRUD procedures
- [x] Appointment CRUD procedures
- [x] Medical records CRUD procedures
- [x] Billing procedures
- [x] Payment procedures
- [x] Document upload/download procedures
- [x] Notification procedures
- [x] Search procedures

### Testing
- [ ] Unit tests for critical procedures
- [ ] Integration tests for workflows
- [ ] Role-based access control tests
- [ ] Payment processing tests

## Deployment and Polish

- [ ] Vitest unit tests for all procedures
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Security review and hardening
- [ ] UI/UX polish and refinement
- [ ] Final testing and bug fixes
- [ ] Documentation and user guide
