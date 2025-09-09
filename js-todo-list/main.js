/* Todo List 로직
  1. 유저가 값을 입력하고 + 버튼을 누르면 할일을 추가
  2. delete 버튼을 누르면 할일 삭제
  3. check 버튼을 누르면 할일에 취소선 그어짐
    - check 버튼을 누르는 순간 false or true 변경되야함
    - true면 할일이 끝난것으로 판단하여 취소선 그어짐
    - false면 할일이 끝나지 않은것으로 판단하여 그대로 유지
  4. All, 진행중, 완료 탭 이동 되어야 함(언더바 스타일이 이동되어야함)
  5. 완료 탭은 완료된 아이템만 진행중은 진행중인 아이템만 보이도록 필터링 되야함
  6. All은 진행중, 완료 아이템 전부 보여줘야 함
*/

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let taskList = [];
let idCounter = 0; // task 객체 id 고유 번호 생성 변수

addButton.addEventListener("click", addTask);

// 엔터 키로 할일 등록 하는 이벤트
taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    addTask();
  }
});

// 아이템 등록
function addTask() {
  let task = {
    id: IdGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  taskInput.value = ""; // 할 일 등록 후 input 탭 초기화
  console.log(taskList);
  render();
}

// 등록한 아이템 화면에 그려주기
function render() {
  let resultHTML = "";

  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].isComplete === true) {
      resultHTML += `<div class="task task-background">
                  <div class="task-done">${taskList[i].taskContent}</div>
                  <div>
                    <button class="back-button" onclick="toggleComplete('${taskList[i].id}')">
                      <i class="fa-solid fa-arrow-rotate-left fa-lg"></i>
                    </button>
                    <button class="delete-button" onclick="deleteTask('${taskList[i].id}')">
                      <i class="fa-solid fa-trash-can fa-lg" style="color: #ed0202;"></i>
                    </button>
                  </div>
                </div>`;
    } else {
      resultHTML += `<div class="task">
                  <div>${taskList[i].taskContent}</div>
                  <div>
                    <button class="done-button" onclick="toggleComplete('${taskList[i].id}')">
                      <i class="fa-solid fa-check fa-lg" style="color: #63E6BE;"></i>
                    </button>
                    <button class="delete-button" onclick="deleteTask('${taskList[i].id}')">
                      <i class="fa-solid fa-trash-can fa-lg" style="color: #ed0202;"></i>
                    </button>
                  </div>
                </div>`;
    }
  }

  document.getElementById("task-board").innerHTML = resultHTML;
}

// 등록된 할 일 아이템 완료 <-> 취소 처리
function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    // false -> true, 할 일 완료 처리
    if (taskList[i].id === id && taskList[i].isComplete === false) {
      taskList[i].isComplete = true;
      break;
    } // true -> false, 완료 취소 처리
    else if (taskList[i].id === id && taskList[i].isComplete === true) {
      taskList[i].isComplete = false;
      break;
    }
  }
  render();
  console.log(taskList);
}

function deleteTask(id) {
  taskList.forEach((item, index) => {
    if (item.id === id) {
      taskList.splice(index, 1);
    }
  });

  render();
  console.log(taskList);
}

// task 객체 id 번호 생성 함수
function IdGenerate() {
  idCounter++;
  return "_" + idCounter;
}
