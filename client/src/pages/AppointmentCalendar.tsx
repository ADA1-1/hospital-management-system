import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HospitalDashboardLayout from "@/components/HospitalDashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function AppointmentCalendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 27)); // March 27, 2026
  const [draggedAppointment, setDraggedAppointment] = useState<any>(null);

  const appointmentsQuery = trpc.appointment.getByDateRange.useQuery({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  });
  const updateMutation = trpc.appointment.update.useMutation();
  const appointments = appointmentsQuery.data || [];

  // Get calendar days for the current month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  // Get appointments for a specific date
  const getAppointmentsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split("T")[0];
    return appointments.filter((apt: any) => apt.appointmentDate?.split("T")[0] === dateStr);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleDragStart = (appointment: any) => {
    setDraggedAppointment(appointment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDate = async (day: number) => {
    if (!draggedAppointment) return;

    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = newDate.toISOString() as any;

    try {
      await updateMutation.mutateAsync({
        id: draggedAppointment.id,
        appointmentDate: dateStr,
      });
      toast.success("Appointment rescheduled successfully");
      appointmentsQuery.refetch();
      setDraggedAppointment(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to reschedule appointment");
    }
  };

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Appointment Calendar</h1>
          <p className="text-muted-foreground mt-1">View and manage appointments by date</p>
        </div>

        {/* Calendar */}
        <Card className="p-6 bg-card border border-border">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold text-cyan-600">{monthName}</h2>
            <Button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-bold text-cyan-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty days before month starts */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-slate-50 rounded-lg"></div>
            ))}

            {/* Days of month */}
            {calendarDays.map((day) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnDate(day)}
                  className={`aspect-square border-2 rounded-lg p-2 overflow-y-auto cursor-pointer transition-colors ${
                    isToday ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="text-sm font-bold text-slate-700 mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayAppointments.map((apt: any) => (
                      <div
                        key={apt.id}
                        draggable
                        onDragStart={() => handleDragStart(apt)}
                        className={`text-xs p-1 rounded border cursor-move truncate ${getStatusColor(apt.status)}`}
                        title={`${apt.patientName} - ${apt.doctorName}`}
                      >
                        {apt.patientName?.split(" ")[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Appointments List for Selected Date */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Appointments Details</h3>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt: any) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-semibold text-foreground">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      Dr. {apt.doctorName} • {new Date(apt.appointmentDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(apt.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No appointments scheduled</p>
          )}
        </Card>
      </div>
    </HospitalDashboardLayout>
  );
}
