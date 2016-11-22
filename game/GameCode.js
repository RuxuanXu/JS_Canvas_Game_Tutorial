var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = document.getElementById("background");
var bgctx = background.getContext("2d");

const KEYCODE = {A : 65, Left : 37, Right : 39, Backward : 38, Forward : 40};
 
var Img = {};
Img.player = new Image;
Img.player.src = "ship1.png";
Img.enemy = new Image;
Img.enemy.src = "ship5.png";

var Bgm = new Audio("Palpitations.mp3");
var sound1 = new Audio("scifi002.mp3");
var sound2 = new Audio("Explosion.mp3");
Bgm.volume = 0.5;
sound2.volume = 0.7;
Bgm.play();

function Ship(ImgSrc) {
	this.img = ImgSrc;
	this.size = {x:100, y:100};
	this.x = canvas.width/2-this.size.x/2; 
	this.y = canvas.height/2-this.size.y/2;
	this.angle = 0;
	this.speed = 5;
	this.life = 100;
}
var player = new Ship(Img.player);
player.fire = new Fire(player);
player.score = 0;
var enemy=[];	
var enemy_count=5;
for(var i=0;i<enemy_count;i++){
	enemy[i] = new Ship(Img.enemy);
	enemy[i].life = 100;
	enemy[i].x = player.x+(0.5-Math.random())/Math.abs(0.5-Math.random())*canvas.width;
	enemy[i].y = player.y+(0.5-Math.random())/Math.abs(0.5-Math.random())*canvas.height;
enemy[i].speed = 1;
}

var star_count=150;
var stars = [];
for(var i = 0; i < star_count; i++){
        stars[i]=new star();
}
function star(){
	    this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
}
function bgRender(){
	bgctx.clearRect(0, 0, background.width, background.height);
    for (var i = 0; i < star_count; i++) {
        bgctx.fillStyle = "white";
        bgctx.fillRect(stars[i].x,stars[i].y,Math.random() *3,Math.random() *3);
        if(stars[i].x < 0) stars[i].x += canvas.width;
		if(stars[i].y < 0) stars[i].y += canvas.height;
		if(stars[i].x > canvas.width) stars[i].x -= canvas.width;
		if(stars[i].y > canvas.height) stars[i].y -= canvas.height
	}
}
bgRender();

var playerAtk = new Cannon(player);
function Cannon(player){
	this.trigger = false;
	this.count = 0;
	this.speed = 5;
	this.bullets = [];
    for(var i = 0; i < this.count; i++){ 
        this.bullets[i]=new Bullet();
    }
}
function Bullet(){
	this.x = player.x + player.size.x/2 - player.size.y/2* Math.sin(player.angle*Math.PI/180)+100* Math.sin(player.angle*Math.PI/180);
	this.y = player.y + player.size.y/2 + player.size.x/2* Math.cos(player.angle*Math.PI/180)-100* Math.cos(player.angle*Math.PI/180);
	this.angle = player.angle;
}

function drawAtk(){
	    if(playerAtk.trigger == true){
			playerAtk.count ++;
			playerAtk.bullets[playerAtk.count-1]=new Bullet;
			playerAtk.trigger = false; 
		}
		for(var i = 0; i < playerAtk.count; i++){
			ctx.beginPath();
			ctx.fillStyle = 'hsl(' + 50 * Math.random() + ', 70%, 50%)';
			ctx.arc(playerAtk.bullets[i].x, playerAtk.bullets[i].y, (Math.random()+1)*3, Math.PI*2, false);
			ctx.fill();
			playerAtk.bullets[i].x += playerAtk.speed* Math.sin(playerAtk.bullets[i].angle*Math.PI/180);
			playerAtk.bullets[i].y -= playerAtk.speed* Math.cos(playerAtk.bullets[i].angle*Math.PI/180);
			if(playerAtk.bullets[i].x<0||playerAtk.bullets[i].x>canvas.width||playerAtk.bullets[i].y<0||playerAtk.bullets[i].y>canvas.height)
			{
				playerAtk.count--;
			}
	}
	
}
function collisionDetect(bull,ship){
    var dx = bull.x - ship.x;
    var dy = bull.y - ship.y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    if(distance < 100 && ship.life > 0) {
		if(bull == Bullet) { playerAtk.trigger = false };
        ship.life--;
    }
}

