// test; verify email account from auth1.cy.ts before using this test

describe('nav test', () => {
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

  // test page nav: bars + logout + valid nav
  it('test pages nav', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();
    cy.url().should('include', '/landing');

    cy.get('#side_bar').should('be.visible');
    cy.get('#sb_logo').should('be.visible');
    cy.get('#sb_app').should('be.visible');
    cy.get('#sb_pat').should('be.visible');
    cy.get('#sb_setting').should('be.visible');
    cy.get('#sb_pSearch').should('not.exist');

    cy.get('#sb_logo').click();
    cy.url().should('include', '/landing');

    cy.get('#sb_app').click();
    cy.url().should('include', '/landing');

    cy.get('#sb_pat').click();
    cy.url().should('include', '/patient');
    cy.get('#sb_pSearch').should('be.visible');

    cy.get('#sb_setting').click();
    cy.url().should('include', '/setting');
    cy.get('#sb_pSearch').should('not.exist');

    cy.get('#sb_logo').click();
    cy.url().should('include', '/landing');

    cy.get('#top_bar').should('be.visible');
    cy.get('#tb_profile').click();
    cy.url().should('include', '/setting');

    cy.get('#logout_button').should('be.visible');
    cy.get('#logout_button').click();

    cy.url().should('include', '/login');
    cy.visit('http://localhost:3333/landing');
    cy.url().should('include', '/login');
    cy.visit('http://localhost:3333/patient');
    cy.url().should('include', '/login');
    cy.visit('http://localhost:3333/setting');
    cy.url().should('include', '/login');
  });

});