import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalenderBox } from './CalenderView.styled';
import { handleDayCellContent } from '@utils/CalenderUtils';
import { useEffect, useState } from 'react';
import apiMainPage from '@apis/apiMainPage';
import { useUserStore } from '@stores/UserStore/userStore';
import { DatesSetArg } from '@fullcalendar/common';
import { useNavigate } from 'react-router-dom';
import { EventClickArg } from '@fullcalendar/core';

interface CalenderType {
  id: number;
  title: string;
  status?: number;
  startDate: string;
  endDate: string;
  members: string[];
  name?: string;
}

export default function CalenderView() {
  const [callEvent, setCallEvent] = useState<CalenderType[]>([]);
  const [calendarTitle, setCalendarTitle] = useState('');
  const { user } = useUserStore();
  const navigate = useNavigate();
  //캘린더 상단 메뉴
  const header = {
    start: 'prevYear,dayGridDay,dayGridWeek,dayGridMonth,nextYear',
    center: 'title',
    end: 'today prev,next',
  };

  const callCalenderEventData = async () => {
    try {
      //임시로 전체 데이터 사용
      const response = await apiMainPage.get(
        `/tasks/calender?startDate=${calendarTitle}&type=month`,
      );
      if (response) {
        setCallEvent(response.data.data);
      }
    } catch (error) {
      console.log('CALENDER VIEW DATA CALL ERROR', error);
    }
  };
  //버튼 별 커스텀
  useEffect(() => {
    callCalenderEventData().catch(console.error);
  }, []);

  useEffect(() => {
    callCalenderEventData().catch(console.error);
  }, [calendarTitle]);

  const handleDateSet = ({ view }: DatesSetArg) => {
    const date = view.currentStart;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (01부터 시작)

    setCalendarTitle(`${year}-${month}`);
  };

  //이벤트 클릭 이동!
  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    navigate(`/view/${eventId}`);
  };

  //날짜 텍스트 보기
  if (!user) {
    return null;
  }
  if (!callEvent) {
    return null;
  }

  const userEventData = callEvent.filter((item) => {
    return item.members.includes(user.name) || item.name === user.name;
  });

  return (
    <CalenderBox>
      <FullCalendar
        plugins={[dayGridPlugin]}
        events={userEventData.map(({ id, title, startDate, endDate }) => ({
          id: id,
          title: title,
          start: startDate,
          end: endDate,
        }))}
        eventClick={handleEventClick}
        initialView="dayGridMonth"
        height="500px"
        editable={true}
        locale="ko"
        dayCellContent={handleDayCellContent}
        headerToolbar={header}
        datesSet={handleDateSet}
        displayEventTime={false}
      />
    </CalenderBox>
  );
}
