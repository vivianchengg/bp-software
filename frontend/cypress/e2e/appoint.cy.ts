// test; verify email account from auth1.cy.ts before using this test

describe('appointment test', () => {
  // change it to any email available for verification
  const testEmail = Cypress.env("TEST_EMAIL");

  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  // test successful login
  it('successful login', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();

    cy.url().should('include', '/landing');
  });

  // test appointment modals: create + edit + delete
  it('test creating, editing and deleting a modal', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();
    cy.url().should('include', '/landing');

    cy.get('button[aria-label="Create Appointment"]').click(); 
    cy.get('#appoint-create-title').should('have.text', 'Create Appointment');

    cy.get('#submit-create-appoint').click();
    cy.get('.MuiAlert-message').should('have.text', 'The following fields are empty: patient, appointment_time, appointment_length, provider, urgent, appointment_type, status');

    cy.get('[name="patient"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Benjamin Abbott').click();
    cy.get('[name="appointment_time"]').parent().click();
    cy.get('ul[role="listbox"]').contains('09:00').click();
    cy.get('[name="appointment_length"]').parent().click();
    cy.get('ul[role="listbox"]').contains('15 mins').click();
    cy.get('[name="provider"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Dr Ivor Cure').click();
    cy.get('[name="urgent"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Yes').click();
    cy.get('[name="appointment_type"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Telephone Consult').click();
    cy.get('[name="status"]').parent().click();
    cy.get('ul[role="listbox"]').contains('At billing').click();

    cy.get('#submit-create-appoint').click();

    cy.contains('Create Appointment').should('not.be.visible');

    cy.contains('Benjamin Abbott').click();
    cy.contains('button', 'Edit').click();
    cy.get('[name="urgent"]').parent().click();
    cy.get('ul[role="listbox"]').contains('No').click();
    cy.get('[name="appointment_type"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Standard appt.').click();

    cy.get('#submit-edit-appoint').click();

    cy.contains('Benjamin Abbott').click();

    cy.contains('button', 'Delete').click();
    cy.get('#delete-appoint').click();
  });

  });