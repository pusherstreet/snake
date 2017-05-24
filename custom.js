var container = document.getElementById('container');

// global
const UP = 38; const RIGHT = 39; const DOWN = 40; const LEFT = 37; const SPACE = 32;
const SPEED = 250;
const sound = document.getElementById('sound');
const score = document.getElementById('score');

var directions ={
    up : {x: 0, y: -20},
    right : {x: 20, y: 0},
    down: {x: 0, y: 20},
    left: {x: -20, y: 0}
};
var bounds = {
    x: parseInt(container.style.width),
    y: parseInt(container.style.height)
}
var apple;
var flag = false;



// test snake

var snake = new Snake({x: 200, y: 200}, 3);
score.innerText = snake.getLength();
start();

document.onkeydown = function(e){
    if(!flag){return;}    
    switch(e.keyCode){
        case UP:
        if(snake.direction !== directions.down)
        {
            snake.direction = directions.up;
            flag = false;
        }
        
        break;
        case RIGHT:
        if(snake.direction !== directions.left)
        {
            snake.direction = directions.right;
            flag = false;
        }
        
        break;
        case DOWN:
        if(snake.direction !== directions.up)
        {
            snake.direction = directions.down;
            flag = false;
        }       
        break;
        case LEFT:
        if(snake.direction !== directions.right)
        {
            snake.direction = directions.left;
            flag = false;
        }
        
        break;
    }
};


// constructors and help functions
function update(){
    // game logic
    flag = true;
    checkFood();
    snake.move();
    checkBounds();
   
}

function checkFood()
{
    if(apple.x === snake.x && apple.y === snake.y)
    {
        snake.eat(apple);
        apple = generateApple();
    }
}


function checkBounds()
{
    
    if(snake.x < 0)
    {
        snake.x = bounds.x-20;
    }
    else if(snake.x + 20 > bounds.x)
    {
        snake.x = 0;
    }
    else if(snake.y < 0)
    {
        snake.y = bounds.y - 20;
    }
    else if(snake.y + 20 > bounds.y)
    {
        snake.y = 0;
    }
}

function toPx(n){
    return n.toString() + 'px';
};

var interval;
function start(){
    apple = generateApple();
    interval = setInterval(function(){ update(); }, SPEED);
    
}

function stop(){
    clearInterval(interval);
}

function createHtmlElement(tag, attr, styles){
    element = document.createElement(tag);
    for(var p in attr)
    {
        element.setAttribute(p, attr[p]);
    }
    for(var s in styles)
    {
        element.style[s] = styles[s] ;
    }
    return element;
};

function generateApple(){
    var randomPos;
    do
    {
        randomPos = {
        x: Math.floor(Math.random() * (bounds.x - 20)/20) * 20,
        y: Math.floor(Math.random() * (bounds.y - 20)/20) * 20
        };
    }
    while(snake.points.some(function(el){return el.x == randomPos.x && el.y == randomPos.y}))
    var point = new Point(randomPos.x, randomPos.y);
    point.element.style['background-color'] = 'green'

    return point;
}

// point constructor
function Point(x, y){
    this.element = createHtmlElement('div', {class: 'point'}, {top: toPx(y), left: toPx(x)});
    container.appendChild(element);

    Object.defineProperty(this, 'x', {
        get: function(){
            return parseInt(this.element.style.left);
        },
        set: function(value){
            this.element.style.left = toPx(value);
        }
    });
    Object.defineProperty(this, 'y', {
        get: function(){
            return parseInt(this.element.style.top);
        },
        set: function(value){
            this.element.style.top = toPx(value);
        }
    });
};

Point.prototype.setPosition = function(vector){
        this.x = vector.x;
        this.y = vector.y;
    }
Point.prototype.remove = function(){
        container.removeChild(this.element)
    }


function Snake(start, count){
    if(count < 1)
    {
        count = 3;
    }
    this.points = [new Point(start.x, start.y)];
    this.points[0].element.style['background-color'] = 'red';
    for(var i = 1; i < count; i++)
    {
        this.points.push(new Point(start.x + i * 20, start.y))
    }

    Object.defineProperty(this, 'x', {
        get: function(){
            return this.points[0].x;
        },
        set: function(value){
            this.points[0].x = value;
        }
    });
    Object.defineProperty(this, 'y', {
       get: function(){
            return this.points[0].y;
        },
        set: function(value){
            this.points[0].y = value;
        }
    });

    this.direction = directions.left;

    this.getLength = function(){
        return this.points.length;
    }

    this.isbadMove = function(){
        var head = this.points[0];
        var index = this.points.slice(1).findIndex(function(el){return el.x == head.x && el.y == head.y});
        if(index > 0)
        {
            var deadPoints = this.points.length - index;
            while(deadPoints > 0)
            {
                this.points.pop().remove();
                deadPoints--;
            }
        }
        score.innerText = this.getLength();
    } 
    

    this.move = function(){
        
        for(var i = this.points.length - 1; i > 0; i--)
        {
            this.points[i].setPosition({x: this.points[i - 1].x, y: this.points[i - 1].y});
        }
        this.points[0].x += this.direction.x;
        this.points[0].y += this.direction.y;
        this.isbadMove();
    }

    this.eat = function(apple){
        apple.element.style['background-color'] = 'transparent';
        this.points.push(apple);
        sound.play();
        score.innerText = parseInt(score.innerText) + 1;
    }
}