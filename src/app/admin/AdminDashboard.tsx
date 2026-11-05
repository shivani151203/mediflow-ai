
"use client";

import { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: number;
  patient_name: string;
  mobile: string;
  speciality: string;
  appointment_date: string;
  message: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
};
type Notification = {
  id: number;
  appointment_id: number;
  title: string;
  message: string;
  type: "APPROVED" | "REJECTED";
  is_read: number;
  created_at: string;
  patient_name: string;
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
    async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to logout. Please try again.");
      }

      window.location.href = "/admin/login";
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Logout failed."
      );
    }
  }

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/appointments");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load appointments");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }
  async function fetchNotifications() {
  try {
    const response = await fetch("/api/notifications");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch notifications");
    }

    setNotifications(data.notifications || []);
  } catch (error) {
    console.error("Notification fetch error:", error);
  }
}

async function markAsRead(id: number) {
  try {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to mark as read");
    }

    await fetchNotifications();
  } catch (error) {
    alert(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
}

const unreadCount = notifications.filter(
  (item) => Number(item.is_read) === 0
).length;

async function updateStatus(
  id: number,
  status: "APPROVED" | "REJECTED"
) {
  try {
    const response = await fetch("/api/appointments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to update status");
    }

    await fetchAppointments();
    alert(data.message);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  }
}


  useEffect(() => {
    fetchAppointments();
     fetchNotifications();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patient_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.mobile.includes(search);

      const matchesStatus =
        filter === "ALL" || appointment.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, filter]);

  const pending = appointments.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approved = appointments.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejected = appointments.filter(
    (item) => item.status === "REJECTED"
  ).length;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              MEDIFLOW AI
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              Manage and monitor appointment requests.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
    onClick={handleLogout}
    className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
  >
    Logout
  </button>
          <div className="relative">
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative rounded-lg border border-slate-200 bg-white p-3 text-xl hover:bg-slate-50"
    aria-label="Notifications"
  >
    🔔

    {unreadCount > 0 && (
      <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white">
        {unreadCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 z-50 mt-3 w-80 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <h3 className="mb-3 font-bold text-slate-900">
        Notifications ({unreadCount} unread)
      </h3>

      {notifications.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">
          No notifications yet.
        </p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border p-3 ${
                Number(item.is_read) === 0
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>

                <span
                  className={`text-xs font-semibold ${
                    item.type === "APPROVED"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                {item.message}
              </p>

              {Number(item.is_read) === 0 && (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}

              <p className="mt-2 text-xs text-slate-400">
                {new Date(item.created_at).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Appointments", value: appointments.length },
            { label: "Pending", value: pending },
            { label: "Approved", value: approved },
            { label: "Rejected", value: rejected },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Appointment Requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review and manage patient requests.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search name or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading appointments...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-red-600">{error}</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No appointments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Speciality</th>
                    <th className="p-4">Appointment Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="p-4 font-semibold text-slate-900">
                        {item.patient_name}
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.mobile}
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.speciality}
                      </td>
                      <td className="p-4 text-slate-600">
                        {formatDate(item.appointment_date)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : item.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
  {item.status === "PENDING" ? (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus(item.id, "APPROVED")}
        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
      >
        Approve
      </button>

      <button
        onClick={() => updateStatus(item.id, "REJECTED")}
        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
      >
        Reject
      </button>
    </div>
  ) : (
    <span className="text-slate-400">No actions</span>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          MediFlow AI · Healthcare Appointment Management
        </p>
      </div>
    </main>
  );
}
