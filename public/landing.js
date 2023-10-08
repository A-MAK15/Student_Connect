// slide text from left in the upper section
$(document).hover(function() {
  $(".slide-text").animate({
    left: "68px"
  });
});

// text in the white box in the upper section
$(document).hover(function() {
  $(".slide-text-two").css("visibility", "visible");
});

// friendship text moving up in the middle section
$(".friendship-img").hover(function() {
  $(".friendship-text").animate({
    top: "10px"
  });
});

// friendship content becomes visible after hovering
$(".friendship-img").hover(function(){
  $(".friendship-text-two").css("visibility", "visible");
});

//Relationships text moving up in the middle section
$(".romanticRelationships-img").hover(function(){
  $(".romanticRelationships-text").animate({top: "10px"});
});

//friendship content becomes visible after hovering
$(".romanticRelationships-img").hover(function(){
  $(".romanticRelationships-text-two").css("visibility", "visible");
});

//Studentprenureship text moving up in the middle section
$(".businessMarket-img").hover(function(){
  $(".businessMarket-text").animate({top : "10px"});
});

//Studentprenureship content becomes visible after hovering
$(".businessMarket-img").hover(function(){
  $(".businessMarket-text-two").css("visibility", "visible");
});

//Invitation text moving up in the middle section
$(".invitation-img").hover(function(){
  $(".invitation-text").animate({top : "10px"});
});

//Invitation content becomes visible after hovering
$(".invitation-img").hover(function(){
  $(".invitation-text-two").css("visibility", "visible");
});

//RandomChat text moving up in the middle section
$(".randomChat-img").hover(function(){
  $(".randomChat-text").animate({top : "10px"});
});

$(".randomChat-img").hover(function(){
  $(".randomChat-text-two").css("visibility", "visible");
});
