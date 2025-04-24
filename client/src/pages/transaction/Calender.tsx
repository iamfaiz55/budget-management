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

  useEffect(() => {
    if (data && data.result) {
      const transactionMap: { [date: string]: number } = {};
  
      data.result.forEach(({ date, amount, type, isTransfered }) => {
        // ⛔ Skip transferred transactions
        if (isTransfered) return;
  
        if (!transactionMap[date]) {
          transactionMap[date] = 0;
        }
  
        transactionMap[date] += type === "income" ? amount : -amount;
      });
  
      const newEvents = Object.entries(transactionMap).map(([date, balance]) => ({
        title: `Balance: ${balance}`,
        start: date,
        color: balance < 0 ? "red" : "green",
      }));
  
      setEvents(newEvents);
    }
  }, [data]);
  
  const handleDateClick = (info: any) => {
    const selectedDate = info.dateStr;
    navigate(`/user/form/${selectedDate}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-4xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          height="500px"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events}
          dateClick={handleDateClick}
          editable={true}
          selectable={true}
          dayMaxEventRows={3}
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
