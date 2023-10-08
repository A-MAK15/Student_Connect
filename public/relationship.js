var relationshipsCategory = ["John Doe", "Angela Yu", "Khafu", "Aphiwe Makwelo"];

$(".connect").click(function() {
  getUser();
  var randomRelationshipConnection = relationshipsCategory[Math.floor(Math.random() * relationshipsCategory.length)];
  if(randomRelationshipConnection === "Aphiwe Makwelo"){
    getUserTwo();
  }else{
    //pass
  }

 });

function getUser(){
  var videoTwo = videoTwo = window.document.getElementById("video"),
      url = window.URL || window.webKitURL;

  navigator.getMedia = navigator.getUserMedia || //Url APi in our browser
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia;

  if(navigator.getMedia){
  navigator.getMedia({
    video: true,
    audio: true
  }, function(stream) {
    const mediaStream = new MediaStream(stream);
    videoTwo.srcObject = mediaStream;
    videoTwo.play();
  }, function(error){
    alert("We need acces to your web camera");
  });
}
}


function getUserTwo(){
  var videoTwo = videoTwo = window.document.getElementById("videoTwo"),
      url = window.URL || window.webKitURL;

  navigator.getMedia = navigator.getUserMedia || //Url APi in our browser
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia;

  if(navigator.getMedia){
  navigator.getMedia({
    video: true,
    audio: true
  }, function(stream) {
    const mediaStream = new MediaStream(stream);
    videoTwo.srcObject = mediaStream;
    videoTwo.play();
  }, function(error){
    alert("We need acces to your web camera");
  });
}
}
