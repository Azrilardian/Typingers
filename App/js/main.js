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
	const difficultyOptionContainer = document.querySelector(".difficulty-option");
	const difficultyOption = difficultyOptionContainer.querySelectorAll(".opt-diff");
	const section = document.querySelector(".statistic");
	const overlay = document.querySelector(".overlay");
	const toggle = document.querySelector(".set-theme .darkmode-toggle");
	let skor = 0;
	let time = 0;
	let totalTime = 0;
	let stopCountDown;
	let totalTyped = 0;
	let isFirstPlay = true;
	let errorTypedCount = 0;

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
					exactly: 12,
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
		totalTime = time;
		spanEveryWord();
	}

	const resetRecentGameDataWithoutScore = () => {
		input.value = null;
		input.disabled = false;
		input.focus();
		timeDisplay.innerText = time;
	};

	const totallyResetRecentGame = () => {
		resetRecentGameDataWithoutScore();
		skor = 0;
		skorDisplay.innerText = skor;
		errorTypedCount = 0;
		totalTyped = 0;
	};

	const difficultySelect = () => {
		const setHeightOptionContainer = (option) => {
			const allOptionHaveVisibleClass = option.classList.contains("visible");
			if (allOptionHaveVisibleClass) {
				difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight * 3}px`;
			} else {
				difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;
			}
		};

		setHeightOptionContainer(difficultyOption[1]);

		difficultyOptionContainer.addEventListener("click", () => {
			difficultyOption[0].id = "recent";
			difficultyOption.forEach((e) => e.classList.toggle("visible"));
			setHeightOptionContainer(difficultyOption[1]);
		});

		difficultyOption.forEach((option) => {
			option.addEventListener("click", () => {
				difficultyOption[0].id = "recent";
				if (option.id == "recent") return;
				[recentDifficulty.innerText, option.innerText] = [option.innerText, recentDifficulty.innerText];
				syncDataWithLocalStorage(recentDifficulty.innerText);
				totallyResetRecentGame();
			});
		});
	};
	difficultySelect();

	function gameStart() {
		totallyResetRecentGame();
		setUserPreference();
		input.addEventListener("input", () => {
			matchText();
			if (isFirstPlay && input.value.length > 0) {
				stopCountDown = setInterval(countDown, 1000);
				isFirstPlay = false;
			}
		});
		console.log(recentDifficulty.innerText);
	}
	gameStart();

	const checkTotalErrorWord = () => {
		const arrayWords = randomWordsDisplay.querySelectorAll("span");
		arrayWords.forEach((word) => {
			if (word.classList.contains("incorrect")) ++errorTypedCount;
		});
	};

	const matchText = () => {
		const arrayWords = randomWordsDisplay.querySelectorAll("span");
		const arrayValue = input.value.split("");
		let isAallWordTyped = false;

		arrayWords.forEach((char, index) => {
			let character = arrayValue[index];
			const chartacterBelumDiKlik = character == null;
			const characterSame = character == char.textContent;

			if (chartacterBelumDiKlik) {
				char.classList.remove("incorrect");
				char.classList.remove("correct");
				isAallWordTyped = false;
			} else if (characterSame) {
				char.classList.add("correct");
				char.classList.remove("incorrect");
				infoDisplay.classList.add("correct");
				isAallWordTyped = true;
			} else {
				char.classList.remove("correct");
				char.classList.add("incorrect");
				infoDisplay.classList.remove("correct");
				isAallWordTyped = false;
			}
		});

		++totalTyped;

		if (isAallWordTyped) {
			totalTime += time;
			totalTyped += input.value.length;
			checkTotalErrorWord();
			resetRecentGameDataWithoutScore();
			setUserPreference();
			skorDisplay.innerText = ++skor;
		}
	};

	function countDown() {
		if (time > 0) time--;
		else if (time === 0) {
			clearInterval(stopCountDown);
			totalTyped += input.value.length;
			checkTotalErrorWord();
			showTimesUpSection();
			checkHighScore();
			cekUserTryAgain();
		}

		timeDisplay.innerText = time;
	}

	const checkHighScore = () => {
		const recentEasyHighScore = +easyScore.innerText;
		const recentMediumHighScore = +medScore.innerText;
		const recentHardHighScore = +hardScore.innerText;

		const newHighScore = (whatScore) => (whatScore.innerText = skor);

		switch (recentDifficulty.innerText) {
			case "EASY":
				if (skor > recentEasyHighScore) {
					newHighScore(easyScore);
					syncDataWithLocalStorage(recentDifficulty.innerText, skor, medScore.innerText, hardScore.innerText);
				}
				break;
			case "MEDIUM":
				if (skor > recentMediumHighScore) {
					newHighScore(medScore);
					syncDataWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, skor, hardScore.innerText);
				}
				break;
			case "HARD":
				if (skor > recentHardHighScore) {
					newHighScore(hardScore);
					syncDataWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, medScore.innerText, skor);
				}
				break;
		}
	};

	const showTimesUpSection = () => {
		const totalScoreDisplay = document.getElementById("total-score");
		const totalTimeDisplay = document.getElementById("total-time");
		const totalError = document.getElementById("total-error");
		const wpmScore = document.getElementById("wpm-score");
		const minutes = Math.floor(totalTime / 60);
		const seconds = totalTime % 60;

		const giveRandomNumbersAnimation = (target) => {
			const randomNumbers = setInterval(() => {
				target.map((e) => (e.innerText = Math.floor(Math.random() * 10)));
			}, 10);

			setTimeout(() => clearInterval(randomNumbers), 1500);
		};

		const showingResult = () => {
			setTimeout(() => {
				totalScoreDisplay.innerText = skor;
				totalTimeDisplay.innerText = calculateTotalTime();
				totalError.innerText = errorTypedCount;
				wpmScore.innerText = calculateWPM();
			}, 1500);
		};

		const calculateTotalTime = () => {
			if (totalTime < 60) return `00 M ${totalTime} S`;
			return `${minutes} M : ${seconds} S`;
		};

		const calculateWPM = () => {
			const grosWPM = totalTyped / 5;
			return parseInt((grosWPM - errorTypedCount) / minutes);
		};

		input.disabled = true;
		overlay.classList.add("active");
		section.classList.add("show");
		giveRandomNumbersAnimation([totalScoreDisplay, totalTimeDisplay, totalError, wpmScore]);
		showingResult();
	};

	const hideTimesUpSection = () => {
		overlay.classList.remove("active");
		section.classList.remove("show");
	};

	const cekUserTryAgain = () => {
		const reload = document.getElementById("reload-icon");

		reload.addEventListener("click", () => {
			hideTimesUpSection();
			gameStart();
			isFirstPlay = true;
		});

		document.addEventListener("keyup", (e) => {
			if (e.keyCode === 13) {
				hideTimesUpSection();
				gameStart();
				isFirstPlay = true;
			}
		});
	};

	const darkModeFeatures = () => {
		toggle.addEventListener("click", function () {
			this.classList.toggle("dark-mode-active");
			document.body.classList.toggle("darkmode");
			syncThemeWithLocalStorage(document.body.classList.contains("darkmode"));
		});
	};
	darkModeFeatures();

	const TYPEING_DATA = "TYPEING DATA";
	const TYPEING_THEME = "TYPEING THEME";
	let typeing = {};
	let theme = {};

	const syncDataWithLocalStorage = (difficulty = "EASY", easyHighScore = "0", medHighScore = "0", hardHighScore = "0") => {
		typeing.score = [easyHighScore, medHighScore, hardHighScore];
		typeing.difficulty = difficulty;
		localStorage.setItem(TYPEING_DATA, JSON.stringify(typeing));
		setUserPreference();
	};

	const syncThemeWithLocalStorage = (darkmode = false) => {
		theme.darkMode = darkmode;
		localStorage.setItem(TYPEING_THEME, JSON.stringify(theme));
	};

	const dataFromTypeing = localStorage.getItem(TYPEING_DATA);
	if (dataFromTypeing) {
		const data = JSON.parse(dataFromTypeing);
		recentDifficulty.innerText = data.difficulty;
		console.log(recentDifficulty.innerText);
		const [easyHighScore, medHighScore, hardHighScore] = data.score;
		easyScore.innerText = easyHighScore;
		medScore.innerText = medHighScore;
		hardScore.innerText = hardHighScore;
		if (recentDifficulty.innerText == "MEDIUM") difficultyOption[1].innerText = "EASY";
		if (recentDifficulty.innerText == "HARD") difficultyOption[2].innerText = "EASY";
		syncDataWithLocalStorage(data.difficulty, easyHighScore, medHighScore, hardHighScore);
	}

	const dataFromTheme = localStorage.getItem(TYPEING_THEME);
	if (dataFromTheme) {
		const data = JSON.parse(dataFromTheme);
		if (data.darkMode) {
			toggle.classList.add("dark-mode-active");
			document.body.classList.add("darkmode");
		}
	}
};

export default typeingGame;
