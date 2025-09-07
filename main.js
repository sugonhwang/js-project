/* 게임 로직
  1. 랜덤 번호 지정(1~100)
  2. 유저는 번호 입력 -> GO 버튼 클릭
    - 유저가 랜덤 번호를 맞추면 "맞췄습니다" 출력
    - 랜덤 번호 < 유저가 입력한 번호 -> "DOWN" 출력
    - 랜덤 번호 > 유저가 입력한 번호 -> "UP" 출력
    - 랜덤 번호 === 유저가 입력한 번호 -> "Congratulations" 출력
  3. Reset 버튼을 누르면 게임이 리셋됨
  4. 5번의 기회를 다 쓰면 게임이 끝남(GO 버튼 disable)
  5. 1~100 범위를 벗어난 숫자를 입력하면 "1~100 내의 숫자를 입력하세요" 출력 + 기회 깎지 않음
  6. 숫자 중복 입력 방지 -> "이미 입력한 숫자입니다. 다른 숫자를 입력하세요" 출력 + 기회 깎지 않음
*/

let ranNum = 0; // 컴퓨터가 1~100 사이의 임의의 값을 지정
let chances = 3; // 유저가 맞출 수 있는 기회
let gameOver = false; // 게임이 끝났을 때 더이상 게임이 진행되지 않기 위한 변수
let historyArray = []; // 유저가 입력한 숫자를 배열에 저장 -> 중복 방지 구현을 위함

let userInput = document.getElementById("user-input");
let playButton = document.getElementById("play-button");
let resultValue = document.getElementById("result-message");
let restartButton = document.getElementById("restart-button");
let chanceCount = document.getElementById("chance-count");
let inputHistory = document.getElementById("input-history");

playButton.addEventListener("click", play);
restartButton.addEventListener("click", restart);
userInput.addEventListener("focus", () => {
  userInput.value = "";
});

function pickRandomNum() {
  ranNum = Math.floor(Math.random() * 100 + 1);
  console.log(`정답: ${ranNum}`);
}

function play() {
  let userValue = userInput.value;

  // 유효성 검사 1. 범위 밖의 숫자를 입력 여부 검사
  if (userValue < 1 || userValue > 100) {
    resultValue.textContent = "1 ~ 100 사이의 숫자를 입력하세요";
    return;
  }
  // 유효성 검사 2. 숫자 중복 입력 여부 검사
  if (historyArray.includes(userValue)) {
    resultValue.textContent = "이미 입력한 숫자가 있습니다. 다른 숫자를 입력해주세요";
    return;
  }

  chances--;
  chanceCount.textContent = `남은 기회: ${chances}`;

  if (userValue < ranNum) {
    resultValue.textContent = "⬆️ UP!!";
  } else if (userValue > ranNum) {
    resultValue.textContent = "⬇️ DOWN!!";
  } else {
    resultValue.textContent = "🎉 Congratulations!!!";
    gameOver = true;
    playButton.disabled = true;
    return;
  }

  historyArray.push(userValue);
  inputHistory.textContent = "입력한 숫자: " + historyArray.join(", ");
  console.log(historyArray);

  if (chances < 1) {
    gameOver === true;
    resultValue.textContent = "기회를 모두 소진하셨습니다. 다시 게임을 시작해주세요";
  }

  if (gameOver === true) {
    resultValue.textContent = "게임이 종료되었습니다. 다시 게임을 시작해주세요";
    playButton.disabled = true;
  }
}

function restart() {
  userInput.value = ""; // input창 지우기
  pickRandomNum(); // 랜덤 번호 다시 생성
  chances = 3; // 남은 기회 리셋
  chanceCount.textContent = `남은 기회: ${chances}`;
  resultValue.textContent = "♻️ 게임이 재시작 되었습니다.";
  playButton.disabled = false;
  historyArray = []; // 게임 한판이 끝났을 때 다시 배열을 초기화 하여 새롭게 입력받은 숫자들에 한하여 중복 여부 검사
  inputHistory.textContent = "입력한 숫자: ";
  gameOver = false;
}

pickRandomNum();
