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
- [x] Add new doctors
- [x] Update doctor information
- [x] View doctor list with specializations
- [x] Assign specializations to doctors
- [x] Manage doctor schedules/availability
- [x] Search doctors by name, specialization

### Appointment Management
- [x] Schedule appointments between patients and doctors
- [x] Reschedule appointments
- [x] Cancel appointments
- [x] View appointment list with filters
- [ ] Appointment calendar view
- [x] Appointment status tracking (scheduled, completed, cancelled)

### Medical Records Management
- [x] Record diagnoses for patient visits
- [x] Record treatments and procedures
- [x] Add prescriptions to medical records
- [x] View patient visit history
- [x] Update medical notes
- [x] Medical records search and filtering

### Billing and Invoicing
- [x] Generate bills for treatments
- [x] Calculate total costs (treatment + medication + consultation)
- [x] Track payment status
- [x] View payment history
- [ ] Invoice generation and download
- [ ] Payment reconciliation

### Role-Based Access Control
- [x] Admin role with full access to all features
- [x] Doctor role with access to patient records and appointments
- [x] Receptionist role with access to appointments and billing
- [x] Role-based navigation and menu items
- [x] Protected routes based on user role
- [x] Permission checks on backend procedures

### Dashboard and Navigation
- [x] Admin dashboard with key metrics
- [x] Doctor dashboard with patient list and appointments
- [x] Receptionist dashboard with appointment and billing overview
- [x] Quick action buttons tailored to each role
- [x] Sidebar navigation with role-based menu items
- [x] User profile and logout functionality

### Search and Filter
- [x] Search patients by name, ID, phone, email
- [x] Search doctors by name, specialization
- [x] Search appointments by patient, doctor, date range
- [x] Filter appointments by status
- [x] Filter medical records by date range
- [x] Filter bills by payment status

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
- [x] Implement moody blurred background gradient (deep teal + burnt orange)
- [x] Bold, centered white sans-serif typography
- [x] Minimalist geometric accents in cyan and orange
- [x] Dark atmospheric backdrop with depth and shadow
- [x] Complementary color interplay
- [x] Modern technical touch

### UI Components
- [x] Global styling and theme setup
- [x] Responsive design for all screen sizes
- [x] Form components for data entry
- [x] Table components for data display
- [x] Modal dialogs for confirmations and forms
- [x] Loading states and error handling

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

## Current Tasks

- [x] Rename system to "ADASIT HOSPITAL"
- [x] Change theme from dark mode to light mode
- [x] Add profile photo upload for patients
- [ ] Add profile photo upload for doctors
- [x] Display profile photos in patient/doctor lists
- [x] Update database schema with photo URLs
- [x] Add hospital building image as logo
- [x] Integrate hospital image in header/navigation
- [x] Add hospital image to sign-in/dashboard pages

## User Profile Management Features

- [x] Create user profile page with view and edit functionality
- [x] Add profile photo upload for users
- [x] Implement logout functionality in navigation
- [x] Enhance login page with better UX
- [x] Add profile menu dropdown in header
- [x] Test all profile features

## Public Navigation Menu

- [x] Create PublicLayout component with navigation
- [x] Update Home page to use PublicLayout
- [x] Add public pages (About, Services, Contact)
- [x] Test public navigation

## Remaining Features to Implement

- [x] Doctor Photo Upload feature
- [x] Appointment Calendar View with drag-and-drop
- [ ] Stripe Payment Integration

## Bug Fixes

- [x] Fix hamburger menu visibility - menu items not showing when menu is open

## Follow-Up Features to Implement

- [ ] Stripe Payment Integration for billing
- [ ] SMS/Email Appointment Reminders
- [x] Medical Document Management UI

## Branding Updates

- [x] Remove Manus watermark from layout
- [x] Replace with GIVTECH COMPANY branding
- [x] Add footer with "Powered by GIVTECH COMPANY"

## Bug Fixes - Current

- [x] Fix hamburger menu visibility for non-admin users (doctor, receptionist, user, patient roles)
- [x] Add stakeholder role visibility to all menu items (Dashboard, Patients, Doctors, Appointments, Medical Records, Billing, Analytics)

## New Features - In Progress

- [x] Add stakeholder profile picture upload functionality

## Bug Fixes - Current

- [x] Fix stakeholder profile picture upload not working
- [x] Add photoUrl column to users table
- [x] Set admin profile picture to Audi car image

## New Features - Current

- [x] Allow all users to update their profile pictures
- [x] Restrict backend/admin features to admin users only
