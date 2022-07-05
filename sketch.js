/**
 * In this example we are tracking how many people are watching the movie with us. 
 * The more people there are, the slower the movie plays. 
 * 
 */

 let dataServer;
 let pubKey = "pub-c-983eb54b-2d92-49d3-81a4-68619c3b2960";
 let subKey = "sub-c-5f7d54fb-893d-4feb-9be1-7ad0b355b34e";
 let secretKey = "sec-c-YjdiNjY1YzUtMjhkMy00ODcyLTkxZWItMmIzY2YyYmJhODFl";
 
 //name used to sort your messages. used like a radio station. can be called anything
 let channelName = "slowMovieDown";
 
 // used to collect the viewers of the movie
 //let viewers = [];
 
 let occupancy = 0;
 
 let who;  // help us track who is here
 let presence; // help up track who is watching
 
 let vid; // variable for video
 //let playing = false; // make sure the video is not playing right away
 
 //let firstClick = false; // the first click sends the message to PubNub
 
 let vidSpeed; // variable to change the video speed
 
 let allowMessage = false;
 
 let you = uuid();
 
 function preload() { // preload our yoyo video
   vid = createVideo("tree.mp4"); 
   vid.pause();
   //you = random(0,100); 
   //console.log(you);
   //you = int(you);
   //console.log(you);
   //you = you.toString();

   vid.position(windowWidth/4,windowHeight/4);
   vid.size(windowWidth/2,windowHeight/2); 
 }
 
 function setup() {
   createCanvas(windowWidth, windowHeight);
   background(255);
 
   // initialize pubnub
   dataServer = new PubNub({
     subscribeKey: subKey,
     publishKey: pubKey,
     uuid: you,
     secretKey: secretKey,
     heartbeatInterval: 0,
   });
 
   //attach callbacks to the pubnub object to handle messages and connections
   dataServer.addListener({ message: readIncoming, presence: whoisconnected });
   dataServer.subscribe({ channels: [channelName],   withPresence: true });
 
   // style content
   background(244, 229, 218);
 
   textAlign(CENTER);
   textSize(20);
 
 
 }
 
 function draw() {
 
 
  if (occupancy < 4) {
 
     text("Wait for someone to sow the seed together", windowWidth/2, windowHeight/5 * 4);
 
     allowMessage = false;
 
  } else {
 
     drawVideo();
     sendTheMessage();
     allowMessage = true;
     changeVideoSpeed();
     //text("Click to plant your seed", windowWidth/2, windowHeight/5 * 4);
 
  }
 
  if (occupancy > 0) {
     text("There are " +  occupancy + " people online", windowWidth/2, windowHeight/8 * 7);
 
  } else {
     //text("There is no one online", windowWidth/2, windowHeight/8 * 7);
 
  }
 
 }
 
 //function mousePressed() {
 
   //if (firstClick == false) { 
     //drawVideo();
     //firstClick = true;
     //sendTheMessage();
     // first click draws the video
  //}
 
 //}
 
 function sendTheMessage() {
   dataServer.publish({
     channel: channelName,
     message: "hello!" // message does not mean anything here, we just need a message. 
   });
 }
 
 
 
 function readIncoming(inMessage) {
 
  if (inMessage.channel == channelName) {
    who = inMessage.publisher;
 
       let newinput = true;
 
       for(let i = 0; i<viewers.length;i++) {
         if(who==viewers[i]) {
           newinput = false;   
         }
       }
       if(newinput) {
         viewers.push(who); // if there is a new viewer, change the video speed
       }
   } 
 
 
 }
 
 function changeVideoSpeed() {
 
   if (occupancy == 4){ // if there is only one viewer than the video is a normal speed 
 
     //vid.pause();
     vid.speed(1);
 
   } else {
 
     vidSpeed = 1 + (occupancy* 0.1) 
     vid.speed(vidSpeed);
 
   }
 
 }
 
 function drawVideo() { // draw the video to play on the canvas. 
 
   background(244, 229, 218);
   vid.size(windowWidth/2, windowHeight/2); 
   vid.position(windowWidth/4,windowHeight/4);
   vid.play();
   if (vid.pause) {
     vid.loop();
     allowMessage = true;

   } else {
    allowMessage = false;

   }
   //vid.loop();
 
 }
 
 function whoisconnected(connectionInfo) {
 
   console.log(connectionInfo);
 
   occupancy = connectionInfo.occupancy;
 
   console.log(occupancy);
 
 }

 function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var userID=uuid();//something like: "ec0c22fa-f909-48da-92cb-db17ecdb91c5" 