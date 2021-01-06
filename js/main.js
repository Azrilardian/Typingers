const typeingGame = () => {
	window.addEventListener("load", gameStart);

	const difficultyLevel = {
		easy: 7,
		medium: 5,
		hard: 3,
	};

	const skorDisplay = document.getElementById("score");
	const timeDisplay = document.getElementById("time");
	const input = document.querySelector("input");
	const infoDisplay = document.getElementById("review-info");
	const randomTextSpan = document.getElementById("random-text");
	const recentDifficulty = document.getElementById("difficulty");
	const easyScore = document.getElementById("easy-score");
	const medScore = document.getElementById("medium-score");
	const hardScore = document.getElementById("hard-score");
	let skor = 0;
	let time;
	let stopCountDown;
	let stopGameOver;
	let isFirstPlay = true;

	function setUserPreference() {
		switch (recentDifficulty.textContent) {
			case "EASY":
				time = difficultyLevel.easy;
				break;
			case "MEDIUM":
				time = difficultyLevel.medium;
				break;
			case "HARD":
				time = difficultyLevel.hard;
				break;
			default:
				time = difficultyLevel.easy;
				break;
		}
		return (timeDisplay.textContent = time);
	}

	const difficultySelect = () => {
		const difficultyOptionContainer = document.querySelector(".difficulty-option");
		const difficultyOption = difficultyOptionContainer.querySelectorAll("span");
		document.addEventListener("click", (e) => {
			if (e.target.id === "difficulty") return difficultyOptionContainer.classList.toggle("is-visible");
			return difficultyOptionContainer.classList.remove("is-visible");
		});
		difficultyOption.forEach((e) =>
			e.addEventListener("click", () => {
				recentDifficulty.textContent = e.textContent;
				setUserPreference();
				input.focus();
				syncWithLocalStorage(recentDifficulty.textContent, easyScore.textContent, medScore.textContent, hardScore.textContent);
			})
		);
	};
	difficultySelect();

	function gameStart() {
		setUserPreference();
		randomText();
		input.addEventListener("input", () => {
			if (isFirstPlay && input.value.length >= 1) {
				input.addEventListener("input", matchText);
				stopCountDown = setInterval(countDown, 1000);
				stopGameOver = setInterval(gameOver, 50);
				isFirstPlay = false;
			}
		});
	}

	const randomText = () => {
		const arrRandomText = ["Hai", "Hallo", "Dirumah", "Stayathome", "Indonesia", "Martabak", "Mengapa", "Kemari"];
		const ranIndex = Math.floor(Math.random() * arrRandomText.length);
		const getRandomTextInArr = arrRandomText[ranIndex];
		randomTextSpan.textContent = getRandomTextInArr;
	};

	const matchText = () => {
		if (startMatch()) {
			skorDisplay.textContent = ++skor;
			setUserPreference();
			randomText();
			input.value = "";
		}
	};

	const startMatch = () => {
		const feedback = (status, statusColor, addingClass) => {
			infoDisplay.textContent = status;
			infoDisplay.style.color = statusColor;
			input.classList.add(addingClass);
			setTimeout(() => input.classList.remove(addingClass), 50);
		};

		if (input.value === randomTextSpan.textContent) {
			feedback("CORRECT!", "#2aeb62", "match");
			return true;
		} else {
			feedback("INCORRECT!", "#fd4848", "not-match");
			return false;
		}
	};

	function countDown() {
		if (time > 0) time--;
		else if (time === 0) {
			isPlaying = false;
			clearInterval(stopCountDown);
			checkHighScore();
		}
		timeDisplay.textContent = time;
	}

	const gameOver = () => {
		if (time === 0) {
			const btnTryAgain = document.querySelector(".game button");
			infoDisplay.textContent = "GAME OVER!";
			infoDisplay.style.color = "#fd4848";
			skorDisplay.textContent = skor;
			input.setAttribute("disabled", "");
			btnTryAgain.style.visibility = "visible";
			btnTryAgain.addEventListener("click", () => {});
			clearInterval(stopGameOver);
		}
	};

	const checkHighScore = () => {
		switch (recentDifficulty.textContent) {
			case "EASY":
				// return skor > Number(easyScore.textContent) ? (easyScore.textContent = skor) : false;
				if (skor > Number(easyScore.textContent)) {
					easyScore.textContent = skor;
					syncWithLocalStorage(recentDifficulty.textContent, skor, medScore.textContent, hardScore.textContent);
				}
				break;
			case "MEDIUM":
				if (skor > Number(medScore.textContent)) {
					medScore.textContent = skor;
					syncWithLocalStorage(recentDifficulty.textContent, easyScore.textContent, skor, hardScore.textContent);
				}
				break;
			case "HARD":
				if (skor > Number(hardScore.textContent)) {
					hardScore.textContent = skor;
					syncWithLocalStorage(recentDifficulty.textContent, easyScore.textContent, medScore.textContent, skor);
				}
				break;
		}
	};

	const TYPEING_STORAGE = "TYPEING STORAGE";
	let todos = {};

	const syncWithLocalStorage = (difficulty = "EASY", easyHighScore = "0", medHighScore = "0", hardHighScore = "0") => {
		todos.score = [easyHighScore, medHighScore, hardHighScore];
		todos.difficulty = difficulty;
		localStorage.setItem(TYPEING_STORAGE, JSON.stringify(todos));
		return;
	};

	const dataFromLocal = localStorage.getItem(TYPEING_STORAGE);
	if (dataFromLocal) {
		const data = JSON.parse(dataFromLocal);
		recentDifficulty.textContent = data.difficulty;
		const [easyHighScore, medHighScore, hardHighScore] = data.score;
		easyScore.textContent = easyHighScore;
		medScore.textContent = medHighScore;
		hardScore.textContent = hardHighScore;
		syncWithLocalStorage(data.difficulty, easyHighScore, medHighScore, hardHighScore);
	}
};

typeingGame();
