import React from 'react';
import CreateBedroomModal from '../../src/components/CreateBedroomModal';

describe('Create Bedroom Modal', () => {
  it('Renders create bedroom modal button with correct name', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').should('contains.text', 'Add Bedroom');
  });
  it('Initial button should have a primary background colour', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').should('have.css', 'background-color').and('eq', 'rgb(63, 81, 181)');
    cy.get('button').should('have.css', 'color').and('eq', 'rgb(255, 255, 255)');
  });
  it('Opens up the modal when it is clicked', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('div').should('have.length', 3);
    cy.get('button').click();
    cy.get('div').should('have.length', 21);
  });
  it('Has a primary button and 6 textfields in the modal', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input').should('have.length', 6);
    cy.get('button').should('have.length', 2);
    cy.get('button').eq(1).should('have.css', 'background-color').and('eq', 'rgb(63, 81, 181)');
    cy.get('button').eq(1).should('have.css', 'color').and('eq', 'rgb(255, 255, 255)');
  });
  it('Has correct text at the top of the modal', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('#bedroom-modal-header').should('contains.text', 'How many beds in this room of type:');
  });
  it('Creates an alert when submit button is clicked with no beds', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('button:last').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('There must be at least one bed');
    });
  });
  it('Creates an alert when submit button is clicked and a negative number as one of the beds', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input:first').type('-1');
    cy.get('button:last').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Number of beds must be a positive integer');
    });
  });
  it('Creates an alert when submit button is clicked and a non-integer number of beds is entered', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input:first').type('2.3');
    cy.get('button:last').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Number of beds must be a positive integer');
    });
  });
  it('Creates an alert when submit button is clicked and a non-integer number of beds is entered in one field', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input:first').type('2');
    cy.get('input').eq(1).type('3');
    cy.get('input:last').type('1.1');
    cy.get('button:last').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Number of beds must be a positive integer');
    });
  });
  it('Can have text written into every TextField ', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input').eq(0).type('1');
    cy.get('input').eq(1).type('2');
    cy.get('input').eq(2).type('3');
    cy.get('input').eq(3).type('4');
    cy.get('input').eq(4).type('5');
    cy.get('input').eq(5).type('6');
    cy.get('button:last').click();
    cy.get('button').should('have.length', 1);
  });
  it('Adds a div with the info provided once submit is clicked and there is still a button to make more bedrooms', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input:first').type('2');
    cy.get('button:last').click();
    cy.get('#bedroomDiv').should('contains.text', 'Room 1:');
    cy.get('#bedroomDiv').should('contains.text', 'Super Kings: 2');
  });
  it('Multiple rooms can be created and shown, with the scroll set to the bottom of the div', () => {
    cy.mount(<CreateBedroomModal />);
    cy.get('button').click();
    cy.get('input:first').type('2');
    cy.get('button:last').click();
    cy.get('#bedroomDiv').should('contains.text', 'Room 1:');
    cy.get('#bedroomDiv').should('contains.text', 'Super Kings: 2');
    cy.get('button').click();
    cy.get('input:last').type('3');
    cy.get('button:last').click();
    cy.get('#bedroomDiv').should('contains.text', 'Room 2:');
    cy.get('#bedroomDiv').should('contains.text', 'Singles: 3');
    cy.get('button').click();
    cy.get('input').eq(1).type('1');
    cy.get('input').eq(3).type('2');
    cy.get('button:last').click();
    cy.get('#bedroomDiv').should('contains.text', 'Room 3:');
    cy.get('#bedroomDiv').should('contains.text', 'Kings: 1');
    cy.get('#bedroomDiv').should('contains.text', 'Doubles: 2');
    cy.get('#bedroomDiv').its('scrollY').should('not.equal', 0)
  });
});
