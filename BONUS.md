<ol>
    <li>Google autocomplete for address when creating a new listing</li>
    <li>Valid email regex checking upon registering</li>
    <li>Click enter key to submit Login and Register forms</li>
    <li>Can toggle your password on and off when registering and logging in</li>
    <li>Added password strength checking and upon registering it shows which conditions are met as you type in your password</li>
    <li>If you click on the page name (top left of the header) it will take you back to the main site whilst still obeying logged in/out restrictions</li>
    <li>Date error checking</li>
    <li>Loading bar while fetching listings</li>
    <li>No published listed is displayed if there are no published listings and no hosted listings is displayed if the user hasn't created any listings</li>
    <li>Can search through all listings and then filters (if any are applied) apply to the listings that meet the search</li>
    <li>Can filter the search by up to all 4 of the filters and the search at the same time</li>
    <li>Can clear all the filters by clicking clear filters and will reset all the filters to their default/original value and also update the listings to just be filtered by search (if applied) or show all listings</li>
    <li>When setting the number of bedrooms or price filter, if the maximum value is selected it is represented as 8+ and 1300+ rather than just 8 or 1300 respectively</li>
    <li>Checking on each route such that security/login can't be bypassed by changing the route in the url. For example, if a listing id is typed in the url but is not valid or shouldn't be allowed to be accessed by that user, you get redirected to an accessible page. Another example is if an invalid rating number is typed for the view reviews url you get redirected to the all listings page</li>
    <li>Added favicon.ico of logo of AirBrB matching the rest of the colour theme and updated title of webpage. Also updated the content tag of index.html to increase accessibility</li>
    <li>Added a title to every different document page that appears in the top of the tab. E.g. if you move from the main page to your hosted listings, the tab title will change from 'AirBrB' to 'Hosted Listings' etc.</li>
    <li>When adding beds to bedrooms, if you were to add a large number of rooms, the bedroom section becomes scrollable and as you add more beds/rooms the section automatically scrolls to the buttom so you can see the newest room you added</li>
    <li>When looking at booking requests, the time live for a listing is displayed in seconds (if only live for less than a minute), in hours (if live for less than a day), in days (if live for less than a month) and then months otherwise</li>
    <li>Made a looped photo carousel in which the users can click a right or left arrow to go through the thumbnail and all property images. If they click left on the first (thumbnail) image, it will take them to the last one and if they click right on the last image it takes them to the first (thumbnail) image.</li>
    <li>When uploading a new listing using a json file, the address is checked using a google maps API and thus it allows for incomplete address to be nearest matched and more precise locations etc</li>
    <li>Error checking on all arguments when creating a new listing using json</li>
    <li>Can load a youtube video thumbnail when creating a listing with json upload</li>
    <li>Can supply a youtube video link to a watch video rather than the link to embed the video and the frontend will convert the link to an embed link such that the video is playable</li>
    <li>If you are the owner of the listing, you can't see the make booking button or the status of your bookings field on the view listings page</li>
    <li>All pages begin scrolled to the top of the page, even if you initially scrolled down on the previous page before accessing the new page. Also if you refresh the page by clicking on a link in the header to the same page, you will be scrolled to the top of the page</li>
    <li>When editing a listing all the details besides thumbnail and bedrooms autofill for you given the previous information supplied when making the listing</li>
    <li>On the edit listing screen there is helper text for telling you how to select multiple files for the property images</li>
    <li>On the hover rating, it says the overall rating from the number of reviews at the top of the popup. If there are no reviews yet, it says 'No reviews yet' and if there has only been 1 review, it says x out of 5 from 1 review. Otherwise if there have been n reviews (n > 1), it says x out of 5 from n reviews.</li>
    <li>On closing the reviews screen it takes you back to the page from which you clicked on the hover rating from</li>
</ol>
