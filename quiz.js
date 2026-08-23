/* 3 opties 
   - Beach traveller
   - City traveller
   - Sport traveller */




const questions = [

    {
        question: "What would your morning look like?",
        answers: [
            {
                text: "Breakfast with a view of the ocean",
                type: "beach"
            },
            {
                text: "Coffee in a city centre",
                type: "city"
            },
            {
                text: "An early hike through nature",
                type: "sport"
            }
        ]
    },

    {
        question: "What would you rather do during the afternoon?",
        answers: [
            {
                text: "Relax on the beach and swim",
                type: "beach"
            },
            {
                text: "Explore shops, museums and streets",
                type: "city"
            },
            {
                text: "Go surfing, cycling or hiking",
                type: "sport"
            }
        ]
    },

    {
        question: "Which instagram picture would you post?",
        answers: [
            {
                text: "A sunset over the sea",
                type: "beach"
            },
            {
                text: "The city at night",
                type: "city"
            },
            {
                text: "A mountain view after a hike",
                type: "sport"
            }
        ]
    },

    {
        question: "What do you want to get out of a vacation?",
        answers: [
            {
                text: "Peace, sunshine and relaxation",
                type: "beach"
            },
            {
                text: "Culture, food and discovering new places",
                type: "city"
            },
            {
                text: "Adventure, movement and exciting activities",
                type: "sport"
            }
        ]
    },

    {
        question: "Choose your ideal travel destination.",
        answers: [
            {
                text: "Bali or the Maldives",
                type: "beach"
            },
            {
                text: "Paris or Tokyo",
                type: "city"
            },
            {
                text: "The Alps or New Zealand",
                type: "sport"
            }
        ]
    },

    {
        question: "How would you describe your perfect vacation?",
        answers: [
            {
                text: "Slow, sunny and relaxing",
                type: "beach"
            },
            {
                text: "Busy, cultural and exciting",
                type: "city"
            },
            {
                text: "Active, adventurous and outdoors",
                type: "sport"
            }
        ]
    }

];


/* 
   Resultaten */

const results = {

    beach: {
        icon: "🏖️",
        title: "You're a Beach Traveller!",
        description:
            "You love sunshine, relaxation and beautiful views. " +
            "Your perfect holiday is all about slowing down, enjoying " +
            "the ocean and taking a break from everyday life.",
        destination: "Bali, Indonesia"
    },

    city: {
        icon: "🏙️",
        title: "You're a City Explorer!",
        description:
            "You love discovering new cultures, trying different foods " +
            "and exploring busy streets. You want every day of your trip " +
            "to bring something new.",
        destination: "Tokyo, Japan"
    },

    sport: {
        icon: "🥾",
        title: "You're an Adventure Traveller!",
        description:
            "Sitting still isn't really your thing. You want to explore, " +
            "move and experience the outdoors. Hiking, cycling, surfing " +
            "and adventure are right up your street.",
        destination: "Interlaken, Switzerland"
    }

};



let currentQuestion = 0;

let scores = {
    beach: 0,
    city: 0,
    sport: 0
};

let selectedAnswer = null;



const questionNumber =
    document.getElementById("questionNumber");

const questionTotal =
    document.getElementById("questionTotal");

const progressBar =
    document.getElementById("progressBar");

const questionText =
    document.getElementById("questionText");

const answersContainer =
    document.getElementById("answers");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const quizCard =
    document.getElementById("quizCard");

const quizResult =
    document.getElementById("quizResult");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const resultDestination =
    document.getElementById("resultDestination");

const restartButton =
    document.getElementById("restartButton");




function showQuestion() {

    const question = questions[currentQuestion];

    selectedAnswer = null;

    questionNumber.textContent =
        `Question ${currentQuestion + 1}`;

    questionTotal.textContent =
        `of ${questions.length}`;

    questionText.textContent =
        question.question;

    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    answersContainer.innerHTML = "";

    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "answer-button";

        button.innerHTML = `
            <span class="answer-number">
                ${String.fromCharCode(65 + index)}
            </span>

            <span class="answer-text">
                ${answer.text}
            </span>

            <span class="answer-arrow">
                →
            </span>
        `;

        button.addEventListener("click", () => {

            selectAnswer(button, answer.type);

        });

        answersContainer.appendChild(button);

    });

    previousButton.disabled =
        currentQuestion === 0;

    nextButton.disabled = true;

    animateQuestion();

}


/* select */

function selectAnswer(button, type) {

    const buttons =
        document.querySelectorAll(".answer-button");

    buttons.forEach(item => {
        item.classList.remove("selected");
    });

    button.classList.add("selected");

    selectedAnswer = type;

    nextButton.disabled = false;

}


/* next */

nextButton.addEventListener("click", () => {

    if (!selectedAnswer) {
        return;
    }

    scores[selectedAnswer]++;

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    } else {

        showResult();

    }

});


/* go back*/

previousButton.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});


/* calc */

function calculateResult() {

    let highestScore = 0;

    let winner = "beach";

    for (const type in scores) {

        if (scores[type] > highestScore) {

            highestScore = scores[type];

            winner = type;

        }

    }

    return winner;

}


/* show result*/

function showResult() {

    const winner =
        calculateResult();

    const result =
        results[winner];

    resultIcon.textContent =
        result.icon;

    resultTitle.textContent =
        result.title;

    resultDescription.textContent =
        result.description;

    resultDestination.textContent =
        result.destination;

    quizCard.style.display = "none";

    quizResult.classList.add("show");

    if (typeof gsap !== "undefined") {

        gsap.fromTo(
            quizResult,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }
        );

    }

}


/* restart */

restartButton.addEventListener("click", () => {

    currentQuestion = 0;

    scores = {
        beach: 0,
        city: 0,
        sport: 0
    };

    quizResult.classList.remove("show");

    quizCard.style.display = "block";

    showQuestion();

    window.scrollTo({
        top: document.getElementById("quiz").offsetTop - 80,
        behavior: "smooth"
    });

});





/* very neccessary */
showQuestion();





document.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();

    const answerButtons =
        document.querySelectorAll(".answer-button");

    if (key === "a" && answerButtons[0]) {
        answerButtons[0].click();
    }

    if (key === "b" && answerButtons[1]) {
        answerButtons[1].click();
    }

    if (key === "c" && answerButtons[2]) {
        answerButtons[2].click();
    }

    if (key === "enter" && !nextButton.disabled) {
        nextButton.click();
    }

});

/* gsap */

function animateQuestion() {

    if (typeof gsap === "undefined") {
        return;
    }

    gsap.fromTo(
        ".quiz-card",
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out"
        }
    );

    gsap.fromTo(
        ".answer-button",
        {
            opacity: 0,
            y: 12
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.08,
            delay: 0.1
        }
    );

}
