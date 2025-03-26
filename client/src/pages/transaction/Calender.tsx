import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const Calendar: React.FC=()=>  {
  const [events, setEvents] = useState([
    { title: 'Meeting', start: new Date() },
  ]);

  const handleDateClick = (info:any) => {
    
    // const title = prompt('Enter event title');
    // if (title) {
    //   setEvents([...events, { title, start: info.date }]);
    // }
  };

  return (
    <div className="calendar-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        height="500px"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={events}
        dateClick={handleDateClick}
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default Calendar;
