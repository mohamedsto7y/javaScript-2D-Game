window.addEventListener("load", function () {
  // canvas setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          this.game.player.shootTop();
        } else if (e.key === "d") {
          this.game.debug = !this.game.debug;
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }
  //7 creat class Projectile
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
      this.image = document.getElementById('projectile');      
    }
    //7 meathod to change the Position of projectle using it's speed attribute
    update() {
      this.x += this.speed;
      // the condation to Deleton the Projectile
      if (this.x > game.width * 0.8) this.markedForDeletion = true;
    }
    //7
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
    }
  }

  class Particle {}

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
      this.speedY = 0;
      this.maxSpeed = 3;
      this.projectiles = [];
      this.image = document.getElementById("player");
      this.powerUp = false;
      this.powerUpTimer = 0;
      this.powerUpLimit = 10000;
    }
    update(deltaTime) {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown"))
        this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      //7 handel projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
      //sprite animation
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      // power up
      if (this.powerUp){
        if (this.powerUpTimer > this.powerUpLimit){
          this.powerUpTimer = 0;
          this.powerUp = false;
          this.frameY = 0;
        } else {
          this.powerUpTimer += deltaTime;
          this.frameY = 1;
          this.game.ammo += 0.1;
        }
      }
    }
    draw(context) {
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
        this.projectiles.forEach(projectile => {
          projectile.draw(context);
        });
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      
    }
    //7 creat method to shoot from mouse
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
      if (this.powerUp) this.shootBottom();
    }
    shootBottom() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 175)
        );
        
      }
    }

    enterPowerUp(){
      this.powerUpTimer = 0;
      this.powerUp = true;
      this.game.ammo = this.game.maxAmmo;
    }
  }

  //Base enemy class lesson 10 m7moud hassan
  class Enemy {
    constructor(
      game //get argument game as object from class Game
    ) {
      this.game = game; //assign game to game to use game in this class after
      this.x = this.game.width; //get width of game (game there is enemy)
      this.speedX = Math.random() * -1.5 - 0.5; //speed game (enemy) in x axis ex: (0.9001*-1.5)=1.35015-5=-1.85015 is negative because enemy move on x axis
      this.markedForDeletation = false;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    }

    //this function use to update place enemy and move it
    update() {
      this.x += this.speedX - this.game.speed; //increase x by speedx to move enemy
      if (this.x + this.width < 0) this.markedForDeletation = true; //check if enemy reach to end screen delete it
      // sprite animation
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else this.frameX = 0;
    }

    //this function use to draw enemy afetr move it (after call update method)
    draw(context) {
      //get context argument as parameter (context instance from convas)

      if (this.game.debug) {
        //draw rectangle in position x,y and width and height only if the debug is true
        context.strokeRect(this.x, this.y, this.width, this.height);
      }
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      context.font = "20px Helvetica"; //
      context.fillText(this.lives, this.x, this.y); //draw text like 5
    }
  }

  //then create types from enemy first angler1
  class Angler1 extends Enemy {
    //Enemy is the parent class and angler1 is child this mean angler contain all
    //properties of class enemy (update and draw and game x speedx ..)
    constructor(game) {
      //get parameter game  and pass it to super class (Enemy)
      super(game); //because Enemy need parameter game then nedd pass game to it
      this.width = 228; //
      this.height = 169;
      this.y = Math.random() * (this.game.height * 0.9 - this.height); //set y axis by random
      this.image = document.getElementById("angler1");
      this.frameY = Math.floor(Math.random() * 3);
      this.lives = 2;
      this.score = this.lives;
    }
  }

    //m7moud hassan
    //then create types from enemy first angler1
    class Angler2 extends Enemy {
      //Enemy is the parent class and angler1 is child this mean angler contain all
      //properties of class enemy (update and draw and game x speedx ..)
      constructor(game) {
        //get parameter game  and pass it to super class (Enemy)
        super(game); //because Enemy need parameter game then nedd pass game to it
        this.width = 213; //
        this.height = 165;
        this.y = Math.random() * (this.game.height * 0.9 - this.height); //set y axis by random
        this.image = document.getElementById("angler2");
        this.frameY = Math.floor(Math.random() * 2);
        this.lives = 3;
        this.score = this.lives;
      }
    }

    //m7moud create luckyfish enemy
    class LuckyFish extends Enemy {
      //Enemy is the parent class and angler1 is child this mean angler contain all
      //properties of class enemy (update and draw and game x speedx ..)
      constructor(game) {
        //get parameter game  and pass it to super class (Enemy)
        super(game); //because Enemy need parameter game then nedd pass game to it
        this.width = 99; //
        this.height = 95;
        this.y = Math.random() * (this.game.height * 0.9 - this.height); //set y axis by random
        this.image = document.getElementById("lucky");
        this.frameY = Math.floor(Math.random() * 2);
        this.lives = 3;
        this.score = 15;
        this.type='lucky';
      }
    }

  class Layer {
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1768;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width, this.y);
    }
  }

  class Background {
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById("layer1");
      this.image2 = document.getElementById("layer2");
      this.image3 = document.getElementById("layer3");
      this.image4 = document.getElementById("layer4");
      this.layer1 = new Layer(this.game, this.image1, 0.2);
      this.layer2 = new Layer(this.game, this.image2, 0.4);
      this.layer3 = new Layer(this.game, this.image3, 1);
      this.layer4 = new Layer(this.game, this.image4, 1.5);
      this.layers = [this.layer1, this.layer2, this.layer3];
    }
    update() {
      this.layers.forEach((Layer) => Layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  }

  class UI {
    //  Drawing game UI   Aya Hassan
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Bangers"; //change font family
      this.color = "white";
    }
    draw(context) {
      // this 5 line to  shadow of projectile
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = "black";
      context.font = this.fontSize + "px" + this.fontFamily;
      //score
      context.fillText("Score: " + this.game.score, 20, 40);
      

      //timer draw
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText("Timer:" + formattedTime, 20, 100);

      // game over messages m7moud hassan
      if (this.game.gameOver) {
        context.textAlign = "center";
        let message1;
        let message2;
        if (this.game.score > this.game.winningScore) {
          message1 = "You Win!";
          message2 = "Well done!";
        } else {
          message1 = "You lose";
          message2 = "Try again next time!";
        }
        context.font = "50px" + this.fontFamily;
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );
        context.font = "25px" + this.fontFamily;
        context.fillText(
          message2,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }
       // ammo
       if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
       for (let i = 0; i < this.game.ammo; i++) {
         context.fillRect(20 + 5 * i, 50, 3, 20);
       }
      context.restore();
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = []; //list of enemies to contain all enemy
      this.enemyTimer = 0;
      this.enemyInterval = 1000; //this tow properties to create every 1s enemy
      this.gameOver = false;
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500; // shoots refill after half a second
      this.score = 0;
      this.winningScore = 10;
      this.gameTime = 0; // time counter
      this.timeLimit = 15000; //time of the game
      this.speed = 1; // game speed
      this.debug = true; //debug state
    }
    update(deltaTime) {
      //game time mang ment
      if (!this.gameOver) this.gameTime += deltaTime;
      if (this.gameTime > this.timeLimit) this.gameOver = true;
      this.background.update();
      this.background.layer4.update();
      //////////complete time mangment
      this.player.update(deltaTime);
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(); // call update method all enmies on window to move them
        if (this.checkCollision(this.player, enemy)) {
          //check here if exists collision between player and enemy
          enemy.markedForDeletation = true; //delete enemy
          if (enemy.type = 'lucky') this.player.enterPowerUp();
          else this.score--;
        }
        this.player.projectiles.forEach((projectile) => {
          //then check for all projectile if collision with enemy to delete it
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true; //delete projectile
            if (enemy.lives <= 0) {
              enemy.markedForDeletation = true; //delete enemy if lives of it equel 0
              if (!this.gameOver) this.score += enemy.score;
              //check score reach to 10
              if (this.score > this.winningScore) this.gameOver = true;
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletation); //filter enemies and get enmies active only
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        //check if timer over or not or game overOrNot
        //if true add enemy to window and rest timer
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        //not  increate timer
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context); // call draw method all enmies on window to draw them  after moving
      });
      this.background.layer4.draw(context);
    }
    //this function to addEnemy to window
    addEnemy() {
      const randomize=Math.random(); //to generate number random
      if(randomize <0.3)  this.enemies.push(new Angler1(this)); //add instance from Angler1 to list enemies
      else if(randomize<0.6 )  this.enemies.push(new Angler2(this));
      else this.enemies.push(new LuckyFish(this)); //add luckyFish
      console.log(this.enemies);
    }
    //m7moud check collision return true or false
    checkCollision(rect1, rect2) {
      //take tow parameter to check collision
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  // Animation loop m7moudn hassan
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //to clear when redraw game
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate); //to start animation
  }
  animate(0);
});
