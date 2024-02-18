import React from 'react';
import PrimaryButton from '../../src/components/PrimaryButton'

describe('Primary Button', () => {
  it('Renders button with given name', () => {
    cy.mount(<PrimaryButton name='test button' onClick={() => { console.log('clicked') }} />)
    cy.get('button').should('contains.text', 'test button')
  })

  it('Outputs clicked to the console when clicked', () => {
    cy.window()
      .its('console')
      .then((console) => {
        cy.spy(console, 'log').as('log')
      })
    cy.mount(<PrimaryButton name='test button' onClick={() => { console.log('clicked') }} />);
    cy.get('button').click()
    cy.get('@log').should("have.been.calledWith", "clicked")
  })

  it('Can be clicked exactly once', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy')
    cy.mount(<PrimaryButton name='test button' onClick={onChangeSpy} />)
    cy.get('button').click()
    cy.get('@onChangeSpy').should('have.been.calledOnce')
    cy.get('button').click()
    cy.get('@onChangeSpy').should('have.been.calledTwice')
  })

  it('Should have a primary background colour', () => {
    cy.mount(<PrimaryButton name='test button' onClick={() => { console.log('clicked') }} />)
    cy.get('button').should('have.css', 'background-color').and('eq', 'rgb(63, 81, 181)')
  })

  it('Should have a white text', () => {
    cy.mount(<PrimaryButton name='test button' onClick={() => { console.log('clicked') }} />)
    cy.get('button').should('have.css', 'color').and('eq', 'rgb(255, 255, 255)')
  })

  it('Should have the class of a primary contained mui button', () => {
    cy.mount(<PrimaryButton name='test button' onClick={() => { console.log('clicked') }} />)
    cy.get('button').should('have.class', 'MuiButton-containedPrimary')
  })
});
