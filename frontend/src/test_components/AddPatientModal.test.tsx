import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AddPatientModal } from '../components/AddPatientModal';
import { BrowserRouter } from 'react-router-dom';

describe('Add Patient Modal', () => {
  const mockProps = {
    setOpen: jest.fn(),
    setRefresh: jest.fn(),
  }

  it('renders Add Patient Modal opened', () => {
    render(<AddPatientModal open={true} setOpen={mockProps.setOpen} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });
    expect(screen.getByRole('heading', { name: 'Add Patient' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'First Name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Surname' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Gender' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Mobile Phone' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Address 1' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Address 2' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'City' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Postcode' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Medicare?' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Medicare No' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Health Fund?' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Health Fund Name' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Health Fund No' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders Add Patient Modal closed', () => {
    render(<AddPatientModal open={false} setOpen={mockProps.setOpen} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });
    expect(screen.queryByRole('heading', { name: 'Add Patient' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'First Name' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'Surname' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Title' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Gender' })).toBeNull();
    expect(screen.queryByRole('spinbutton', { name: 'Mobile Phone' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'Email' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'Address 1' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'Address 2' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'City' })).toBeNull();
    expect(screen.queryByRole('spinbutton', { name: 'Postcode' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Medicare?' })).toBeNull();
    expect(screen.queryByRole('spinbutton', { name: 'Medicare No' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Health Fund?' })).toBeNull();
    expect(screen.queryByRole('textbox', { name: 'Health Fund Name' })).toBeNull();
    expect(screen.queryByRole('spinbutton', { name: 'Health Fund No' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('on close', async () => {
    render(<AddPatientModal open={true} setOpen={mockProps.setOpen} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(mockProps.setOpen).toHaveBeenCalledTimes(1);
    });
  });

  it('invalid value', async () => {
    render(<AddPatientModal open={true} setOpen={mockProps.setOpen} refresh={false} setRefresh={mockProps.setRefresh} />, { wrapper: BrowserRouter });
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name' }), 'first');
    await userEvent.type(screen.getByRole('textbox', { name: 'Surname' }), 'first');
    await userEvent.type(screen.getByRole('spinbutton', { name: 'Mobile Phone' }), '123456');
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'first');

    await userEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText(/Please fill out the following fields: title, sex, dob, address1, city, postcode/)).toBeInTheDocument();
    });
  });
})
