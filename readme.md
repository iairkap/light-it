# MediCore - Patient Registration System 🏥

A modern, full-stack medical patient management system built with scalability and user experience in mind. This project was developed as a technical challenge, focusing on high-performance UI patterns and a robust backend architecture.

## 🚀 Key Features

* **Zero-Latency UX**: Implementation of **True Optimistic UI** using React 19's `useOptimistic` hook, allowing for immediate feedback during patient registration.
* **Resilient Forms**: Persistent form state using `localStorage` and **Controlled Inputs** to prevent data loss on validation errors or accidental refreshes.
* **Smart File Handling**: Custom Drag & Drop JPEG uploader with manual binary injection to ensure document persistence across form re-renders.
* **Asynchronous Communications**: Event-driven email confirmation system that prevents blocking the main execution thread.
* **Scalable Architecture**: Modular NestJS backend inspired by Clean Architecture, prepared for future integrations (e.g., SMS notifications via Event Listeners).
* **Responsive Dashboard**: Expandable patient records, real-time search, and classic pagination for efficient data management.

## 🛠️ Tech Stack

### Frontend
* **React 19**: Utilizing `useActionState`, `useOptimistic`, and `Suspense`.
* **TypeScript**: Strict typing for domain entities and component props.
* **Framer Motion**: Purpose-built animations for error states and modal transitions.
* **Tailwind CSS**: Custom design system without external UI libraries (built from scratch).

### Backend
* **NestJS**: Modular architecture with Dependency Injection.
* **PostgreSQL**: Relational data storage with TypeORM.
* **Docker**: Containerized environment for reproducible development.
* **MailHog/Mailtrap**: SMTP testing environment for asynchronous emails.

## ⚙️ Installation & Setup

Ensure you have **Docker** and **Docker Compose** installed.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd medicore-challenge
    ```

2.  **Environment Variables**:
    The project comes with pre-configured `.env` files for the development environment. No manual changes are required for a standard Docker setup.

3.  **Launch the application**:
    ```bash
    docker compose up --build
    ```

4.  **Access the apps**:
    * **Frontend**: [http://localhost:5173](http://localhost:5173)
    * **Backend API**: [http://localhost:3000](http://localhost:3000)
    * **MailHog (Local Email)**: [http://localhost:8025](http://localhost:8025)

## 🧪 Seeding & Mock Data
To clean the database or populate it with mock patients, you can use the included script.

### Option A: Via Local Node (Fastest)
If you have Node/npm installed locally:
```bash
# Clean Database & Uploads
cd backend
npm run seed

# Clean & Populate with 50 Mock Patients
cd backend
npm run seed -- --seed
```

### Option B: Via Docker
If you prefer running everything inside containers:
```bash
# Clean & Populate
docker compose exec backend npm run seed -- --seed
```

## 🧠 Architectural Decisions

### Why NestJS?
Chosen for its "batteries-included" approach and strong adherence to **SOLID** principles, closely mirroring the conventions and best practices of frameworks like Laravel while leveraging the type-safety of TypeScript.

### Controlled vs Uncontrolled Components
While React 19 facilitates uncontrolled forms, this project uses **Controlled Inputs**. This decision was made to ensure data persistence after server-side validation errors, providing a smoother UX where the user never loses their progress.

### Future-Proofing (SMS)
The system uses an `EventEmitter` for the registration flow. To add SMS notifications in the future, one simply needs to add a new `SmsListener` to the `patient.registered` event, adhering to the **Open/Closed Principle**.

---
*Disclaimer: This project was built for review by the Light-it Engineering team. All source code is anonymous to ensure a fair evaluation process.*
