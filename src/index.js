const menu = document.querySelector(`.section-menu`);
// const NickNameValue = document.getElementById(`input-nickName`);
const cardCountVerticalValue = document.getElementById(`input-cardCountVert`);
const cardCountHorizontValue = document.getElementById(`input-cardCountHor`);
const btnStartGame = document.querySelector(`.section-menu__btn`);

const game = document.querySelector(`.section-game`);
const gameTitle = document.querySelector(`.section-game__title`);
const gameTime = document.querySelector(`.section-game__time`);
const gameCardsLeft = document.querySelector(`.section-game__cards-left`);
const gameCardField = document.querySelector(`.section-game__card-field`);

const gameOver = document.querySelector(`.section-gameover`);
const gameOverTime = document.querySelector(`.section-gameover__time`);
const gameOverCardsLeft = document.querySelector(`.section-gameover__cards-left`);
const btnRepeatGame = document.querySelector(`.section-gameover__button`);


// let NickName;
let cardCountVertical;
let cardCountHorizont;
let timer;
let cardFlipTimer;
let timeLeft;
let foundPairs = [];
let numberCardPairs;
let cardsCount;
let OpenCards = [];
let cards = [];
let cardsList = [];
let widthCard;
let heightCard;

function generatingCardNumbers() {
    for (let i = 1; i <= cardsCount / 2; i++) {
        cards.push({
            cardNumber: i,
            created: false,
        });
        cards.push({
            cardNumber: i,
            created: false,
        });

    }
}

function generatingCards() {

    generatingCardNumbers();

    for (let i = 0; i < cardsCount; i++) {
        let card = document.createElement(`div`);
        card.classList.add(`section-game__card`)

        let cardInner = document.createElement(`div`);
        cardInner.classList.add(`section-game__card_inner`);

        let cardInnerBack = document.createElement(`div`);
        cardInnerBack.classList.add(`section-game__card_inner_back`);

        cardInner.textContent = shufflingCards();

        card.append(cardInner);
        card.append(cardInnerBack);

        card.style.width = widthCard;
        card.style.height = heightCard;

        card.addEventListener(`click`, function () {
            gameController(card, cardInner)
        });

        gameCardField.append(card);
    }
    cardsList = document.querySelectorAll(`.section-game__card`);
}

function checkForCardsFlipping() {
    if (foundPairs.length < 1) {
        cardsList.forEach(element => {
            flippingCard(element);
        });
    } else {
        cardsList.forEach(element => {
            if (foundPairs.indexOf(element.querySelector(`.section-game__card_inner`).textContent) === -1) {
                flippingCard(element);
            }
        });
    }

    OpenCards = [];
}

function flippingCard(card) {
    if (card.classList.contains(`section-game__card_active`)) {
        card.classList.remove(`section-game__card_active`);
        card.classList.add(`section-game__card_not-active`);
    }
}

function registrationFoundCards() {
    if (OpenCards.length === 2 && OpenCards[0] === OpenCards[1]) {
        foundPairs.push(OpenCards[0]);
        gameCardsLeft.textContent = `Пар карточек найдено: ${foundPairs.length}/${numberCardPairs}`;

        if (foundPairs.length === numberCardPairs) {
            finishGame();
        }
    }
}

function timeRendering(timeLeft) {
    let minLeft;
    let secLeft;

    if (timeLeft / 60 < 10 && timeLeft / 60 >= 1) {
        minLeft = `0${Math.floor(timeLeft / 60)}`
    } else if (timeLeft / 60 < 10 && timeLeft / 60 < 1) {
        minLeft = `00`
    } else {
        minLeft = Math.floor(timeLeft / 60)
    }

    if (timeLeft % 60 < 10) {
        secLeft = `0${timeLeft % 60}`
    } else {
        secLeft = timeLeft % 60
    }

    return {
        minLeft,
        secLeft
    }
}

