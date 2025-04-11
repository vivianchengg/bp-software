// test; verify email account from auth1.cy.ts before using this test

describe('patient test', () => {
  // change it to any email available for verification
  const testEmail = Cypress.env("TEST_EMAIL");

  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('patient page test', () => {
    cy.visit('http://localhost:3333');
    cy.url().should('include', '/login');
    cy.get('#login_email_d').type(testEmail);
    cy.get('#login_pwd_d').type('test123');
    cy.get('.MuiButtonBase-root').click();

    cy.get('#sb_pat').click();
    cy.url().should('include', '/patient');

    cy.get('#pat_bar').should('be.visible');
    cy.get('#sb_pSearch').click();
    cy.get('#pat_bar').should('not.exist');
    cy.get('#sb_pSearch').click();

    cy.get('#p_search_bar').should('be.visible');
    cy.get('#p_noMCheck').should('be.visible');
    cy.get('#p_pCheck').should('be.visible');

    const firstname = 'Felix';
    const lastname = 'Adams';

    cy.get('#p_search_bar').type(firstname);
    cy.get('[data-testid="SearchIcon"]').click();
    cy.get(`#pBar_${firstname}_${lastname}`).should('be.visible');
    cy.get(`#pBar_${firstname}_${lastname}`).click();
    cy.get('#pp_name').should('include.text', `${firstname} ${lastname}`);

    cy.get('#p_noMCheck').find('input[type="checkbox"]').check();
    cy.get(`#pBar_${firstname}_${lastname}`).should('not.exist');

    cy.get('#p_search_bar').clear();
    cy.get('#p_noMCheck').find('input[type="checkbox"]').uncheck();
  });
});