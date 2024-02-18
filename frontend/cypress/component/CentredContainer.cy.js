import React from 'react';
import CentredContainer from '../../src/components/CentredContainer'

describe('Centred Container', () => {
  it('Renders container with given HTML', () => {
    cy.mount(<CentredContainer>Test Container</CentredContainer>)
    cy.get('div').should('contains.text', 'Test Container')
  })

  it('Renders container with given HTML in the centre of the page and correct styling', () => {
    cy.mount(<CentredContainer>Test Container</CentredContainer>)
    cy.get('div').eq(1).should('have.css', 'position', 'absolute')
    cy.get('div').eq(1).should('have.attr', 'style', (
      `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); \
width: auto; min-width: 308px; height: 100%; margin: 70px 0px 10px; line-height: 1.6;`))
  })

  it('Renders container with given HTML with the Material UI Container class', () => {
    cy.mount(<CentredContainer>Test Container</CentredContainer>)
    cy.get('div').eq(1).should('have.class', 'MuiContainer-root')
  })
});
