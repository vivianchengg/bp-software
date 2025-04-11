import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CreateAppointmentModal } from '../components/CreateAppointmentModal';
import { BrowserRouter } from 'react-router-dom';

describe('Create Appointment Modal', () => {
  const mockProps = {
    onClose: jest.fn(),
    setRefresh: jest.fn(),
  }
  it('renders Create Appointment Modal opened', () => {
    render(<CreateAppointmentModal open={true} onClose={mockProps.onClose} refresh={false} setRefresh={mockProps.setRefresh}/>, { wrapper: BrowserRouter });
    expect(screen.getByRole('heading', { name: 'Create Appointment' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Patient' })).toBeInTheDocument();

    expect(screen.getByRole('combobox', { name: 'Time' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Duration' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Host' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Urgent' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Appointment Type' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Arrival Time' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Consultation Time' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Note' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders Create Appointment Modal closed', () => {
    render(<CreateAppointmentModal open={false} onClose={mockProps.onClose} refresh={false} setRefresh={mockProps.setRefresh}/>, { wrapper: BrowserRouter });
    expect(screen.queryByRole('heading', { name: 'Create Appointment' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Patient' })).toBeNull();

    expect(screen.queryByRole('combobox', { name: 'Time' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Duration' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Host' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Urgent' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Appointment Type' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Status' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Arrival Time' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Consultation Time' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'Note' })).toBeNull();

    expect(screen.queryByRole('button', { name: 'Create' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('on close', async () => {
    render(<CreateAppointmentModal open={true} onClose={mockProps.onClose} refresh={false} setRefresh={mockProps.setRefresh}/>, { wrapper: BrowserRouter });

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('invalid no input', async () => {
    render(<CreateAppointmentModal open={true} onClose={mockProps.onClose} refresh={false} setRefresh={mockProps.setRefresh}/>, { wrapper: BrowserRouter });


    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(screen.getByText(/The following fields are empty: patient, appointment_time, appointment_length, provider, urgent, appointment_type, status/)).toBeInTheDocument();
    });
  });
})