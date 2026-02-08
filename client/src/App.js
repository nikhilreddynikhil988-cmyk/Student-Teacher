import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Login from "./components/login";
import Card from "./components/card";
import Register from "./components/register";
import Default from "./components/default";

// Student Components
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherList from "./components/student/TeacherList";
import BookAppointment from "./components/student/BookAppointment";

// Teacher Components
import TeacherDashboard from "./components/teacher/TeacherDashboard";

// Shared Components
import Messages from "./components/Messages";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route element={<Card />}>
            <Route index element={<Default />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>

        {/* Protected Shared Routes */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/teachers" element={<TeacherList />} />
        <Route path="/student/book-appointment/:teacherId" element={<BookAppointment />} />
        <Route path="/student/messages" element={<Messages />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/messages" element={<Messages />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

