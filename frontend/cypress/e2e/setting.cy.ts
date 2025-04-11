// test; verify email account from auth1.cy.ts before using this test

describe('setting test', () => {
  // change it to any email available for verification
  const testEmail = Cypress.env("TEST_EMAIL");

  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('test profile edit', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();

    cy.get('#sb_setting').click();
    cy.url().should('include', '/setting');

    cy.get('#tb_profile').should('include.text', 'Ivor Cure');
    cy.get('#tb_profile').should('include.text', 'Sydney Hospital');

    cy.get('#setting_profile_org').click();
    cy.get('[role="option"]').contains('UNSW Medical Centre and Eye Specialist').click();
    cy.get('#setting_profile_org').should('have.text', 'UNSW Medical Centre and Eye Specialist');

    cy.get('#setting_profile_save_button').should('be.visible');
    cy.get('#setting_profile_save_button').click();

    cy.url().should('include', '/landing');
    cy.get('#tb_profile').should('include.text', 'Ivor Cure');
    cy.get('#tb_profile').should('include.text', 'UNSW Medical Centre and Eye Specialist');
    cy.get('#sb_setting').click();

    cy.get('#setting_profile_org').click();
    cy.get('[role="option"]').contains('Sydney Hospital').click();
    cy.get('#setting_profile_org').should('have.text', 'Sydney Hospital');

    cy.get('#setting_profile_save_button').click();

    cy.url().should('include', '/landing');
    cy.get('#tb_profile').should('include.text', 'Ivor Cure');
    cy.get('#tb_profile').should('include.text', 'Sydney Hospital');
  });
});