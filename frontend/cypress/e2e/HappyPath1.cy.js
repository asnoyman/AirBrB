describe('Happy path 1', () => {
  // Creates a listing which can be booked by the happy path user assuming the database starts empty
  it('sets up database', () => {
    // Navigate to home page
    cy.visit('localhost:3000/');

    // Register User and submit, then get taken to home page
    cy.get('#register-button').click();
    cy.get('input').eq(0).type('setup@user.com');
    cy.get('input').eq(1).type('User Name');
    cy.get('input').eq(2).type('P@ssw0rd');
    // Show and Hide password
    cy.get('button:first').click();
    cy.get('button:first').click();
    cy.get('input').eq(3).type('P@ssw0rd');
    // Show both password and confirm password fields
    cy.get('button:first').click();
    cy.get('button').eq(1).click();
    // Finish registration and move to home page
    cy.get('button').eq(2).click();
    cy.wait(1000)

    // Move to the hosted listings page
    cy.get(`[aria-label="Hosted Listings"]`).click();
    cy.wait(1000);

    // Click create a new listing
    cy.get(`[aria-label="Create New Listing (Form)"]`).click();

    // Fill in form and submit, then get taken to hosted listings page
    cy.get('input').eq(0).type('setup listing');
    cy.get('input').eq(1).click().type('12 Test{downArrow}{enter}', { delay: 1000 });
    cy.get(`[aria-label="Add Bedroom"]`).click()
    cy.get('[name="Super King"]').type('2');
    cy.get(`[aria-label="Add Beds"]`).click()
    cy.get('input').eq(3).type('4');
    cy.get(`[aria-label="Youtube Thumbnail"]`).click()
    cy.get('[id="listing-thumbnail-youtube"]').type('https://www.youtube.com/watch?v=7N63cMKosIE');
    cy.get('input').eq(6).type('150');
    cy.get(`[name="pool"]`).click()
    cy.get(`[aria-label="Create Listing"]`).eq(1).click()
    cy.wait(1000)

    // Click go live
    cy.get(`[aria-label="Go Live"]`).click()

    // Create the date ranges, submit the dates, and get taken to the hosted lsiting page
    cy.get('input').eq(0).type('2022-12-10')
    cy.get('input').eq(1).type('2022-12-17')
    cy.get(`[aria-label="Add current Range"]`).click()
    cy.get(`[aria-label="Submit All Dates"]`).click()
    cy.wait(1000)

    // Log out of AirBrB
    cy.get(`[aria-label="Logout"]`).click()
  })

  it('passes', () => {
    // Navigate to home page
    cy.visit('localhost:3000/');

    // Register User and submit, then get taken to home page
    cy.get('#register-button').click();
    cy.get('input').eq(0).type('user@name.com');
    cy.get('input').eq(1).type('User Name');
    cy.get('input').eq(2).type('P@ssw0rd');
    // Show and Hide password
    cy.get('button:first').click();
    cy.get('button:first').click();
    cy.get('input').eq(3).type('P@ssw0rd');
    // Show both password and confirm password fields
    cy.get('button:first').click();
    cy.get('button').eq(1).click();
    // Finish registration and move to home page
    cy.get('button').eq(2).click();
    cy.wait(1000)

    // Move to the hosted listings page
    cy.get(`[aria-label="Hosted Listings"]`).click();
    cy.wait(1000);

    // Click create a new listing
    cy.get(`[aria-label="Create New Listing (Form)"]`).click();

    // Fill in form and submit, then get taken to hosted listings page
    cy.get('input').eq(0).type('new test listing');
    cy.get('input').eq(1).click().type('28 Clark{downArrow}{enter}', { delay: 1000 });
    cy.get(`[aria-label="Add Bedroom"]`).click()
    cy.get('[name="Super King"]').type('2');
    cy.get(`[aria-label="Add Beds"]`).click()
    cy.get('input').eq(3).type('4');
    cy.get(`[aria-label="Youtube Thumbnail"]`).click()
    cy.get('[id="listing-thumbnail-youtube"]').type('https://www.youtube.com/watch?v=52L7fqaWudU');
    cy.get('input').eq(6).type('150');
    cy.get(`[name="pool"]`).click()
    cy.get(`[aria-label="Create Listing"]`).eq(1).click()
    cy.wait(1000)

    // Click on the listing to move to edit listing page
    cy.get(`[aria-label="Edit"]`).eq(0).click()
    cy.wait(1000)

    // Change title and thumbnail, then submit and get taken to hosted listing page
    cy.get('input').eq(0).type(' updated');
    cy.get(`[aria-label="Youtube Thumbnail"]`).click()
    cy.get('[id="listing-thumbnail-youtube"]').type('https://www.youtube.com/watch?v=YcTZWYOqGw8');
    cy.get(`[aria-label="Add Bedroom"]`).click()
    cy.get('[name="Super King"]').type('2');
    cy.get(`[aria-label="Add Beds"]`).click()
    cy.get(`[aria-label="Edit Listing"]`).eq(1).click()
    cy.wait(1000)

    // Click go live
    cy.get(`[aria-label="Go Live"]`).click()

    // Create the date ranges, submit the dates, and get taken to the hosted listing page
    cy.get('input').eq(0).type('2022-12-10')
    cy.get('input').eq(1).type('2022-12-17')
    cy.get(`[aria-label="Add current Range"]`).click()
    cy.get(`[aria-label="Submit All Dates"]`).click()
    cy.wait(1000)

    // Unpublish the listing
    cy.get(`[aria-label="Unpublish"]`).click()

    // Navigate to home page
    cy.get(`[aria-label="All Listings"]`).click()
    cy.wait(1000)

    // Click a (live) listing to view it, getting taken to view listing page
    cy.get('td').eq(0).click()
    cy.wait(5000)

    // Make a booking on the listing
    cy.get(`[aria-label="Make Booking"]`).click()
    cy.get('input').eq(0).type('2022-12-12')
    cy.get('input').eq(1).type('2022-12-15')
    cy.get(`[aria-label="Submit Booking"]`).click()
    cy.wait(1000)

    // Log out of AirBrB
    cy.get(`[aria-label="Logout"]`).click()
    cy.wait(1000)

    // Log into AirBrB
    cy.get('[aria-label=Login]').click();
    cy.get('input').eq(0).type('user@name.com');
    cy.get('input').eq(1).type('P@ssw0rd');
    cy.get('button').eq(1).click();

  });
});
