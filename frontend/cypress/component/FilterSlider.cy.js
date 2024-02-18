import React from 'react';
import FilterSlider from '../../src/components/FilterSlider'

describe('Centred Container', () => {
  it('Renders slider with two nodes at 0 and 10 with no marks', () => {
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={0} max={15} marks={false} />)
    cy.get('span').eq(3).should('have.text', '0')
    cy.get('span').eq(7).should('have.text', '10')
    cy.get('span').should('have.length', 11)
  })

  it('Renders slider with two nodes at min and max, where the max text value has a + on the end', () => {
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={0} max={10} marks={false} />)
    cy.get('span').eq(3).should('have.text', '0')
    cy.get('span').eq(7).should('have.text', '10+')
    cy.get('span').should('have.length', 11)
  })

  it('Renders slider with nodes at min and max if intial value is beyond given min and max', () => {
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={1} max={5} marks={false} />)
    cy.get('span').eq(3).should('have.text', '1')
    cy.get('span').eq(7).should('have.text', '5+')
    cy.get('span').should('have.length', 11)
  })

  it('Renders slider with marks if set to true', () => {
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={0} max={10} marks={true} />)
    cy.get('span').should('have.length', 22)
  })

  it('Outputs changed to the console when slider is dragged', () => {
    cy.window()
      .its('console')
      .then((console) => {
        cy.spy(console, 'log').as('log')
      })
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={0} max={10} marks={false} />)
    cy.get('span').eq(7).click()
    cy.get('@log').should("have.been.calledWith", "changed")
    cy.get('span').eq(3).click()
    cy.get('@log').should("have.been.calledWith", "changed")
  })

  it('Creates a text bubble above the slider when the end is clicked', () => {
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={0} max={10} marks={false} />)
    cy.get('span').eq(7).should("not.have.class", "PrivateValueLabel-open-27")
    cy.get('span').eq(3).should("not.have.class", "PrivateValueLabel-open-27")
    cy.get('span').eq(7).click()
    cy.get('span').eq(7).should("have.class", "PrivateValueLabel-open-27")
    cy.get('span').eq(3).should("not.have.class", "PrivateValueLabel-open-27")
    cy.get('span').eq(3).click()
    cy.get('span').eq(7).should("not.have.class", "PrivateValueLabel-open-27")
    cy.get('span').eq(3).should("have.class", "PrivateValueLabel-open-27")
  })

  it('Should have a primary background colour', () => {
    cy.mount(<FilterSlider setValue={[0, 10]} onChange={() => console.log('changed')} min={0} max={10} marks={false} />)
    cy.get('span').eq(3).should('have.css', 'color').and('eq', 'rgb(63, 81, 181)')
  })
});