function shufflingCards() {
    while (true) {
        let tempCard = cards[Math.floor(Math.random() * (cards.length - 0) + 0)];
        if (!tempCard.created) {
            tempCard.created = true;
            return tempCard.cardNumber;
        }
    }
}

function checkingSettings() {
    // if (NickNameValue.value) {
    let cardCountVerticaltemp = parseInt(cardCountVerticalValue.value);
    let cardCountHorizonttemp = parseInt(cardCountHorizontValue.value);

    if ((cardCountVerticaltemp && cardCountVerticaltemp % 2 === 0 && cardCountVerticaltemp >= 2 && cardCountVerticaltemp <= 10) &&
        (cardCountHorizonttemp && cardCountHorizonttemp % 2 === 0 && cardCountHorizonttemp >= 2 && cardCountHorizonttemp <= 10)) {

        // NickName = NickNameValue.value;
        cardCountVertical = cardCountVerticaltemp;
        cardCountHorizont = cardCountHorizonttemp;
        startGame();

    } else {
        alert(`Укажите корректное количество карточек`);
    }
    // } else {
    //     alert(`Введите, пожалуйста, никнейм`);
    // }
};

function startGame() {
    cardsList.forEach(element => {
        element.remove();
    });

    foundPairs = [];
    OpenCards = [];
    cards = [];

    menu.classList.add(`off`);
    game.classList.remove(`off`);
    gameOver.classList.add(`off`);

    cardsCount = cardCountVertical * cardCountHorizont;
    numberCardPairs = cardsCount / 2;
    timeLeft = cardsCount * 5;

    // gameTitle.textContent = `Удачи, ${NickName}!`;
    gameTitle.textContent = `Удачной игры!`;

    let timeCounting = timeRendering(timeLeft);
    gameTime.textContent = `Оставшееся время: ${timeCounting.minLeft}:${timeCounting.secLeft}`;

    gameCardsLeft.textContent = `Пар карточек найдено: ${foundPairs.length}/${numberCardPairs}`;

    gameCardField.style.width = cardCountHorizont * 100 + `px`;
    gameCardField.style.height = cardCountVertical * 100 + `px`;

    widthCard = 100 / cardCountHorizont + `%`;
    heightCard = 100 / cardCountVertical + `%`;

    generatingCards();

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;

        let timeCounting = timeRendering(timeLeft)
        gameTime.textContent = `Оставшееся время: ${timeCounting.minLeft}:${timeCounting.secLeft}`;

        if (timeLeft === 0) {
            finishGame();
        }
    }, 1000);
};

function gameController(card, cardInner) {
    if (foundPairs.indexOf(card.querySelector(`.section-game__card_inner`).textContent) === -1 &&
        !card.classList.contains(`section-game__card_active`)) {
        if (OpenCards.length >= 2) {
            checkForCardsFlipping()
        }

        OpenCards.push(cardInner.textContent);

        registrationFoundCards();

        card.classList.remove(`section-game__card_not-active`);
        card.classList.add(`section-game__card_active`);

        clearTimeout(cardFlipTimer);

        cardFlipTimer = setTimeout(() => {
            checkForCardsFlipping()
        }, 2000);
    }
}

function finishGame() {
    if (timeLeft <= 0) {
        gameOverTime.textContent = `Время вышло!`;
    } else {
        gameOverTime.textContent = gameTime.textContent;
    }

    gameOverCardsLeft.textContent = gameCardsLeft.textContent;

    clearInterval(timer)

    menu.classList.add(`off`);
    game.classList.add(`off`);
    gameOver.classList.remove(`off`);
}

document.addEventListener(`DOMContentLoaded`, function () {
    btnStartGame.addEventListener(`click`, function () {
        checkingSettings();
    });

    btnRepeatGame.addEventListener(`click`, function () {
        menu.classList.remove(`off`);
        game.classList.add(`off`);
        gameOver.classList.add(`off`);
    });
});