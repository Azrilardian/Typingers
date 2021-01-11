const typeingGame = () => {
	const randomWords = require("random-words");

	const skorDisplay = document.querySelector("#score span");
	const timeDisplay = document.getElementById("time");
	const input = document.querySelector("input");
	const infoDisplay = document.getElementById("review-info");
	const randomWordsDisplay = document.getElementById("random-text");
	const recentDifficulty = document.getElementById("recent");
	const easyScore = document.getElementById("easy-score");
	const medScore = document.getElementById("medium-score");
	const hardScore = document.getElementById("hard-score");
	const btnTryAgain = document.querySelector(".game button");
	let skor = 0;
	let time = 0;
	let stopCountDown;
	let stopGameOver;
	let isFirstPlay = true;

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

	function setUserPreference() {
		let words = "";
		switch (recentDifficulty.innerText) {
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

		const spanEveryWord = () => {
			randomWordsDisplay.innerText = "";
			words.split("").map((char) => {
				const spanChar = document.createElement("span");
				spanChar.innerText = char;
				randomWordsDisplay.appendChild(spanChar);
			});
		};

		timeDisplay.innerText = time;

		spanEveryWord();
	}

	const resetRecentGameData = (resetSkor) => {
		input.value = null;
		input.disabled = false;
		input.focus();
		timeDisplay.innerText = time;
		btnTryAgain.classList.remove("visible");
		if (resetSkor) {
			skor = 0;
			skorDisplay.innerText = skor;
		}
	};

	const difficultySelect = () => {
		const difficultyOptionContainer = document.querySelector(".difficulty-option");
		const difficultyOption = difficultyOptionContainer.querySelectorAll("span");

		difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;

		difficultyOption.forEach((e) => {
			e.addEventListener("click", () => {
				if (e.id !== "recent") {
					[recentDifficulty.innerText, e.innerText] = [e.innerText, recentDifficulty.innerText];
					difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;
					resetRecentGameData(true);
					setUserPreference();
				} else {
					difficultyOption[1].classList.toggle("visible");
					difficultyOption[2].classList.toggle("visible");

					if (difficultyOption[1].classList.contains("visible")) {
						difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight * 3}px`;
					} else {
						difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;
					}
					// syncWithLocalStorage(e.innerText.trim());
				}
			});
		});
	};
	difficultySelect();

	function gameStart() {
		resetRecentGameData(true);
		setUserPreference();
		input.addEventListener("input", () => {
			matchText();
			if (isFirstPlay && input.value.length > 0) {
				stopCountDown = setInterval(countDown, 1000);
				stopGameOver = setInterval(gameOver, 50);
				isFirstPlay = false;
			}
		});
	}
	gameStart();

	const matchText = () => {
		const arrayWords = randomWordsDisplay.querySelectorAll("span");
		const arrayValue = input.value.split("");
		let errorCount = 0;
		let isCorrect = false;

		arrayWords.forEach((char, index) => {
			let character = arrayValue[index];
			const chartacterBelumDiKlik = character == null;
			const characterSame = character == char.textContent;

			if (chartacterBelumDiKlik) {
				char.classList.remove("incorrect");
				char.classList.remove("correct");
				isCorrect = false;
			} else if (characterSame) {
				char.classList.add("correct");
				char.classList.remove("incorrect");
				infoDisplay.classList.add("correct");
				isCorrect = true;
			} else {
				char.classList.remove("correct");
				char.classList.add("incorrect");
				infoDisplay.classList.remove("correct");
				isCorrect = false;
				++errorCount;
			}
		});

		if (isCorrect && !!!errorCount) {
			resetRecentGameData(false);
			setUserPreference();
			skorDisplay.innerText = ++skor;
		}
	};

	function countDown() {
		if (time > 0) time--;
		else if (time === 0) {
			time = "00";
			clearInterval(stopCountDown);
			checkHighScore();
		}
		timeDisplay.innerText = time;
	}

	const gameOver = () => {
		if (time === 0) {
			input.disabled = true;
			btnTryAgain.classList.add("visible");

			btnTryAgain.addEventListener("click", () => {
				isFirstPlay = true;
				gameStart();
			});

			document.addEventListener("keyup", (e) => {
				if (e.keyCode === 13) {
					isFirstPlay = true;
					gameStart();
				}
			});
			clearInterval(stopGameOver);
		}
	};

	const checkHighScore = () => {
		switch (recentDifficulty.innerText) {
			case "EASY":
				if (skor > Number(easyScore.innerText)) {
					easyScore.innerText = skor;
					// syncWithLocalStorage(recentDifficulty.innerText, skor, medScore.innerText, hardScore.innerText);
				}
				break;
			case "MEDIUM":
				if (skor > Number(medScore.innerText)) {
					medScore.innerText = skor;
					// syncWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, skor, hardScore.innerText);
				}
				break;
			case "HARD":
				if (skor > Number(hardScore.innerText)) {
					hardScore.innerText = skor;
					// syncWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, medScore.innerText, skor);
				}
				break;
		}
	};

	const darkModeFeatures = () => {
		const toggle = document.querySelector(".set-theme .darkmode-toggle");
		toggle.addEventListener("click", function () {
			this.classList.toggle("dark-mode-active");
			document.body.classList.toggle("darkmode");
		});
	};
	darkModeFeatures();

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
	// 	recentDifficulty.innerText = data.difficulty;
	// 	const [easyHighScore, medHighScore, hardHighScore] = data.score;
	// 	easyScore.innerText = easyHighScore;
	// 	medScore.innerText = medHighScore;
	// 	hardScore.innerText = hardHighScore;
	// 	syncWithLocalStorage(data.difficulty, easyHighScore, medHighScore, hardHighScore);
	// }
};

export default typeingGame;