function Fire(ship){
    this.count = 50;
	this.particles = [];
	for(var i = 0; i < this.count; i++){
	        this.particles[i]=new Particle(ship);
    }
}
function Particle(ship){
		this.speed = {x: 5, y: Math.random()*10};
        this.x1 = ship.x+ship.size.x/2-17*Math.cos(ship.angle*Math.PI/180)-ship.size.y/2* Math.sin(ship.angle*Math.PI/180);
		this.y1 = ship.y+ship.size.y/2-17*Math.sin(ship.angle*Math.PI/180)+ship.size.x/2* Math.cos(ship.angle*Math.PI/180);
     	this.x2 = this.x1+34*Math.cos(ship.angle*Math.PI/180);
		this.y2 = this.y1+34*Math.sin(ship.angle*Math.PI/180);

		this.radius = Math.random()*5;
}
function drawFire(ship){
		for(var i = 0; i < ship.fire.count; i++){
			var p = ship.fire.particles[i];
			ctx.beginPath();
			ctx.arc(p.x1, p.y1, p.radius, Math.PI*2, false);
			ctx.arc(p.x2, p.y2, p.radius, Math.PI*2, false);
			ctx.fillStyle = "rgba(255,255,255,0.3)";
			ctx.fill();
			p.radius--;
			p.x1 -= p.speed.x* Math.sin(ship.angle*Math.PI/180);
			p.y1 += p.speed.y* Math.cos(ship.angle*Math.PI/180);
			p.x2 -= p.speed.x* Math.sin(ship.angle*Math.PI/180);
			p.y2 += p.speed.y* Math.cos(ship.angle*Math.PI/180);
			if(p.radius < 0)
			{
				ship.fire.particles[i] = new Particle(ship);
			}
	}
}
var turnR = false;
var turnL = false;
var forw = false;
var backw = false;
function handler() {
	if(turnL==true) player.angle -= 3;
	if(turnR==true) player.angle += 3;
	if(forw==true) {
		for(var i=0;i<enemy_count;i++){	
		   enemy[i].x += player.speed* Math.sin(player.angle*Math.PI/180);
		   enemy[i].y -= player.speed* Math.cos(player.angle*Math.PI/180);
        }
        for(var i = 0; i < star_count; i++){
        stars[i].x += player.speed* Math.sin(player.angle*Math.PI/180);
		stars[i].y -= player.speed* Math.cos(player.angle*Math.PI/180);
        }		
		bgRender();
	}
	if(backw==true) {
	for(var i=0;i<enemy_count;i++){
		enemy[i].x -= player.speed* Math.sin(player.angle*Math.PI/180);
		enemy[i].y += player.speed* Math.cos(player.angle*Math.PI/180);
	}
		for(var i = 0; i < star_count; i++){		
		    stars[i].x -= player.speed* Math.sin(player.angle*Math.PI/180);
		    stars[i].y += player.speed* Math.cos(player.angle*Math.PI/180);
	    }			
		bgRender();
	}

}
document.onkeydown = function(event) {
	
	if(event.keyCode == KEYCODE.A){
		sound1.currentTime = 0;
		playerAtk.trigger = true;
		sound1.play();
	}
	else{
		playerAtk.trigger = false;
	}
	
	if(event.keyCode == KEYCODE.Left||turnL==true) {
		player.angle -= 3;
		turnL=true;
	}
	if(event.keyCode == KEYCODE.Right||turnR==true) {
		player.angle += 3;
		turnR=true;
	}
	if(event.keyCode == KEYCODE.Forward||forw==true) {
		forw=true;	
		for(var i=0;i<enemy_count;i++){	
		   enemy[i].x += player.speed* Math.sin(player.angle*Math.PI/180);
		   enemy[i].y -= player.speed* Math.cos(player.angle*Math.PI/180);
        }
        for(var i = 0; i < star_count; i++){
        stars[i].x += player.speed* Math.sin(player.angle*Math.PI/180);
		stars[i].y -= player.speed* Math.cos(player.angle*Math.PI/180);
        }		
		bgRender();
	}
	if(event.keyCode == KEYCODE.Backward||backw==true) {
		backw=true;
		enemy.x -= player.speed* Math.sin(player.angle*Math.PI/180);
		enemy.y += player.speed* Math.cos(player.angle*Math.PI/180);
        for(var i = 0; i < star_count; i++){		
		    stars[i].x -= player.speed* Math.sin(player.angle*Math.PI/180);
		    stars[i].y += player.speed* Math.cos(player.angle*Math.PI/180);
		}			
		bgRender();
	}
}
document.onkeyup = function(event){
	if(event.keyCode == KEYCODE.Left) {
		turnL=false;
	}
	if(event.keyCode == KEYCODE.Right) {
		turnR=false;
	}
	if(event.keyCode == KEYCODE.Forward){
		forw=false;
	}
	if(event.keyCode == KEYCODE.Backward){
		backw=false;
	}
}

