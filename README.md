# hyper-swipe

Simple JQuery implementation of the Hyper Swipe challenge. 

There are some issues with local storage on IE and Edge so we check if the browser is IE or Edge and disable the local storage input if this is the case.

A few animations and text backgrounds display differently in IE and Edge, but the functionality works the same (apart from local storage).

After a card has been added to the like or dislike pile it is possible to click on either pile to display what cards are added to these piles.

The implementation scales reasonably well, all cards are stored in an array after fetched from the API and are only rendered on the page when they are needed.
This goes for both the initial card stack and the card slider, only the current card, the next card, and the previous card is added as an element on the DOM at the same time.
Once more than 10 cards have been added to a stack addition cards will be added to local storage and available for viewing in the slider, but they will not be displayed on the DOM to reduce stress on the client and clutter on the screen in case of large amount of cards.
