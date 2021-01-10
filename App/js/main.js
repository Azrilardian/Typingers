const typeingGame = () => {
	const randomWords = require("random-words");

	const difficultyLevel = {
		easy: {
			time: 50,
		},
		medium: {
			time: 35,
		},
		hard: {
			time: 20,
		},
	};

	const skorDisplay = document.querySelector("#score span");
	const timeDisplay = document.getElementById("time");
	const input = document.querySelector("input");
	const infoDisplay = document.getElementById("review-info");
	const randomWordsDisplay = document.getElementById("random-text");
	const recentDifficulty = document.getElementById("recent");
	const easyScore = document.getElementById("easy-score");
	const medScore = document.getElementById("medium-score");
	const hardScore = document.getElementById("hard-score");
	let skor = 0;
	let isCorrect = true;
	let time = 0;
	let stopCountDown;
	let stopGameOver;
	let isFirstPlay = true;

	function setUserPreference() {
		let words = "";
		switch (recentDifficulty.textContent) {
			case "EASY":
				time = difficultyLevel.easy.time;
				words = randomWords({
					exactly: 20,
					join: " ",
					maxLength: 5,
				});
				break;
			case "MEDIUM":
				time = difficultyLevel.medium.time;
				words = randomWords({
					exactly: 20,
					join: " ",
					maxLength: 7,
				});
				break;
			case "HARD":
				time = difficultyLevel.hard.time;
				words = randomWords({
					exactly: 15,
					join: " ",
					maxLength: 10,
				});
				break;
		}

		const sliceWordsInToSpan = () => {
			// words.split(" ").map((word) => {
			// 	const spanWord = document.createElement("span");
			// 	spanWord.classList.add("word");
			// 	word.split("").map((char) => {
			// 		const spanChar = document.createElement("span");
			// 		spanChar.innerText = char;
			// 		spanWord.appendChild(spanChar);
			// 	});
			// 	randomWordsDisplay.appendChild(spanWord);
			// });

			randomWordsDisplay.textContent = "";
			words.split("").map((char) => {
				const spanChar = document.createElement("span");
				spanChar.innerText = char;
				randomWordsDisplay.appendChild(spanChar);
			});
		};

		input.value = null;
		input.removeAttribute("disabled");
		input.focus();
		timeDisplay.textContent = time;
		sliceWordsInToSpan();
	}

	const difficultySelect = () => {
		const difficultyOptionContainer = document.querySelector(".difficulty-option");
		const difficultyOption = difficultyOptionContainer.querySelectorAll("span");

		difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;

		difficultyOption.forEach((e) => {
			e.addEventListener("click", () => {
				if (e.id !== "recent") {
					[recentDifficulty.textContent, e.textContent] = [e.textContent, recentDifficulty.textContent];
					difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;
					setUserPreference();
				} else {
					difficultyOption[1].classList.toggle("visible");
					difficultyOption[2].classList.toggle("visible");

					if (difficultyOption[1].classList.contains("visible")) {
						difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight * 3}px`;
					} else {
						difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;
					}
					// syncWithLocalStorage(e.textContent.trim());
				}
			});
		});
	};
	difficultySelect();

	function gameStart() {
		setUserPreference();
		input.addEventListener("input", () => {
			if (isFirstPlay && input.value.length > 0) {
				matchText();
				stopCountDown = setInterval(countDown, 1000);
				stopGameOver = setInterval(gameOver, 50);
				isFirstPlay = false;
			} else {
				matchText();
			}
		});
	}
	gameStart();

	const matchText = () => {
		const arrayWords = randomWordsDisplay.querySelectorAll("span");
		const arrayValue = input.value.split("");

		arrayWords.forEach((char, index) => {
			const character = arrayValue[index];
			if (character == null) {
				char.classList.remove("incorrect");
				isCorrect = false;
			} else if (character === char.innerText) {
				char.classList.add("correct");
				char.classList.remove("incorrect");
				infoDisplay.classList.add("correct");
				isCorrect = true;
			} else {
				char.classList.add("incorrect");
				char.classList.remove("correct");
				infoDisplay.classList.remove("correct");
				isCorrect = false;
			}
		});
		if (isCorrect) {
			skorDisplay.textContent = ++skor;
			setUserPreference();
		}
	};

	function countDown() {
		if (time > 0) time--;
		else if (time === 0) {
			time = "00";
			clearInterval(stopCountDown);
			checkHighScore();
		}
		timeDisplay.textContent = time;
	}

	const gameOver = () => {
		if (time === 0) {
			const btnTryAgain = document.querySelector(".game button");
			input.setAttribute("disabled", "");
			btnTryAgain.classList.add("visible");
			btnTryAgain.addEventListener("click", () => {
				isFirstPlay = true;
				gameStart();
				btnTryAgain.classList.remove("visible");
			});
			document.addEventListener("keyup", (e) => {
				if (e.keyCode === 13) {
					isFirstPlay = true;
					gameStart();
					btnTryAgain.classList.remove("visible");
				}
			});
			clearInterval(stopGameOver);
		}
	};

	const checkHighScore = () => {
		switch (recentDifficulty.textContent) {
			case "EASY":
				if (skor > Number(easyScore.textContent)) {
					easyScore.textContent = skor;
					// syncWithLocalStorage(recentDifficulty.textContent, skor, medScore.textContent, hardScore.textContent);
				}
				break;
			case "MEDIUM":
				if (skor > Number(medScore.textContent)) {
					medScore.textContent = skor;
					// syncWithLocalStorage(recentDifficulty.textContent, easyScore.textContent, skor, hardScore.textContent);
				}
				break;
			case "HARD":
				if (skor > Number(hardScore.textContent)) {
					hardScore.textContent = skor;
					// syncWithLocalStorage(recentDifficulty.textContent, easyScore.textContent, medScore.textContent, skor);
				}
				break;
		}
	};

	const darkModeFitures = () => {
		const toggle = document.querySelector(".set-theme .darkmode-toggle");
		toggle.addEventListener("click", function () {
			this.classList.toggle("dark-mode-active");
			document.body.classList.toggle("darkmode");
		});
	};
	darkModeFitures();

	// const TYPEING_STORAGE = "TYPEING STORAGE";
	// let todos = {};

	// const syncWithLocalStorage = (difficulty = "EASY", easyHighScore = "0", medHighScore = "0", hardHighScore = "0") => {
	// 	todos.score = [easyHighScore, medHighScore, hardHighScore];
	// 	todos.difficulty = difficulty;s
	// 	localStorage.setItem(TYPEING_STORAGE, JSON.stringify(todos));
	// 	return;
	// };

	// const dataFromLocal = localStorage.getItem(TYPEING_STORAGE);
	// if (dataFromLocal) {
	// 	const data = JSON.parse(dataFromLocal);
	// 	recentDifficulty.textContent = data.difficulty;
	// 	const [easyHighScore, medHighScore, hardHighScore] = data.score;
	// 	easyScore.textContent = easyHighScore;
	// 	medScore.textContent = medHighScore;
	// 	hardScore.textContent = hardHighScore;
	// 	syncWithLocalStorage(data.difficulty, easyHighScore, medHighScore, hardHighScore);
	// }
};

export default typeingGame;
