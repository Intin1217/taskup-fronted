import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalenderView() {
  return (
    <>
      <FullCalendar plugins={[dayGridPlugin]} initialView={'dayGridMonth'} />
      <p>123</p>
    </>
  );
}
