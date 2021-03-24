//Create variables here
var dog, happyDog, database, foodS, foodStock,dogImg;
var feed,addFood;
var foodObj,lastFed;
var gameState, currentTime;
var bedroomImg, washroomImg, gardenImg;
function preload()
{
  happyDog=loadImage("images/dogImg1.png");
  dogImg= loadImage("images/dogImg.png");
  milkimg=loadImage("images/Milk.png");
  //load images here
  bedroomImg= loadImage("images2/Bed Room.png");
  washroomImg=loadImage("images2/Wash Room.png");
  gardenImg= loadImage("images2/Garden.png");

}

function setup() {
  createCanvas(600, 600);
  database= firebase.database();

  dog= createSprite(300,400,10,10);
  dog.addImage(dogImg);
  dog.scale= 0.4;
  
  foodStock= database.ref('Food');
  foodStock.on("value",readStock);

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(650,90);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(750,90);
  addFood.mousePressed(addFoods);
//read gamestate from database
readstate= database.ref("gameState");
readstate.on("value",function(data){
  gameState= data.val();
})
//reading the value if feed time from database
fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });


}
//function to update gamestate in database
function update(state){
  database.ref("/").update({
    gameState: state
  })
}

function draw() {  

//changing bg according to time  
 currentTime= hour();
 if(currentTime==(lastFed+1)){
update("playing");
foodObj.garden();
 }
else if(currentTime==(lastFed+2)) {
update("sleeping");
foodObj.bedroom();
}
else if (currentTime>(lastFed+2)&currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}
else{
  update("Hungry")
  foodObj.hungry();
  foodObj.display();

}
  
    if (gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }
    else{
      feed.show();
      addFood.show();
      dog.addImage(dogImg);
    }
  drawSprites();
  
}
 
function readStock(data){
foodS=data.val();
foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  milk=createSprite(130,450,10,10);
  milk.addImage(milkimg);
  milk.scale=0.15;
  foodObj.deductFood();
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}