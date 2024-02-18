import React from 'react';
import TypeSelect from '../../src/components/TypeSelect'

describe('Type Select', () => {
  it('Renders type select with property type label', () => {
    cy.mount(<TypeSelect value='House' onChange={() => { console.log('clicked') }} />)
    cy.get('label').should('contains.text', 'Property Type')
  })

  it('Renders type select with correct default value of house', () => {
    cy.mount(<TypeSelect value='House' onChange={() => { console.log('clicked') }} />)
    cy.get('#listing-type').should('contains.text', 'House')
  })

  it('Can change the value of the selection by clicking on it', () => {
    cy.mount(<TypeSelect onChange={() => { }} />)
    cy.get('#listing-type').parent().click()
    cy.get('[data-value=Apartment]').click()
    cy.get('#listing-type').should('contains.text', 'Apartment')
    cy.get('#listing-type').parent().click()
    cy.get('[data-value=House]').click()
    cy.get('#listing-type').should('contains.text', 'House')
  })

  it('Has six possible type options', () => {
    cy.mount(<TypeSelect value='House' onChange={() => { console.log('clicked') }} />)
    cy.get('#listing-type').parent().click()
    cy.get('[role=option]').should('have.length', 6)
  })

  it('Does not change the value when you click on the drop down section', () => {
    cy.mount(<TypeSelect value='House' onChange={() => { console.log('clicked') }} />)
    cy.get('#listing-type').parent().click()
    cy.get('#listing-type').should('contains.text', 'House')
  })
});