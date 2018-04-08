var isIE = false || !!document.documentMode;

var isEdge = !isIE && !!window.StyleMedia;

$(document).ready(function(){

	var cards = [];
	var slideCards = [];
	var currentCard = 0;
	var currentSlide = 0;
	
	//Set initial % away from edge cards will be positioned once placed.
	var like =  25; 
	var dislike =  25;
	
	//Make the main card a draggable with JQuery UI
	$( ".Mask" ).draggable({ 
		axis: "x",
		containment: "body",
		revert: "invalid",
		scroll:false
	});
	
	//Make the overlay divs around the like and dislike box a droppable which accepts the main card.
	$(".like-wrapper, .dislike-wrapper").droppable({
		accept: ".Mask",
		drop: function(event, ui){	
		
			//Give the dropped card a new class to resize it and make it fit in the dropped stack.
			$(ui.draggable).addClass("droppedCard");
			if($(this).hasClass("like-wrapper")){
			
				//If dropped in the like area give the card new css properties to position it correctly on the like stack.
			
				var type = "like";
				if(like < 35){
				
					$(ui.draggable).css("right","calc( "+like + "% - 170px )");
					$(ui.draggable).css("left","");
				}	
				
				//If too many cards are already placed just detach it from the DOM.
				else{
					$(ui.draggable).detach();
				}
				like++;
			}
			else{
			
				//Position the card correctly on the dislike stack.
				var type = "dislike";
				if(dislike < 35){
					$(ui.draggable).css("left","calc( "+dislike + "% - 170px )");
				}
				else{
					$(ui.draggable).detach();
				}
				dislike++;
				
			}
			
			//Set the card status to like or dislike depending on where it was dropped.
			cards[currentCard].status = type;
			
			//Add new classes to the text and picture elements to resize them to fit on the smaller dropped stack.
			//Transition effect is given via CSS once the properties of the element change.
			$(".Mask .card-heading").addClass("card-heading-small");
			$(".Mask .card-heading").removeClass("card-heading");
			
			$(".Mask .card-text").addClass("card-text-small");
			$(".Mask .card-text").removeClass("card-text");
			
			$(ui.draggable).removeClass("Mask");
			
			$(".MainPicture").addClass("droppedCardPic");
			$(".MainPicture").removeClass("MainPicture");
			
			//Give the second card in the main stack the main card classes to pop it to the front and remove the old classes.
			ui.draggable.draggable({disabled: true});
			$(".SecondMask").addClass("Mask");
			$(".SecondMask").removeClass("SecondMask");
			
			//New card is made draggable.
			$( ".Mask" ).draggable({ 
				axis: "x",
				revert: "invalid",
				scroll:false
			});
			
			//Third card in the main stack is popped to the second position.
			$(".ThirdMask").addClass("SecondMask");
			$(".ThirdMask").removeClass("ThirdMask");
			
			$(".SecondPicture").addClass("MainPicture");
			$(".SecondPicture").removeClass("SecondPicture");
			
			$(".ThirdPicture").addClass("SecondPicture");
			$(".ThirdPicture").removeClass("ThirdPicture");
			
			currentCard++;
			
			//If there are 3 or more cards left in the main stack we add a new card to the DOM and give it the third position classes.
			if(currentCard+2 < cards.length){
			
				$(".cards").append('<div class="ThirdMask"><img src="' + cards[currentCard+2].image + '" class="ThirdPicture"></img><h3 class="card-heading">'+cards[currentCard+2].title+'</h3><p class="card-text">'+cards[currentCard+2].body+'</p></div>');
			}
			
			//Update the local storage if not on IE or Edge.
			if(!isIE && !isEdge){
				var setStorage = cards.filter(function(element){
					if(element.status != null){
						return element;
					}
				});
			}
			
			localStorage.setItem("hyperswipe", JSON.stringify(setStorage));
			
		}
	});
	
	//The overlay class over the like and dislike boxes are given a click event to pop up the modal.
	$(".dislike-overlay, .like-overlay").on("click", function(){
	
		//Clean old modal content.
		$(".error").remove();
		
		$(".modal-content .Mask").remove();
	
		//Set type and header.
		if($(this).hasClass("like-overlay")){
			var type = "like";
			$("#imgHeader").text("LIKE");
		}
		else{
			var type = "dislike";
			$("#imgHeader").text("DISLIKE");
		}
		
		currentSlide = 0;
		
		//Reset the buttons.
		$("#prevImg").hide();
		
		if(!$("#nextImg").is(":visible")){
			$("#nextImg").show();
		}

		//Open modal with a fade and add close events with fade out.
		var span = document.getElementsByClassName("close")[0];
		
		$("#imageModal").fadeIn(1000);

		span.onclick = function() {
			$("#imageModal").fadeOut();

		}

		var modal = document.getElementById('imageModal');
		window.onclick = function(event) {
			if (event.target == modal) {
				$("#imageModal").fadeOut();
			}
		}
		
		//Find which cards are in the stack.
		slideCards = cards.filter(function(element){
			if(element.status == type){
				return element;
		
			}
		});
		
		//Check if there are any cards in the stack.
		if(slideCards.length > 0){
			
			//Display the first card added to the stack.
			var currentCard = '<div style="margin-top:0px;" class="Mask active"><img src="'+slideCards[currentSlide].image+'" class="MainPicture"></img><h3 id="mainHead" class="card-heading">'+slideCards[currentSlide].title+'</h3><p id="mainText" class="card-text">'+slideCards[currentSlide].body+'</p></div>'
			$(".modal-content").append(currentCard);
			
			//If there are more than one card add the next card to the DOM but hidden outside the window.
			if(slideCards[currentSlide+1]){
				var nextCard = '<div style="margin-top:0px;" class="Mask next"><img src="'+slideCards[currentSlide+1].image+'" class="MainPicture"></img><h3 id="mainHead" class="card-heading">'+slideCards[currentSlide+1].title+'</h3><p id="mainText" class="card-text">'+slideCards[currentSlide+1].body+'</p></div>'
				$(".modal-content").append(nextCard);
			}
			
			//Hide next button if only one card is in the stack.
			if(slideCards.length == 1){
				$("#nextImg").hide();
			}
			
			else if(!$("#nextImg").is(":visible")){
				$("#nextImg").show();
			}
			
		}
		//Display message if no cards are added.
		else{
		
			$("#nextImg").hide();
			
			$(".modal-content").append("<div class='error Heading-2' style='margin: 0 auto'>No " + type + "s</div>");
		}
	});
	
	//Get JSON from the API and fill in the elements in the DOM (I've assumed we will always have at least 3 cards initially)
	$.getJSON( "https://hyper-swipe.herokuapp.com/cards", function( resp ) {
		cards = resp;
		$(".MainPicture").attr("src",cards[0].image);
		
		$(".SecondPicture").attr("src",cards[1].image);
		
		$(".ThirdPicture").attr("src",cards[2].image);
		
		$("#mainHead").text(cards[0].title);
		$("#mainText").text(cards[0].body);
		
		$("#secondHead").text(cards[1].title);
		$("#secondText").text(cards[1].body);
		
		$("#thirdHead").text(cards[2].title);
		$("#thirdText").text(cards[2].body);
		
	});
	
	//Click event for the next button on the slider.
	$("#nextImg").on("click", function(){
	
		//Show the previous button if not already visible.
		if(!$("#prevImg").is(":visible")){
			$("#prevImg").show();
		}
	
		currentSlide++;
		
		$(".prev").remove();
		
		//Change around the classe to slide the next card in the stack in.
		$(".active").toggleClass("prev");
		$(".active").toggleClass("active");
		$(".next").toggleClass("active");
		$(".next").toggleClass("next");
		
		//Hide next button if no more cards in the stack.
		if(!slideCards[currentSlide+1]){
			
			$(this).hide();
		}
		//Add the next card in the stack to the DOM.
		else{
			var nextCard = '<div style="margin-top:0px;" class="Mask next"><img src="'+slideCards[currentSlide+1].image+'" class="MainPicture"></img><h3 id="mainHead" class="card-heading">'+slideCards[currentSlide+1].title+'</h3><p id="mainText" class="card-text">'+slideCards[currentSlide+1].body+'</p></div>'
			$(".modal-content").append(nextCard);
		}
	});
	
	//Previous button click event.
	$("#prevImg").on("click", function(){
	
		if(!$("#nextImg").is(":visible")){
			$("#nextImg").show();
		}
	
		currentSlide--;
		
		$(".next").remove();
		
		$(".active").toggleClass("next");
		$(".active").toggleClass("active");
		$(".prev").toggleClass("active");
		$(".prev").toggleClass("prev");
		
		if(!slideCards[currentSlide-1]){
			
			$(this).hide();
		}
		
		else{
		
			var prevCard = '<div style="margin-top:0px;" class="Mask prev"><img src="'+slideCards[currentSlide-1].image+'" class="MainPicture"></img><h3 id="mainHead" class="card-heading">'+slideCards[currentSlide-1].title+'</h3><p id="mainText" class="card-text">'+slideCards[currentSlide-1].body+'</p></div>'
			$(".modal-content").append(prevCard);
			
		}
	});
	
	//Click event to the rest text.
	$('.Reset').on("click", function(){
		$(".droppedCard").each(function(){
			$(this).remove();
		});
		
		cards.forEach(function(element){
			element.status = null;
		});
		//Clear local storage if not on IE or Edge
		if(!isIE && !isEdge){
			localStorage.setItem("hyperswipe", JSON.stringify([]));
		}

		//Add the initial 3 cards to the DOM (Again we assume there are at least 3 cards in the initial stack).
		$(".cards").append('<div class="Mask"><img class="MainPicture"></img><h3 id="mainHead" class="card-heading"></h3><p id="mainText" class="card-text"></p></div>'+
		'<div class="SecondMask"><img class="SecondPicture"></img></img><h3 id="secondHead" class="card-heading"></h3><p id="secondText" class="card-text"></p></div>'+
		'<div class="ThirdMask"><img class="ThirdPicture"></img><h3 id="thirdHead" class="card-heading"></h3><p id="thirdText" class="card-text"></p></div>');
		
		//Reset variables
		currentCard = 0;
		like = 25;
		dislike = 25;
		
		$( ".Mask" ).draggable({ 
			axis: "x",
			containment: "body",
			revert: "invalid",
			scroll:false
		});
		
		$(".MainPicture").attr("src",cards[0].image);
		
		$(".SecondPicture").attr("src",cards[1].image);
		
		$(".ThirdPicture").attr("src",cards[2].image);
		
		$("#mainHead").text(cards[0].title);
		$("#mainText").text(cards[0].body);
		
		$("#secondHead").text(cards[1].title);
		$("#secondText").text(cards[1].body);
		
		$("#thirdHead").text(cards[2].title);
		$("#thirdText").text(cards[2].body);
	});
});