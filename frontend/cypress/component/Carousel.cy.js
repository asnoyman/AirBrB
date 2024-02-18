import React from 'react';
import Carousel from '../../src/components/Carousel'

describe('Carousel', () => {
  const title = 'test title'
  const images = [{ img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg' }, { img: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-photos-of-cats-curled-up-sleeping-1593184773.jpg' }]
  it('Renders carousel with given images', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('img').should('have.length', 1);
    cy.get('img').should('have.attr', 'src').should('include', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg')
  })
  it('Has images that are 200px by 200px', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('img').should('have.length', 1);
    cy.get('img').invoke('outerWidth').should('be.eq', 200);
  })
  it('Can click left to show the previous image', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('img').should('have.attr', 'src').should('include', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg')
    cy.get('svg:first').click()
    cy.get('img').should('have.attr', 'src').should('include', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-photos-of-cats-curled-up-sleeping-1593184773.jpg')
  })
  it('Can click right to show the next image', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('img').should('have.attr', 'src').should('include', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg')
    cy.get('svg:first').click()
    cy.get('img').should('have.attr', 'src').should('include', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-photos-of-cats-curled-up-sleeping-1593184773.jpg')
  })
  it('Should have an alt tag for each image', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('img').should('have.attr', 'alt').should('include', 'Property image of test title')
    cy.get('svg:last').click()
    cy.get('img').should('have.attr', 'alt').should('include', 'Property image of test title')
  })
  it('Has a pointer cursor over the svg arrows', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('#next-photo-button').should('have.css', 'cursor').and('eq', 'pointer')
  })
  it('Has a left arrow for the left svg', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('[data-testid=KeyboardArrowLeftIcon]')
  })
  it('Has a right arrow for the right svg', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('[data-testid=KeyboardArrowRightIcon]')
  })
  it('Is centred horizontally and vertically in the div', () => {
    cy.mount(<Carousel title={title} images={images} />)
    cy.get('div').eq(1).should('have.css', 'display', 'flex')
    cy.get('div').eq(1).should('have.css', 'flex-direction', 'row')
    cy.get('div').eq(1).should('have.css', 'justify-content', 'center')
    cy.get('div').eq(1).should('have.css', 'align-items', 'center')
  })
});
