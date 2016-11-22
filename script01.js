var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var star_count = 150;
var stars = []; 
for(var i = 0; i < star_count; i++){
        stars[i] = new Star();
}
function Star(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
}
function drawStars(){
        ctx.fillStyle = "white";
        for(var i = 0; i < star_count; i++){      
            ctx.fillRect(stars[i].x, stars[i].y, Math.random()*3, Math.random()*3);
        }
}
var player = new Ship();
player.img.src = "ship1.png";
player.score = 0;
player.HP = 100;
var enemy_count = 5;
var enemy = [];
for(var i = 0; i < enemy_count; i++) {
    enemy[i] = new Ship();
	enemy[i].img.src = "asteroid.png";
	randEnemy(enemy[i]);
}
function randEnemy(obj) {
		obj.width = Math.random()*30+20;
		obj.height = obj.width;
		obj.x = Math.random()*canvas.width;
		obj.y = -canvas.height/2;
		obj.speed = (Math.random()+1)*3;
}	
function Ship() {
    this.img = new Image;
    this.width = 100;
	this.height = 100;
    this.x = canvas.width/2 - this.width/2;   
    this.y = canvas.height- this.height*1.2;
}
function draw(ship) {
    ctx.drawImage(ship.img, ship.x, ship.y,
                  ship.width, ship.height);
}
function drawText() {
	if(player.HP > 0){
        ctx.fillStyle = "white";
        ctx.font = "26px Arial";
        ctx.fillText("HP:" + player.HP, 450, 40);
	    ctx.fillText("SCORE:" + player.score, 300, 40);
        ctx.fill();
	}else {	
	    ctx.fillStyle = "red";
	    ctx.font = "70px Arial";
	    ctx.fillText("Game Over", 120, 240);
		ctx.font = "30px Arial";
		ctx.fillText("Your Score: " + player.score, 220, 288);
        ctx.fill();
	}
}
player.speed = 10;
document.onkeydown = function(event){
    if(event.keyCode == 37) {
        if(player.x > 0) 
            player.x -= player.speed;
    }
    if(event.keyCode == 39) {
        if(player.x+player.width < canvas.width)  
            player.x += player.speed;
    }
}
function collisionDetect(obj1,obj2) {
	var dx = Math.abs(obj1.x - obj2.x);
    var dy = Math.abs(obj1.y - obj2.y);
    if(dx < player.width/2 && dy < obj2.height) {
		if(obj1 == player && player.HP > 0) {
			player.HP -= 10;
			randEnemy(obj2);
		}
    }
}
function update(){
    for(var i = 0; i < star_count; i++) {
        stars[i].y += 5;
     	if(stars[i].y > canvas.height){
            stars[i].y -= canvas.height;
        }
    }
	for(var i = 0; i < enemy_count; i++) {
		collisionDetect(player,enemy[i]);
		enemy[i].y += enemy[i].speed;
		if(enemy[i].y > canvas.height) {
			randEnemy(enemy[i]); 
		}
	}
}
function render() {
	update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
	if(player.HP > 0) draw(player);
	for(var i = 0; i < enemy_count; i++) {
		draw(enemy[i]);
	}
	drawText();
}
setInterval(render, 30);
function addScore() {
	if(player.HP > 0) player.score ++;
}
setInterval(addScore, 1000);