function drawShip(ship) { 
	if(ship.fire) drawFire(ship);
	if(ship != player){
		if(ship.life <= 0){
		  sound2.currentTime = 0;
    	  player.score += 10;
		  player.life += 10;
		  sound2.play();
        	   ship.life = 100;
		       ship.x = player.x+(0.5-Math.random())/Math.abs(0.5-Math.random())*canvas.width;
		       ship.y = player.y+(0.5-Math.random())/Math.abs(0.5-Math.random())*canvas.height;
               ship.speed += 0.5;		
       }
		ship.angle = ((Math.atan2(player.y-ship.y,player.x-ship.x))*180+270)/Math.PI;
	    ship.x += ship.speed* Math.sin(ship.angle*Math.PI/180);
		ship.y -= ship.speed* Math.cos(ship.angle*Math.PI/180);	 
	}
	ctx.save();
	ctx.translate(ship.x+ship.size.x/2,ship.y+ship.size.y/2);
	ctx.rotate(ship.angle*Math.PI/180);
	ctx.translate(-ship.x-ship.size.x/2,-ship.y-ship.size.y/2);
	ctx.drawImage(ship.img,ship.x,ship.y,ship.size.x,ship.size.y);
	ctx.restore();

}
var endBgm = false;
function update() {
	if(Bgm.currentTime>84) Bgm.currentTime=0;
	if(player.life <= 0 && !endBgm) {
		endBgm = true;
		Bgm.currentTime=0;
		Bgm.src = "Sardonicus.mp3";
		Bgm.volume = 0.7;
		Bgm.play();
	}
	for(var i = 0; i < playerAtk.count; i++){
        for(var q=0;q<enemy_count;q++){		 
            collisionDetect(playerAtk.bullets[i],enemy[q]);
	    }
    }
	for(var i=0;i<enemy_count;i++){	
        if(enemy[i].life>0) collisionDetect(enemy[i],player);
    } 
}

function UI() {
    ctx.fillStyle = "red";
    ctx.font = "26px Arial";
    ctx.fillText("LIFE:"+player.life, canvas.width*75/100, canvas.height*10/100);
	ctx.fillText("SCORE:"+player.score, canvas.width*75/100, canvas.height*20/100);
    ctx.fill();
}
function render() {
	update();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(player.life>0){
	    drawShip(player);
	    for(var i=0;i<enemy_count;i++){
			drawShip(enemy[i]);
	    }
        drawAtk();
	    handler();
	}else{
		ctx.fillStyle = "red";
		ctx.font = "70px Arial";
		ctx.fillText("Game Over", canvas.width*20/100, canvas.height*55/100);
        ctx.fill();
	}
	UI();
}
setInterval(render, 30);