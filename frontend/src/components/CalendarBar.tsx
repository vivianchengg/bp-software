import React, { useEffect, useRef, useState } from 'react';
import { CalendarApi } from '@fullcalendar/core';
import dayjs from 'dayjs';
import { Box, Button } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


interface Props {
  selectedDate: string;
  onDateClick: (date: string) => void;
}

export const CalendarBar = ({ selectedDate, onDateClick }: Props) => {

  const calendarRefs = useRef<(CalendarApi | null)[]>([]);

  const syncCal = () => {
    calendarRefs.current.forEach((cal) => {
      if (cal) {
        cal.gotoDate(selectedDate);
      }
    });
  };

  const handlePrev = () => {
    const newDate = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
    onDateClick(newDate);
  };

  const handleNext = () => {
    const newDate = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
    onDateClick(newDate);
  };

  useEffect(() => {
    syncCal();
  }, [selectedDate]);

  const [isEditing, setIsEditing] = useState(false);

  return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
        flexShrink={0}
        sx={{
          backgroundColor: 'white',
          height: '56px',
          width: '100%',
          borderBottom: '1px solid #DCDFE3',
          borderLeft: '1px solid #DCDFE3',
      }}>
        <Button onClick={handlePrev} sx={{
          color: '#3B3E45',
          minWidth: '0px',
          padding: '0px 10px'
        }}>◀</Button>
        <div
          onClick={() => setIsEditing(true)}
          style={{
            fontFamily: 'Roboto',
            fontSize: '14',
            fontWeight: '400',
            color: '#3B3E45',
            fontStyle: 'normal',
            letterSpacing: '0.25px',
            lineHeight: '20px',
            WebkitTextStrokeWidth: '0.5px',
            WebkitTextStrokeColor: '#3B3E45',
            cursor: 'pointer'
          }}
        >
          {isEditing ? (
            <input
              data-testid="date-picker"
              id='datePicker'
              type="date"
              value={selectedDate}
              onChange={(e) => {
                onDateClick(e.target.value);
                (document.getElementById('datePicker') as HTMLInputElement)?.blur();
              }}
              onBlur={() => setIsEditing(false)}
              onFocus={() => {
                (document.getElementById('datePicker') as HTMLInputElement)?.showPicker();
              }}
              autoFocus
              style={{
                fontFamily: 'Roboto',
                fontSize: '15px',
                fontWeight: '400',
                fontStyle: 'normal',
                letterSpacing: '0.25px',
                color: '#3B3E45',
                lineHeight: '20px',
                WebkitTextStrokeWidth: '0.5px',
                WebkitTextStrokeColor: '#3B3E45',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
              }}
            />
          ) : (
            dayjs(selectedDate).format('ddd, D MMMM YYYY')
          )}
        </div>
        <Button onClick={handleNext} sx={{
          color: '#3B3E45',
          minWidth: '0px',
          padding: '0px 10px'
        }}>▶</Button>
      </Box>
  );
}
