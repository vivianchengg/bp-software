import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DeleteAppointmentModal } from '../components/DeleteAppointmentModal';
import { BrowserRouter } from 'react-router-dom';

describe('Delete Appointment Modal', () => {
  const mockProps = {
    onClose: jest.fn(),
    setRefresh: jest.fn(),
    id: 69,
  }

  it('renders Delete Appointment Modal opened', () => {
    render(<DeleteAppointmentModal open={true} onClose={mockProps.onClose} id={mockProps.id} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });

    expect(screen.getByRole('heading', { name: 'Delete Appointment' })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders Delete Appointment Modal closed', () => {
    render(<DeleteAppointmentModal open={false} onClose={mockProps.onClose} id={mockProps.id} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });

    expect(screen.queryByRole('heading', { name: 'Delete Appointment' })).toBeNull();
    expect(screen.queryByText(/Are you sure\?/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('on close', async () => {
    render(<DeleteAppointmentModal open={true} onClose={mockProps.onClose} id={mockProps.id} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
})
