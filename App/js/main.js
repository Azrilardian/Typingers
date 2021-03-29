const typeingGame = () => {
	const randomWords = require("random-words");
	const skorDisplay = document.querySelector("#score span");
	const timeDisplay = document.getElementById("time");
	const infoDisplay = document.getElementById("review-info");
	const input = document.querySelector("input");
	const randomWordsDisplay = document.getElementById("random-text");
	const recentDifficulty = document.getElementById("recent");
	const easyScore = document.getElementById("easy-score");
	const medScore = document.getElementById("medium-score");
	const hardScore = document.getElementById("hard-score");
	const difficultyOptionContainer = document.querySelector(".difficulty-option");
	const difficultyOption = difficultyOptionContainer.querySelectorAll(".opt-diff");
	const statisticSection = document.querySelector(".statistic");
	const overlay = document.querySelector(".overlay");
	const toggle = document.querySelector(".set-theme .darkmode-toggle");
	let skor = 0;
	let time = 0;
	let difficultyTime = 0;
	let totalTime = 0;
	let countDownInterval;
	let timesUpInterval;
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

	/*
	======================================================================================================
	==========       STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN LOCAL STORAGE       =================== 
	======================================================================================================
	*/

	const TYPEING_DATA = "TYPEING DATA";
	const TYPEING_THEME = "TYPEING THEME";
	let typeing = {};
	let theme = {};

	const syncDataWithLocalStorage = (difficulty = "EASY", easyHighScore = "0", medHighScore = "0", hardHighScore = "0") => {
		typeing.score = [easyHighScore, medHighScore, hardHighScore];
		typeing.difficulty = difficulty;
		localStorage.setItem(TYPEING_DATA, JSON.stringify(typeing));
	};

	const dataFromTypeing = localStorage.getItem(TYPEING_DATA);
	if (dataFromTypeing) {
		const data = JSON.parse(dataFromTypeing);
		recentDifficulty.innerText = data.difficulty;
		const [easyHighScore, medHighScore, hardHighScore] = data.score;
		easyScore.innerText = easyHighScore;
		medScore.innerText = medHighScore;
		hardScore.innerText = hardHighScore;

		// Change manual difficulty so as not to double
		if (recentDifficulty.innerText == "MEDIUM") difficultyOption[1].innerText = "EASY";
		if (recentDifficulty.innerText == "HARD") difficultyOption[2].innerText = "EASY";

		syncDataWithLocalStorage(data.difficulty, easyHighScore, medHighScore, hardHighScore);
	}

	const syncThemeWithLocalStorage = (darkmode = false) => {
		theme.darkMode = darkmode;
		localStorage.setItem(TYPEING_THEME, JSON.stringify(theme));
	};

	const dataFromTheme = localStorage.getItem(TYPEING_THEME);
	if (dataFromTheme) {
		const data = JSON.parse(dataFromTheme);
		if (data.darkMode) {
			toggle.classList.add("dark-mode-active");
			document.body.classList.add("darkmode");
		}
	}

	/*
	======================================================================================================
	==========    AKHIR STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN LOCAL STORAGE    =================== 
	======================================================================================================
	*/

	function initializeGame() {
		totallyResetRecentGame();
		setUserPreference();
		input.addEventListener("input", () => {
			matchText();
			if (isFirstPlay && input.value.length > 0) {
				countDownInterval = setInterval(() => (timeDisplay.innerText = --time), 1000);
				timesUpInterval = setInterval(timesUp, 50);
				isFirstPlay = false;
			}
		});
	}
	initializeGame();

	function totallyResetRecentGame() {
		resetinputAndTime();
		skor = 0;
		skorDisplay.innerText = skor;
		errorTypedCount = 0;
		difficultyTime = 0;
		totalTime = 0;
		totalTyped = 0;
	}

	function resetinputAndTime() {
		input.value = null;
		input.disabled = false;
		input.focus();
		timeDisplay.innerText = time;
	}

	function setUserPreference() {
		let words = "";
		switch (recentDifficulty.innerText) {
			case "EASY":
				time = difficultyLevel.easy.time;
				difficultyTime = difficultyLevel.easy.time;
				words = randomWords({
					exactly: 20,
					join: " ",
					maxLength: 5,
				});
				break;
			case "MEDIUM":
				time = difficultyLevel.medium.time;
				difficultyTime = difficultyLevel.medium.time;
				words = randomWords({
					exactly: 20,
					join: " ",
					maxLength: 7,
				});
				break;
			case "HARD":
				time = difficultyLevel.hard.time;
				difficultyTime = difficultyLevel.hard.time;
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
		infoDisplay.classList.add("correct");
		spanEveryWord();
	}

	function matchText() {
		const words = randomWordsDisplay.querySelectorAll("span");
		const value = input.value.split("");
		let isAallWordTyped = false;

		words.forEach((word, index) => {
			let character = value[index];
			const characterUnclick = character == null;
			const characterSame = character == word.textContent;

			if (characterUnclick) {
				word.classList.remove("incorrect");
				word.classList.remove("correct");
				isAallWordTyped = false;
			} else if (characterSame) {
				word.classList.add("correct");
				word.classList.remove("incorrect");
				infoDisplay.classList.add("correct");
				isAallWordTyped = true;
			} else {
				word.classList.remove("correct");
				word.classList.add("incorrect");
				infoDisplay.classList.remove("correct");
				isAallWordTyped = false;
			}
		});

		if (isAallWordTyped) {
			totalTime += difficultyTime - time;
			checkTotalErrorWord();
			checkTotalTyped();
			resetinputAndTime();
			setUserPreference();
			skorDisplay.innerText = ++skor;
		}
	}

	const checkTotalErrorWord = () => {
		const words = randomWordsDisplay.querySelectorAll("span");
		words.forEach((word) => {
			if (word.classList.contains("incorrect")) ++errorTypedCount;
		});
	};

	const checkTotalTyped = () => {
		const words = randomWordsDisplay.querySelectorAll("span");
		words.forEach((word) => {
			if (word.classList.contains("correct") || word.classList.contains("incorrect")) ++totalTyped;
		});
	};

	function timesUp() {
		if (time === 0) {
			time = "00";
			clearInterval(countDownInterval);
			clearInterval(timesUpInterval);
			totalTime += difficultyTime;
			checkTotalErrorWord();
			checkTotalTyped();
			showTimesUpSection();
			checkHighScore();
			isTryAgain();
		}
		timeDisplay.textContent = time;
	}

	const showTimesUpSection = () => {
		const totalScoreDisplay = document.getElementById("total-score");
		const totalTimeDisplay = document.getElementById("total-time");
		const totalError = document.getElementById("total-error");
		const wpmScore = document.getElementById("wpm-score");
		const secondInMinutes = 60;
		let minutes = Math.floor(totalTime / 60);
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
			return totalTime < secondInMinutes ? `00 M ${totalTime} S` : `${minutes} M : ${seconds} S`;
		};

		const calculateWPM = () => {
			const grossWPM = totalTyped / 5;
			const grossWPMDivTotalError = grossWPM - errorTypedCount;
			let WPM;
			if (minutes === 0) WPM = grossWPMDivTotalError;
			else {
				WPM = grossWPMDivTotalError - minutes;
			}
			return parseInt(WPM);
		};

		input.disabled = true;
		overlay.classList.add("active");
		statisticSection.classList.add("show");
		giveRandomNumbersAnimation([totalScoreDisplay, totalTimeDisplay, totalError, wpmScore]);
		showingResult();
	};

	const checkHighScore = () => {
		const easyHighScore = +easyScore.innerText;
		const medHighScore = +medScore.innerText;
		const hardHighScore = +hardScore.innerText;

		const newHighScore = (whatScore) => (whatScore.innerText = skor);

		switch (recentDifficulty.innerText) {
			case "EASY":
				if (skor > easyHighScore) {
					newHighScore(easyScore);
					syncDataWithLocalStorage(recentDifficulty.innerText, skor, medScore.innerText, hardScore.innerText);
				}
				break;
			case "MEDIUM":
				if (skor > medHighScore) {
					newHighScore(medScore);
					syncDataWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, skor, hardScore.innerText);
				}
				break;
			case "HARD":
				if (skor > hardHighScore) {
					newHighScore(hardScore);
					syncDataWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, medScore.innerText, skor);
				}
				break;
		}
	};

	const isTryAgain = () => {
		const reloadBtn = document.getElementById("reload-icon");

		reloadBtn.addEventListener("click", () => {
			hideTimesUpSection();
			initializeGame();
			isFirstPlay = true;
		});

		document.addEventListener("keyup", (e) => {
			if (e.keyCode === 13) {
				hideTimesUpSection();
				initializeGame();
				isFirstPlay = true;
			}
		});
	};

	const hideTimesUpSection = () => {
		overlay.classList.remove("active");
		statisticSection.classList.remove("show");
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

		setHeightOptionContainer(difficultyOption[2]);

		difficultyOptionContainer.addEventListener("click", () => {
			difficultyOption.forEach((e) => e.classList.toggle("visible"));
			setHeightOptionContainer(difficultyOption[2]);
		});

		difficultyOption.forEach((option) => {
			option.addEventListener("click", () => {
				difficultyOption[0].id = "recent";
				if (option.id == "recent") return;
				[recentDifficulty.innerText, option.innerText] = [option.innerText, recentDifficulty.innerText];
				totallyResetRecentGame();
				setUserPreference();
				syncDataWithLocalStorage(recentDifficulty.innerText);
			});
		});
	};
	difficultySelect();

	const darkModeFeatures = () => {
		toggle.addEventListener("click", function () {
			this.classList.toggle("dark-mode-active");
			document.body.classList.toggle("darkmode");
			syncThemeWithLocalStorage(document.body.classList.contains("darkmode"));
		});
	};
	darkModeFeatures();
};

export default typeingGame;
