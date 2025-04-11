// test; restore data.json before test

describe('basic test', () => {
  // change it to any email available for verification
  const testEmail = Cypress.env("TEST_EMAIL");

  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  // test basic layout before login
  it('general auth pages', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get(':nth-child(1) > a').should('have.text', 'Register')
    cy.get(':nth-child(2) > a').should('have.text', 'Reset')
    cy.get(':nth-child(1) > a').click();
    cy.url().should('include', '/signup');
    cy.get(':nth-child(1) > a').should('have.text', 'Login')
    cy.get(':nth-child(1) > a').click();

    // invalid login
    cy.get('#login_email_d').type('wrong@gmail.com');
    cy.get('#login_pwd_d').type('123');
    cy.get('.MuiButtonBase-root').click();
    cy.get('.MuiAlert-message').should('have.text', 'Invalid email or password');
  });

  // test register: unmatched pwd + success
  it('test register', () => {
    cy.visit('http://localhost:3333/signup');

    // password not match
    cy.get('#reg_form_email_d').type(testEmail);
    cy.get('#reg_form_pwd_d').type('test123');
    cy.get('#reg_form_cpwd_d').type('123');

    cy.get('.MuiButtonBase-root').click();
    cy.get('.MuiAlert-message').should('have.text', 'Passwords do not match.');

    // reg
    cy.get('#reg_form_cpwd_d').clear();
    cy.get('#reg_form_cpwd_d').type('test123');
    cy.get('.MuiButtonBase-root').should('have.text', 'CREATE ACCOUNT');
    cy.get('.MuiButtonBase-root').click();

    cy.get('#reg_profile_name_d').click();
    cy.get('[role="option"]').contains('Dr Ivor Cure').click();
    cy.get('#reg_profile_name_d').should('have.text', 'Dr Ivor Cure');

    cy.get('#reg_profile_org_d').click();
    cy.get('[role="option"]').contains('Sydney Hospital').click();
    cy.get('#reg_profile_org_d').should('have.text', 'Sydney Hospital');

    cy.get('#reg_profile_pos_d').click();
    cy.get('[role="option"]').contains('Physician').click();
    cy.get('#reg_profile_pos_d').should('have.text', 'Physician');

    cy.get('.MuiButton-contained').click();

    cy.wait(5000);
    cy.url().should('include', '/login');


  });

  // test invalid login; manual verify before proceeding to other tests
  it('login test', () => {
    cy.visit('http://localhost:3333/login');
    cy.get('#login_email_d').type(testEmail);

    cy.get('#login_pwd_d').type('123');
    cy.get('.MuiButtonBase-root').click();
    cy.get('.MuiAlert-message').should('have.text', 'Invalid email or password');

    cy.get('#login_pwd_d').clear();
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();
    cy.get('.MuiAlert-message').should('have.text', 'User not verified');
  });
});