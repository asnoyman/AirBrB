describe('Happy path 2', () => {
  it('Sets up database for Happy path 2', () => {
    // Navigate to home page
    cy.visit('localhost:3000/');

    // Register User and submit, then get taken to home page
    cy.get('#register-button').click();
    cy.get('input').eq(0).type('user1@email.com');
    cy.get('input').eq(1).type('User 1');
    cy.get('input').eq(2).type('P@ssw0rd');
    cy.get('input').eq(3).type('P@ssw0rd');
    // Finish registration and move to home page
    cy.get('button').eq(2).click();
    cy.wait(1000);

    // Move to the hosted listings page
    cy.get(`[aria-label="Hosted Listings"]`).click();
    cy.wait(1000);

    // Create listing 1
    cy.get(`[aria-label="Create New Listing (Form)"]`).click();
    cy.get('input').eq(0).type('Listing 1');
    cy.get('input').eq(1).click().type('4 Set {downArrow}{enter}', { delay: 1000 });
    cy.get(`[aria-label="Add Bedroom"]`).click();
    cy.get('[name="Double"]').type('1');
    cy.get(`[aria-label="Add Beds"]`).click();
    cy.get('input').eq(3).type('1');
    cy.get(`[aria-label="Photo Thumbnail"]`).click();
    cy.get('[id="listing-thumbnail"]').selectFile('cypress/fixtures/listing1_thumbnail.jpeg');
    cy.get('input').eq(6).type('100');
    cy.get(`[aria-label="Create Listing"]`).eq(1).click();
    cy.wait(1000);

    // Create listing 2
    cy.get(`[aria-label="Create New Listing (Form)"]`).click();
    cy.get('input').eq(0).type('Listing 2');
    cy.get('input').eq(1).click().type('1 new {downArrow}{enter}', { delay: 1000 });
    cy.get(`[aria-label="Add Bedroom"]`).click();
    cy.get('[name="King"]').type('2');
    cy.get(`[aria-label="Add Beds"]`).click();
    cy.get('input').eq(3).type('10');
    cy.get(`[aria-label="Photo Thumbnail"]`).click();
    cy.get('[id="listing-thumbnail"]').selectFile('cypress/fixtures/listing2_thumbnail.jpeg');
    cy.get('input').eq(6).type('1000');
    cy.get(`[name="pool"]`).click();
    cy.get(`[name="wifi"]`).click();
    cy.get(`[name="kitchen"]`).click();
    cy.get(`[name="jacuzzi"]`).click();
    cy.get(`[name="parking"]`).click();
    cy.get(`[name="pets"]`).click();
    cy.get(`[aria-label="Create Listing"]`).eq(1).click();
    cy.wait(1000);

    // Create the date ranges, submit the dates, and get taken to the hosted listing page
    cy.get(`[aria-label="Go Live"]`).eq(0).click();
    cy.get('input').eq(0).type('2022-12-10');
    cy.get('input').eq(1).type('2022-12-17');
    cy.get(`[aria-label="Add current Range"]`).click();
    cy.get(`[aria-label="Submit All Dates"]`).click();
    cy.wait(1000);

    // Create the date ranges, submit the dates, and get taken to the hosted listing page
    cy.get(`[aria-label="Go Live"]`).click();
    cy.get('input').eq(0).type('2022-12-10');
    cy.get('input').eq(1).type('2022-12-17');
    cy.get(`[aria-label="Add current Range"]`).click();
    cy.get(`[aria-label="Submit All Dates"]`).click();
    cy.wait(1000);

    // Log out of AirBrB
    cy.get(`[aria-label="Logout"]`).click();
    cy.wait(1000);

    // Register Second User
    cy.get('#register-button').click();
    cy.get('input').eq(0).type('user2@email.com');
    cy.get('input').eq(1).type('User 2');
    cy.get('input').eq(2).type('P@ssw0rd');
    cy.get('input').eq(3).type('P@ssw0rd');
    // Finish registration and move to home page
    cy.get('button').eq(2).click();
    cy.wait(1000);

    // View listing 1
    cy.get('td:first').click();
    cy.wait(3000);

    // Make 2 booking requests
    cy.get(`[aria-label="Make Booking"]`).click();
    cy.get('input').eq(0).type('2022-12-12');
    cy.get('input').eq(1).type('2022-12-15');
    cy.get(`[aria-label="Submit Booking"]`).click();
    cy.wait(1000);

    cy.get(`[aria-label="Make Booking"]`).click();
    cy.get('input').eq(0).type('2022-12-12');
    cy.get('input').eq(1).type('2022-12-15');
    cy.get(`[aria-label="Submit Booking"]`).click();
    cy.wait(1000);

    // Log out
    cy.get(`[aria-label="Logout"]`).click();
    cy.wait(1000);
  });

  it('passes', () => {
    // Navigate to home page
    cy.visit('localhost:3000/');

    // Log in
    cy.get('[aria-label=Login]').click();
    cy.get('input').eq(0).type('user1@email.com');
    cy.get('input').eq(1).type('P@ssw0rd');
    cy.get('button').eq(1).click();
    cy.wait(1000);

    // Filter some listings
    cy.get('input:first').type('listing 2');
    cy.wait(1000);

    // Look at 5 star reviews for top listing
    cy.get('[aria-label="hover-span"]').click();
    cy.get('[aria-label="5-star-ratings"]').click();
    cy.wait(1000);

    // Go back to home page
    cy.get('[aria-label="Close"]').click();
    cy.wait(1000);

    // Move to hosted listings page
    cy.get(`[aria-label="Hosted Listings"]`).click();
    cy.wait(1000);

    // Click booking requests
    cy.get('[aria-label="Booking Requests"]').eq(0).click();
    cy.wait(3000);

    // Accept a request and deny a request
    cy.get(`[aria-label="Accept"]`).eq(0).click();
    cy.wait(1000);
    cy.get(`[aria-label="Deny"]`).click();
    cy.wait(1000);

    // Go back to hosted listings page
    cy.get(`[aria-label="Hosted Listings"]`).click();
    cy.wait(1000);

    // Edit a listing - add more images
    cy.get(`[aria-label="Edit"]`).eq(1).click();
    cy.wait(1000);
    cy.get(`[aria-label="Photo Thumbnail"]`).click();
    cy.get('[id="listing-thumbnail"]').selectFile('cypress/fixtures/listing2_thumbnail.jpeg');
    cy.get(`[aria-label="Add Bedroom"]`).click();
    cy.get('[name="Super King"]').type('2');
    cy.get(`[aria-label="Add Beds"]`).click();
    cy.get(`[aria-label="Property Images"]`).click();
    cy.get('[id="listing-images"]').selectFile([
      'cypress/fixtures/extra_image1.jpeg',
      'cypress/fixtures/extra_image2.jpeg',
    ]);
    cy.get(`[aria-label="Edit Listing"]`).eq(1).click();
    cy.wait(1000);

    // Upload a listing with json
    cy.get(`[aria-label="Create New Listing (JSON)"]`).click();
    cy.wait(1000);
    cy.get(`[aria-label="upload-json-file"]`).click();
    cy.get('[id="upload-json-file"]').selectFile('cypress/fixtures/example_listing.json');
    cy.wait(1000);
    cy.get(`[aria-label="Create Listing"]`).click();
    cy.wait(1000);

    // Delete the top listing
    cy.get(`[aria-label="delete"]`).eq(0).click();
  });
});
