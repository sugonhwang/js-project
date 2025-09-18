const API_KEY = `f636738a75f345269967e72b6d895e1a`;

let newsList = [];
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);

const menuButton = document.querySelectorAll(".menus button:not(.close-menu)");
const searchInput = document.getElementById("search-input");

// 엔터 입력 시 검색 수행 (조합 중인 한글 입력 처리 방지)
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    getNewsByKeyword();
  }
});

// 메뉴 버튼 클릭 시 카테고리 검색 호출
menuButton.forEach((menu) => menu.addEventListener("click", (event) => getNewsCategory(event)));

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);

    if (response.status === 200) {
      if (data.totalResults === 0) {
        throw new Error("No Result Search your keyword");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error", error.message);
    errRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
  menuButton.forEach((button) => button.classList.remove("active"));
  getNews();
};

const getNewsCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
  setActiveButton(category);
  getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  getNews();
};

const render = () => {
  const newsHTML = newsList.map(
    (news) => `<div class="row news">
          <div class="col-lg-4">
            <img class="news-img-size" src="${news.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}" alt="" />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description === null || news.description === "" ? "내용없음" : news.description.length >= 200 ? news.description.substring(0, 200) + "....." : news.description} 
            </p>
            <div>${news.source.name || "no source"} ${moment(news.publishedAt).fromNow()}
            </div>
          </div>
        </div>`
  );

  document.getElementById("news-board").innerHTML = newsHTML.join("");
};

const errRender = (errorMessage) => {
  const errHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;
  document.getElementById("news-board").innerHTML = errHTML;
};

// Business 버튼에 active 클래스 추가하는 함수
const setActiveButton = (activeCategory) => {
  menuButton.forEach((button) => button.classList.remove("active"));
  menuButton.forEach((button) => {
    if (button.textContent.toLowerCase() === activeCategory.toLowerCase()) {
      button.classList.add("active");
    }
  });
};

// 메뉴(패널) 토글: 모바일에서 햄버거 버튼을 눌러 .menus에 open 클래스를 붙였다 뗌
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu"); // .menus 요소
const closeMenu = document.getElementById("closeMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.add("open");
  });
}
if (closeMenu && navMenu) {
  closeMenu.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
}

// 검색 토글: 모바일에서 돋보기 버튼을 눌러 검색 입력을 열고 닫을 수 있게 함
const searchToggle = document.getElementById("searchToggle");
const searchWrap = document.getElementById("search");
const searchClose = document.getElementById("searchClose") || document.querySelector(".search-close");

if (searchToggle && searchWrap) {
  searchToggle.addEventListener("click", () => {
    // #search에 open 클래스를 토글하면 CSS에서 검색 입력창을 보여주도록 함
    searchWrap.classList.toggle("open");
    // 열렸을 때 입력에 포커스
    if (searchWrap.classList.contains("open")) {
      const inp = document.getElementById("search-input");
      if (inp) inp.focus();
    }
  });
}
if (searchClose && searchWrap) {
  searchClose.addEventListener("click", () => {
    searchWrap.classList.remove("open");
  });
}

// 화면 크기 변경 시(데스크탑으로 돌아갈 때) 열려 있는 패널/검색창 닫기 처리
window.addEventListener("resize", () => {
  try {
    if (window.innerWidth > 1024) {
      if (navMenu) navMenu.classList.remove("open");
      if (searchWrap) searchWrap.classList.remove("open");
    }
  } catch (e) {
    // 무시
  }
});
getLatestNews();
