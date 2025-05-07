import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useNavigate } from "react-router-dom";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";

const Calendar: React.FC = () => {
  const { data } = useGetAllTransactionsQuery();
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (data?.result) {
      const transactionMap: { [date: string]: number } = {};

      data.result.forEach(({ date, amount, type, isTransfered }) => {
        if (isTransfered) return;

        transactionMap[date] = transactionMap[date] || 0;
        transactionMap[date] += type === "income" ? amount : -amount;
      });

      const newEvents = Object.entries(transactionMap).map(([date, balance]) => ({
        title: `Balance: ${balance}`,
        start: date,
        color: balance < 0 ? "#f87171" : "#4ade80", // Tailwind red/green
      }));

      setEvents(newEvents);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDateClick = (info: any) => {
    navigate(`/user/form/${info.dateStr}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-2 py-4 sm:px-4 md:px-6">
      <div className="bg-white shadow rounded-lg p-2 sm:p-4 md:p-6 w-full max-w-full sm:max-w-2xl md:max-w-4xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={isMobile ? "listWeek" : "dayGridMonth"}
          height={isMobile ? "auto" : "500px"}
          headerToolbar={{
            left: isMobile ? "prev,next" : "prev,next today",
            center: isMobile ? "" : "title",
            right: isMobile
              ? "listWeek"
              : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events}
          dateClick={handleDateClick}
          editable={false}
          selectable={true}
          dayMaxEventRows={2}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List",
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
