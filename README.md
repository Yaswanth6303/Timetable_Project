# 📅 Timetable Project

This is a **MERN stack** project designed to display and manage timetables for both students and faculty. The project allows admins to import timetables from an Excel sheet and manage them through a user-friendly interface.

## 🚀 Getting Started

Follow the instructions below to get the project running locally.

### 📝 Prerequisites

Ensure that the following are installed on your machine:

- **Node.js**
- **MongoDB**
- **Git**
- **Postman** (for testing the API)

### 🛠️ Installation

#### 1. Clone the Repository

Open your terminal and run the following command:

```bash
git clone https://github.com/Yaswanth6303/Timetable_Project.git
```

#### 2. Navigate to Backend Folder

After cloning the repository, move into the `backend` directory:

```bash
cd Timetable_Project/backend
```

#### 3. Install Dependencies

Run the following command to install all necessary dependencies:

```bash
npm install
```

#### 4. Set Up Environment Variables

Create a `.env` file in the `backend` folder by copying the content from `.env.example`:

```bash
cp .env.example .env
```

Then, edit the .env file with your personal URLs and credentials (e.g., database URLs, API keys, etc.).

#### 5. Run the Backend

In the `backend` directory, start the server with:

```bash
npm run dev
```

#### 6. Test with Postman

Use Postman to test the API endpoints once the server is running. Make sure to set up the proper environment in Postman for the API base URL and other configurations.

### 📂 Folder Structure

- **backend/:** Contains all backend code, including API routes, controllers, and models.
- **frontend/:** (To be added) This will contain the front-end part of the project.

### ✨ Features
- 🗂️ **Admin Panel:** Manage timetables and faculty accounts.
- 📊 **Excel Import:** Admins can upload Excel files containing timetable information.
- 🔑 **Authentication:** Separate login for students and faculty.
- 📅 **Personalized Timetables:** Faculty members can view their specific timetables with course details.
- 🔄 **Auto Updates:** Timetables are automatically updated in the system as per admin uploads.

### 🧑‍💻 Technologies Used
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **React**
- **Tailwind**
- **Postman (for testing API)**

### 💡 Future Improvements
- Adding the front-end for student and faculty views.
- Implementing more role-based access for students.
- Integrating notification features for timetable changes.

### 🛠️ Debugging Tips
-   Ensure MongoDB is running locally or connected properly in your `.env` file.

- If there are any dependency issues, try deleting `node_modules` and reinstalling them:

```bash
rm -rf node_modules
npm install
```

### 📝 License
This project is open-source.
