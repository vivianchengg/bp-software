// test; verify email account from auth1.cy.ts before using this test

describe('appointment test', () => {
  // change it to any email available for verification
  const testEmail = Cypress.env("TEST_EMAIL");

  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  //test successful login
  it('successful login', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();

    cy.url().should('include', '/landing');
  });

  // test patient modals: create + edit = delete
  it('testing creating, editing and deleting patient modals', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();
    cy.url().should('include', '/landing');

    cy.get('#sb_pat').click();
    cy.url().should('include', '/patient');

    cy.contains('button', 'Add New Patient').click();

    cy.contains('button', 'Submit').click();
    cy.get('.MuiAlert-message').should('have.text', 'Please fill out the following fields: title, firstname, surname, sex, dob, email, mobile_phone, address1, city, postcode');

    cy.get('[name="firstname"]').type('John');
    cy.get('[name="surname"]').type('Doe');
    cy.get('[name="title"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Mr.').click();
    cy.get('[name="gender"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Male').click();
    cy.get('[name="dob"]').type('1990-05-15');
    cy.get('[name="email"]').type('john.doe@gmail.com');
    cy.get('[name="mobile_phone"]').type('0422222222');
    cy.get('[name="address1"]').type('Fort Street');
    cy.get('[name="city"]').type('Sydney');
    cy.get('[name="postcode"]').type('2000');
    cy.get('[name="medicare"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Yes').click();
    cy.get('[name="medicare_no"]').type('0123456789');

    cy.contains('button', 'Submit').click();

    cy.get('li').contains('John Doe').click();

    cy.contains('button', 'Edit Patient').click();
    cy.contains('Edit Patient').should('be.visible');
    cy.get('[name="email"]').clear();
    cy.get('[name="email"]').type('john.doe123@gmail.com');
    cy.get('[name="mobile_phone"]').clear();
    cy.get('[name="mobile_phone"]').type('0422223333');
    cy.get('[name="health_fund"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Yes').click();
    cy.get('[name="health_fund_name"]').type('Medibank');
    cy.get('[name="health_fund_no"]').type('0987654321');
    cy.contains('button', 'Submit').click();

    cy.contains('button', 'Delete Patient').click();
    cy.contains('button', 'Confirm').click();

  });
});