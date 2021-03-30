const typeingGame = () => {
	const randomWords = require("random-words");
	const skorDisplay = document.querySelector("#score span");
	const timeDisplay = document.getElementById("time");
	const randomWordsDisplay = document.getElementById("random-text");
	const input = document.querySelector("input");
	const reviewIndicator = document.getElementById("review-indicator");
	const recentDifficulty = document.getElementById("recent");
	const easyScore = document.getElementById("easy-score");
	const medScore = document.getElementById("medium-score");
	const hardScore = document.getElementById("hard-score");
	const difficultyOptionContainer = document.querySelector(".difficulty-option");
	const difficultyOption = difficultyOptionContainer.querySelectorAll(".opt-diff");
	const statisticSection = document.querySelector(".statistic");
	const overlay = document.querySelector(".overlay");
	const toggle = document.querySelector(".set-theme .darkmode-toggle");
	const totalScoreDisplay = document.getElementById("total-score");
	const totalTimeDisplay = document.getElementById("total-time");
	const totalError = document.getElementById("total-error");
	const wpmScore = document.getElementById("wpm-score");
	let words = "";
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

	function inEasyMode() {
		if (recentDifficulty.innerText === "EASY") {
			time = difficultyLevel.easy.time;
			difficultyTime = difficultyLevel.easy.time;
			words = randomWords({
				exactly: 20,
				join: " ",
				maxLength: 5,
			});
		}
	}

	function inMediumMode() {
		if (recentDifficulty.innerText === "MEDIUM") {
			time = difficultyLevel.medium.time;
			difficultyTime = difficultyLevel.medium.time;
			words = randomWords({
				exactly: 20,
				join: " ",
				maxLength: 7,
			});
		}
	}

	function inHardMode() {
		if (recentDifficulty.innerText === "HARD") {
			time = difficultyLevel.hard.time;
			difficultyTime = difficultyLevel.hard.time;
			words = randomWords({
				exactly: 12,
				join: " ",
				maxLength: 10,
			});
		}
	}

	function setUserPreference() {
		inEasyMode();
		inMediumMode();
		inHardMode();

		const spanEveryWord = () => {
			randomWordsDisplay.innerText = "";
			words.split("").map((word) => {
				const span = document.createElement("span");
				span.innerText = word;
				randomWordsDisplay.appendChild(span);
			});
		};

		timeDisplay.innerText = time;
		spanEveryWord();
	}

	function matchText() {
		const words = randomWordsDisplay.querySelectorAll("span");
		const value = input.value.split("");
		let isAallWordTyped = false;

		words.forEach((word, index) => {
			let character = value[index];
			const characterUnclick = character == null;
			const characterCorrect = character == word.textContent;

			if (characterUnclick) {
				word.classList.remove("incorrect");
				word.classList.remove("correct");
				isAallWordTyped = false;
			} else if (characterCorrect) {
				word.classList.add("correct");
				word.classList.remove("incorrect");
				reviewIndicator.classList.add("correct");
				isAallWordTyped = true;
			} else {
				// character incorrect
				word.classList.remove("correct");
				word.classList.add("incorrect");
				reviewIndicator.classList.remove("correct");
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
		const wordsArr = Array.from(words).filter((word) => word.classList.contains("incorrect"));
		errorTypedCount = wordsArr.length;
	};

	const checkTotalTyped = () => {
		const words = randomWordsDisplay.querySelectorAll("span");
		const wordsCorrect = Array.from(words).filter((word) => word.classList.contains("correct")).length;
		const wordsIncorrect = Array.from(words).filter((word) => word.classList.contains("incorrect")).length;
		totalTyped = wordsCorrect + wordsIncorrect;
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
		timeDisplay.innerText = time;
	}

	const showTimesUpSection = () => {
		input.disabled = true;
		overlay.classList.add("active");
		statisticSection.classList.add("show");
		giveRandomNumbersAnimation([totalScoreDisplay, totalTimeDisplay, totalError, wpmScore]);
		showingResult();
	};

	function giveRandomNumbersAnimation(targets) {
		const randomNumbers = setInterval(() => {
			targets.map((target) => (target.innerText = Math.floor(Math.random() * 10)));
		}, 10);
		setTimeout(() => clearInterval(randomNumbers), 1500);
	}

	const showingResult = () => {
		setTimeout(() => {
			totalScoreDisplay.innerText = skor;
			totalTimeDisplay.innerText = calculateTotalTime();
			totalError.innerText = errorTypedCount;
			wpmScore.innerText = calculateWPM();
		}, 1500);
	};

	const calculateTotalTime = () => {
		const minutes = Math.floor(totalTime / 60);
		const seconds = totalTime % 60;
		const secondInMinutes = 60;
		return totalTime < secondInMinutes ? `00 M ${totalTime} S` : `${minutes} M : ${seconds} S`;
	};

	// Kalkulasi WPM kadang kurang tepat, ini masih dalam tahap perbaikan, secepatnya.
	const calculateWPM = () => {
		const minutes = Math.floor(totalTime / 60);
		const grossWPM = totalTyped / 5;
		const grossWPMDivTotalError = grossWPM - errorTypedCount;
		let WPM;
		if (minutes === 0) WPM = grossWPMDivTotalError;
		else {
			WPM = grossWPMDivTotalError - minutes;
		}
		return parseInt(WPM);
	};

	function highScoreInEasyMode(recentScore) {
		if (recentDifficulty.innerText === "EASY") {
			if (skor > recentScore) return (easyScore.innerText = skor);
		}
	}

	function highScoreInMediumMode(recentScore) {
		if (recentDifficulty.innerText === "MEDIUM") {
			if (skor > recentScore) return (medScore.innerText = skor);
		}
	}

	function highScoreInHardMode(recentScore) {
		if (recentDifficulty.innerText === "HARD") {
			if (skor > recentScore) return (hardScore.innerText = skor);
		}
	}

	const checkHighScore = () => {
		const easyHighScore = +easyScore.innerText;
		const medHighScore = +medScore.innerText;
		const hardHighScore = +hardScore.innerText;

		highScoreInEasyMode(easyHighScore);
		highScoreInMediumMode(medHighScore);
		highScoreInHardMode(hardHighScore);
		syncDataWithLocalStorage(recentDifficulty.innerText, easyScore.innerText, medScore.innerText, skor);
	};

	const isTryAgain = () => {
		const reloadBtn = document.getElementById("reload-icon");
		reloadBtn.addEventListener("click", reloadGame);
		document.addEventListener("keyup", (e) => {
			if (e.keyCode === 13) reloadGame();
		});
	};

	function reloadGame() {
		hideTimesUpSection();
		initializeGame();
		isFirstPlay = true;
	}

	const hideTimesUpSection = () => {
		overlay.classList.remove("active");
		statisticSection.classList.remove("show");
	};

	difficultyOptionContainer.addEventListener("click", () => {
		difficultyOption.forEach((option) => option.classList.toggle("visible"));
		setHeightOptionContainer(difficultyOption);
	});

	difficultyOption.forEach((option) => {
		option.addEventListener("click", () => {
			difficultyOption[0].id = "recent"; // agar ketika pilihan mode yang sedang berlangsung di click tidak mereload game
			if (option.id === "recent") return;
			[recentDifficulty.innerText, option.innerText] = [option.innerText, recentDifficulty.innerText];
			initializeGame();
			syncDataWithLocalStorage(recentDifficulty.innerText);
		});
	});

	const setHeightOptionContainer = (option) => {
		const lastOption = option[option.length - 1];
		const allOptionHaveVisibleClass = lastOption.classList.contains("visible");
		if (allOptionHaveVisibleClass) {
			difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight * 3}px`;
		}
		if (!allOptionHaveVisibleClass) {
			difficultyOptionContainer.style.height = `${difficultyOption[0].clientHeight}px`;
		}
	};

	setHeightOptionContainer(difficultyOption);

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
