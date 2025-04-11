import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DeletePatientModal } from '../components/DeletePatientModal';
import { BrowserRouter } from 'react-router-dom';

describe('Delete Patient Modal', () => {
  const mockProps = {
    setOpen: jest.fn(),
    setPatienetId: jest.fn(),
    setRefresh: jest.fn(),
    id: 69,
  }

  it('renders Delete Patient Modal opened', () => {
    render(<DeletePatientModal open={true} setOpen={mockProps.setOpen} pid={mockProps.id} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });

    expect(screen.getByRole('heading', { name: 'Delete Patient' })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders Delete Patient Modal closed', () => {
    render(<DeletePatientModal open={false} setOpen={mockProps.setOpen} pid={mockProps.id} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });

    expect(screen.queryByRole('heading', { name: 'Delete Patient' })).toBeNull();
    expect(screen.queryByText(/Are you sure\?/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('on close', async () => {
    render(<DeletePatientModal open={true} setOpen={mockProps.setOpen} pid={mockProps.id} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(mockProps.setOpen).toHaveBeenCalledTimes(1);
    });
  });
})
