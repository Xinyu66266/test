let dataServer;
let pubKey = "pub-c-40aac7c7-7f6a-4014-abae-03a62134ebaa";
let subKey = "sub-c-f08172a1-736e-47c5-ae3b-26cd288cd19e";
let secretKey = "sec-c-OWRiMTVlMTItNjUyNC00NWUxLTg4MzQtN2EzMDAzYTdiMzgy";

let channelName = "NFCs"; // we don't define this right away!

let you;

let img1;
let img2;
let img3;

let imgPosition = 0;

let myVar = setInterval(myTimer ,1000);


let message; // message we use to send to pubnub

let noParams = false;

var url = new URL(window.location.href);
let NFC1 = url.searchParams.get("NFC1");
let NFC2 = url.searchParams.get("NFC2");

let fetchGeo;


console.log("NFC TAG 1 = " + NFC1);
console.log("NFC TAG 2 = " + NFC2);

if (NFC1 != null) {

  message = NFC1;
} else if (NFC2 != null) {
  message = NFC2;
} else {
  noParams = true;
}

console.log("message = " + message);


function preload() { 

  // logic to create a random UUID
    you = random(0,1000000); 
    console.log(you);
    you = int(you);
    console.log(you);
    you = you.toString();
  
}


function setup() {

    createCanvas(windowWidth, windowHeight);
    img1 = loadImage("white.png");
    //img1 = loadImage("whitetest.png");
    img2 = loadImage("people.png");
    //img2 = loadImage("peopleTest.png");
    img3 = loadImage("blackframe.png");
    background(246, 224, 198);

    dataServer = new PubNub({
      subscribeKey: subKey,
      publishKey: pubKey,
      uuid: you,
      secretKey: secretKey,
      heartbeatInterval: 0,
    });

     // listen for messages coming through the subcription feed on this specific channel. 

    dataServer.subscribe({ channels: [channelName] });
    dataServer.addListener({ message: readIncoming });
   
    textAlign(CENTER);
    textSize(30);
    

   if (NFC1 != null) {
   // do something for nfc1
      background(246, 224, 198);
      textAlign(CENTER);
      textSize(20);
      fill(142, 62, 58);
      text("Hey, sweetie", windowWidth/2, windowHeight/5);
      text("It's necessary to use your phone", windowWidth/2, windowHeight/5*1.5);
      text("to get information and stay in touch with other people", windowWidth/2, windowHeight/5*2);
      fill(206, 152, 86);
      text("But online communication is not an excuse", windowWidth/2, windowHeight/5*2.5);
      text("to avoid the reality of offline social interaction", windowWidth/2, windowHeight/5*3);
      fill(86, 151, 171);
      text("Hope to see you be confident and", windowWidth/2, windowHeight/5*3.5);
      text("get out of your comfort zone", windowWidth/2, windowHeight/5*4);
      sendTheMessage();
      getLocation();
      showPosition();
   // draw something
    } else if (NFC2 != null) {
   // do something for nfc2
      background(246, 224, 198);
      fill(255, 255, 255);
      text("Hey, dear", windowWidth/2, windowHeight/5*1.5);
      text("Be brave", windowWidth/2, windowHeight/5*2);
      text("Go talk to people", windowWidth/2, windowHeight/5*2.5);
      text("You can do it", windowWidth/2, windowHeight/5*3);
      text("｡◕‿◕｡", windowWidth/2, windowHeight/5*3.5);
      sendTheMessage();
   // draw something
    } else {
      fetchMessages();
      textAlign(CENTER);
      textSize(30);
      noStroke();
      fill(255, 255, 255);
      text("I am so lonely", windowWidth*0.75, windowHeight/5*4-100);
      text("But I'm so afraid to meet people face to face", windowWidth*0.75, windowHeight/5*4-50);
      text("I hope no one notices me...", windowWidth*0.75, windowHeight/5*4);
      //text("Online", windowWidth*0.25, windowHeight/2);
      fill(142, 62, 58);
      text("I can easily communicate with people online", windowWidth*0.25, windowHeight/4);
      fill(206, 152, 86);
      text("but,", windowWidth*0.25, windowHeight/4+50);
      fill(86, 151, 171);
      text("Why do I feel more alone?", windowWidth*0.25, windowHeight/4+100);
      //text("Offline", windowWidth*0.75, windowHeight/2);
      noParams = true;
   //no paramters do something else
    }
  

  /*
    if (noParams == false) {
      sendTheMessage();
    } else {
      fetchMessages();
      noStroke();
      fill(255, 0 , 0);
      text("Home (NFC1)", windowWidth*0.25, windowHeight/2);
      fill(0, 0, 255);
      text("School (NFC2)", windowWidth*0.75, windowHeight/2);

    }
    */
}
  
function draw() {

  
}
/*
function mousePressed() {

fetchMessages();


}
*/
function fetchMessages() {

console.log("fetching");

  dataServer.fetchMessages(
    {
        channels: [channelName],
        end: '15343325004275466',
        count: 100
    },
    (status, response) => {
      console.log(status);
   //  console.log(response);
      drawMessages(response.channels.NFCs);
    }
  );
   
}

function drawMessages(messageHistory) {

  console.log("in draw messages");

  console.log(messageHistory);
  
  for (let i = 0; i < messageHistory.length; i++) {

    if (messageHistory[i].message === "Home") {

      image(img2, random(0, windowWidth), random(0, windowHeight), 500, 350);
      //fill(255, 0 , 0);
      //ellipse(random(50, (windowWidth/2) - 50), random(50, windowHeight - 50), 50)

    } else if ((messageHistory[i].message === "School")) {
      
      //fill(0, 0, 255);
      image(img1, random(0+150, windowWidth-250), random(0, windowHeight-250), 500, 350);


      //ellipse(random(50 + windowWidth/2, windowWidth - 50), random(50, windowHeight - 50), 50)

    } 
    
      console.log(messageHistory[i]);
      text(messageHistory[i].message.messageText, windowWidth/2, 100 * (i+1));

  }

}
  // PubNub logic below
function sendTheMessage() {
  // Send Data to the server to draw it in all other canvases
  
  dataServer.publish({
    channel: channelName,
    message: message,
  });

}

function readIncoming(inMessage) {
  console.log(inMessage);
  drawMessages();
}

function myTimer() {
  const d = new Date();
  document.getElementById("demo").innerHTML = d.toLocaleTimeString();
  }



/*function fetchGeo() {
  const message2 = document.querySelector('#message');

  if (!navigator.geolocation) {
  message2.textContent = `Your browser doesn't support Geolocation`;
  message2.classList.add('error');
  return;
}

 const btn = document.querySelector('#show');
    btn.addEventListener('click', function () {
        // get the current position
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    });

}


function onSuccess(position) {
  const {
      latitude,
      longitude
  } = position.coords;
  
  message2.classList.add('success');
  message2.textContent = `Your location: (${latitude},${longitude})`;
}
  
function onError() {
  message2.classList.add('error');
  message2.textContent = `Failed to get your location!`;
}*/

var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    x.innerHTML = navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}