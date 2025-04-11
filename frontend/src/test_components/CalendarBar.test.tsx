import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CalendarBar } from '../components/CalendarBar';
import dayjs from 'dayjs';

describe('Calender Bar', () => {
  it('renders', () => {
    const selectDate = dayjs('2024-11-17').format('YYYY-MM-DD');
    const onDateClick = jest.fn();

    render(<CalendarBar onDateClick={onDateClick} selectedDate={selectDate}/>);

    expect(screen.getByRole('button', { name: "◀" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "▶" })).toBeInTheDocument();
    expect(screen.getByText("Sun, 17 November 2024")).toBeInTheDocument();
  });

  it('prev button works', () => {
    let selectDate = dayjs('2024-11-17').format('YYYY-MM-DD');
    const onDateClick = jest.fn();

    render(<CalendarBar onDateClick={onDateClick} selectedDate={selectDate}/>);

    expect(screen.getByText("Sun, 17 November 2024")).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: "◀" }));

    expect(onDateClick).toHaveBeenCalledTimes(1);
  });

  it('next button works', () => {
    let selectDate = dayjs('2024-11-17').format('YYYY-MM-DD');
    const onDateClick = jest.fn();

    render(<CalendarBar onDateClick={onDateClick} selectedDate={selectDate}/>);

    expect(screen.getByText("Sun, 17 November 2024")).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: "▶" }));

    expect(onDateClick).toHaveBeenCalledTimes(1);
  });
})