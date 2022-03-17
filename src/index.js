import "./style.css";
import pomme from './pomme.jpg'
import son1 from './1.mp3';
import son2 from './2.ogg'
import lost from './gameOver.mp3';


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let speed = 800;
let direction = "e";
const gridElem = 40; //tous seras conderer comme un carre de  20 * 15,5 dans notre jeu
let snake = [ //tableau contenant les positions des diferents carre que compose notre serpent 
    [3, 7],
    [2, 7],
    [1, 7]
];
let apple = [5, 5]; //position initial de notre pomme
let score = 0; //pour noter le score
let bestScore = 0;
if (localStorage.getItem('bestScore')) { //sil ya deja un meilleur score
    bestScore = Number(localStorage.getItem('bestScore'));
}
const image = new Image();
image.src = pomme;
image.onload = () => {
    ctx.drawImage(image, apple[0] * gridElem, apple[1] * gridElem, gridElem, gridElem);

}


const play = document.querySelector("#b1");
const pause = document.querySelector("#b2");
pause.style.backgroundColor = "silver";
pause.style.cursor = "default";

pause.disabled = true;

let audiojeu = new Audio();
audiojeu.src = son1;

let enCour = false;






const drawMap = () => { //on remplir notre canvas de noir
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 800);
};

const drawSnake = () => { //fonction qui dessine un serpent en fonction des different point contnenus dans le tableau snake
    ctx.fillStyle = "green";
    for (let body of snake) {
        ctx.fillRect(body[0] * gridElem, body[1] * gridElem, gridElem, gridElem);
    }
};

const drawApple = () => { //fonction qui dessine la pomme
    // ctx.fillStyle = "red";
    // ctx.fillRect(apple[0] * gridElem, apple[1] * gridElem, gridElem, gridElem);

    ctx.drawImage(image, apple[0] * gridElem, apple[1] * gridElem, gridElem, gridElem);

};

window.addEventListener("keydown", event => { //on ecoute les touche du clavier pour modifier la direction du serpent
    switch (event.key) {
        case "ArrowRight":
            {
                if (direction !== "e" && direction !== "o")
                    direction = "e";
                break;
            }
        case "ArrowLeft":
            {
                if (direction !== "e" && direction !== "o")

                    direction = "o";
                break;
            }
        case "ArrowUp":
            {
                if (direction !== "n" && direction !== "s")

                    direction = "n";
                break;
            }
        case "ArrowDown":
            if (direction !== "n" && direction !== "s") {
                direction = "s";
                break;
            }
        default:
            {}
    }
});

const gameover = () => {
    if ( //on perd si on frolle les bords du canvas
        snake[0][0] > 19 ||
        snake[0][0] < 0 ||
        snake[0][1] > 15.5 ||
        snake[0][1] < 0
    ) {
        return true;
    } else { //on perd si la tete rencontre une partie du corps
        const [head, ...body] = snake;
        for (let bodyElem of body) {
            if (bodyElem[0] === head[0] && bodyElem[1] === head[1]) {
                return true;
            }
        }
    }
    return false;
};
const generateApple = () => { //fonction qui genere automatiquement une position pour la pomme 
    const [x, y] = [
        Math.trunc(Math.random() * 20),
        Math.trunc(Math.random() * 15),
    ];
    for (let body of snake) { //si la position de la pomme coincide avec un point du serpent ,on genere une nouvelle position
        if (body[0] === x && body[1] === y) {
            return generateApple();
        }
    }
    apple = [x, y];
};
const drawScore = () => {
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(`score: ${score}`, gridElem, gridElem);

};
const drawBestScore = () => {
    ctx.fillStyle = "white";
    ctx.font = "bold sans-serif ";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Meilleur score: ${bestScore}`, gridElem, gridElem);

};

const updateSnakePosition = () => { //pour changer de position on cree une nouvelle tete , lajoute au tableau snake puis supp la queue 
    let head;
    switch (direction) {
        //en  fonction de la direction quil veut prendre on cree une nouvelle tete en fonction des coordonnee de l'anciene
        case "e":
            {
                head = [snake[0][0] + 1, snake[0][1]];
                break;
            }
        case "o":
            {
                head = [snake[0][0] - 1, snake[0][1]];
                break;
            }
        case "n":
            {
                head = [snake[0][0], snake[0][1] - 1];
                break;
            }
        case "s":
            {
                head = [snake[0][0], snake[0][1] + 1];
                break;
            }
        default:
            {}
    }
    snake.unshift(head); //on ajoute la nouvelle tete 
    if (head[0] === apple[0] && head[1] === apple[1]) { // Collision du serpent avec la pomme ;
        // Générer une nouvelle pomme :
        eatPomme();
        score++;
        generateApple();
        drawApple();
    } else {
        snake.pop(); //on ne supprime la queue que si on ne rencontre pas la pomme , cest ca qui permet d'ogmenter la taille du serpent 
    }
    return gameover();
};
const music = (etat) => {

    if (etat == "play")
        audiojeu.play();
    else audiojeu.pause();
}
const eatPomme = () => {
    const audio = new Audio();
    audio.src = son2;
    audio.play();
}
const gameOverMusic = () => {
    const audio = new Audio();
    audio.src = lost;
    audio.play();
    play.disabled = false;
    pause.style.backgroundColor = "silver";
    play.style.backgroundColor = "green";
    play.style.cursor = "pointer";
    pause.style.cursor = "default";
    audiojeu = new Audio();
    audiojeu.src = son1;

}

const move = () => {

    if (!updateSnakePosition()) { //si tu na pas perdu
        drawMap();
        drawSnake();
        drawApple();
        drawScore();
        drawBestScore()
        if (enCour)
            setTimeout(() => {
                requestAnimationFrame(move);
            }, 1000 - speed);
    } else {
        music("pause");
        gameOverMusic();
        if (score > bestScore) //si on fait un meilleur score qu'avant
            localStorage.setItem('bestScore', `${score}`);
        snake = [
            [3, 7],
            [2, 7],
            [1, 7]
        ];
        apple = [5, 5];

        score = 0;
        init();

    }
};

play.addEventListener("click", () => {
    music("play");
    play.disabled = true;
    play.style.backgroundColor = "silver";
    pause.style.backgroundColor = "red";
    play.style.cursor = "default";
    pause.style.cursor = "pointer";
    pause.disabled = false;
    enCour = true;
    requestAnimationFrame(move);

})
pause.addEventListener("click", () => {

    enCour = false;
    music("stop");
    play.disabled = false;
    pause.style.backgroundColor = "silver";
    play.style.backgroundColor = "green";
    play.style.cursor = "pointer";
    pause.style.cursor = "default";
})

const init = () => {

    drawMap();
    drawSnake();
    drawApple();
    drawScore();
    drawBestScore()
}
init();