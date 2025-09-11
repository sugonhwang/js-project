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
  7. 각 탭에서 아이템을 삭제 또는 체크 취소했을 때 바로 적용하도록 구현
  8. 할 일 추가 탭이 공란일 경우 추가 불가
*/

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let taskTabs = document.querySelectorAll(".task-tabs div");
let tabLine = document.getElementById("tab-line");

let taskList = [];
let filterList = []; // 할 일 상태 별 리스트
let idCounter = 0; // task 객체 id 고유 번호 생성 변수
let state = "all";

for (let i = 1; i < taskTabs.length; i++) {
  taskTabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

// + 버튼 클릭 시 할일 아이템 추가
addButton.addEventListener("click", addTask);

// 입력값 변화를 감지하여 버튼상태 업데이트
taskInput.addEventListener("input", updateButtonState);

// 엔터 키로 할일 등록 하는 이벤트
taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    addTask();
  }
});

// 버튼 상태 업데이트(활성화/비활성화)
function updateButtonState() {
  const inputValue = taskInput.value.trim();

  if (inputValue === "") {
    addButton.disabled = true;
    addButton.style.opacity = "0.5";
    addButton.style.cursor = "not-allowed";
  } else {
    addButton.disabled = false;
    addButton.style.opacity = "1";
    addButton.style.cursor = "pointer";
  }
}

// 아이템 등록
function addTask() {
  const inputValue = taskInput.value.trim();

  if (inputValue === "") {
    return;
  }
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
  let list = [];
  if (state === "all") {
    list = taskList;
  } else if (state === "in-progress" || state === "done") {
    list = filterList;
  }

  let resultHTML = "";

  for (let i = 0; i < list.length; i++) {
    const isComplete = list[i].isComplete;
    const taskClass = isComplete ? "task-done" : "";

    // 포스트잇 색상 결정 로직 수정
    let postitColorClass = "";
    if (i % 3 === 0) {
      postitColorClass = "task-red";
    } else if (i % 3 === 1) {
      postitColorClass = "task-yellow";
    } else if (i % 3 === 2) {
      postitColorClass = "task-blue";
    }

    // 완료된 할일은 무조건 회색으로
    const taskBgClass = isComplete ? "task-background" : postitColorClass;

    resultHTML += `<div class="task ${taskBgClass}">
                  <div class="${taskClass}">${list[i].taskContent}</div>
                  <div>
                    ${
                      isComplete
                        ? `<button class="back-button" onclick="toggleComplete('${list[i].id}')">
                           <i class="fa-solid fa-arrow-rotate-left fa-lg"></i>
                         </button>`
                        : `<button class="done-button" onclick="toggleComplete('${list[i].id}')">
                           <i class="fa-solid fa-check fa-lg" style="color: #63E6BE;"></i>
                         </button>`
                    }
                    <button class="delete-button" onclick="deleteTask('${list[i].id}')">
                      <i class="fa-solid fa-trash-can fa-lg" style="color: #ed0202;"></i>
                    </button>
                  </div>
                </div>`;
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
  filter();
}

function deleteTask(id) {
  taskList.forEach((item, index) => {
    if (item.id === id) {
      taskList.splice(index, 1);
    }
  });

  filter();
}

function filter(event) {
  if (event) {
    state = event.target.id;
    tabLine.style.width = event.target.offsetWidth + "px";
    tabLine.style.left = event.target.offsetLeft + "px";
    tabLine.style.top = event.target.offsetTop + (event.target.offsetHeight - 5) + "px";
  }

  filterList = [];
  if (state === "in-progress") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i]);
      }
    }
  } else if (state === "done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete) {
        filterList.push(taskList[i]);
      }
    }
  }
  render();
}

// task 객체 id 번호 생성 함수
function IdGenerate() {
  idCounter++;
  return "_" + idCounter;
}

// 페이지 로드 시 기본 탭(All)에 맞춰 tab-line 위치 세팅
window.onload = function () {
  const defaultTab = document.getElementById("all");
  state = "all";
  tabLine.style.width = defaultTab.offsetWidth + "px";
  tabLine.style.left = defaultTab.offsetLeft + "px";
  tabLine.style.top = defaultTab.offsetTop + (defaultTab.offsetHeight - 5) + "px";
  render();
};

// 화면 크기 바뀔 때 tab-line 위치 재조정
window.addEventListener("resize", () => {
  const activeTab = document.getElementById(state);
  if (activeTab) {
    tabLine.style.width = activeTab.offsetWidth + "px";
    tabLine.style.left = activeTab.offsetLeft + "px";
    tabLine.style.top = activeTab.offsetTop + (activeTab.offsetHeight - 5) + "px";
  }
});
