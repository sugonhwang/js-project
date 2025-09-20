const API_KEY = `f636738a75f345269967e72b6d895e1a`;

let newsList = [];
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);

// 페이지 네이션 관련 변수
let totalResults = 0; // 뉴스 API로 불러온 뉴스 목록 전체 수
let page = 1; // 현재 페이지
const pageSize = 10; // 한 페이지에 불러올 뉴스 목록 수
const groupSize = 5;

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

// News API 호출 및 에러 처리
const getNews = async () => {
  try {
    url.searchParams.set("page", page); // &page=1
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      if (data.totalResults === 0) {
        throw new Error("No Result Search your keyword");
      }
      newsList = data.articles;
      totalResults = data.totalResults;

      render();
      pagiNationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error", error.message);
    errRender(error.message);
  }
};

// 최신 뉴스 목록 불러오기
const getLatestNews = async () => {
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
  menuButton.forEach((button) => button.classList.remove("active"));
  getNews();
};

// 카테고리 별 뉴스 목록 불러오기
const getNewsCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
  setActiveButton(category);
  page = 1; // 새 카테고리 누르면 첫 페이지부터 시작
  getNews();
};

// 검색한 키워드 관련 뉴스 목록 불러오기
const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}&country=kr&apiKey=${API_KEY}`);
  getNews();
};

// 화면에 뉴스 목록 보여주기
const render = () => {
  const newsHTML = newsList.map(
    (news) => `<a class="news-card-link target="_blank" href="${news.url}">
    <div class="row news">
          <div class="col-lg-4">
            <img class="news-img-size" src="${news.urlToImage && news.urlToImage.trim() !== "" ? news.urlToImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}" alt="${news.title || "뉴스 이미지 없음"}" />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description === null || news.description === "" ? "내용없음" : news.description.length >= 200 ? news.description.substring(0, 200) + "....." : news.description} 
            </p>
            <div>${news.source.name || "no source"} ${moment(news.publishedAt).fromNow()}</div>
          </div>
        </div>
        </a>`
  );

  document.getElementById("news-board").innerHTML = newsHTML.join("");
};

// 에러 메세지 출력
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

// 반응형 디자인 고려한 페이지 네이션
const pagiNationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize); // 전체 페이지 수
  const isMobile = window.innerWidth <= 768;

  if (totalPages <= 1) return;

  let paginationHTML = "";

  if (isMobile) {
    if (page > 1) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(1)">
                           <a class="page-link" href="#">⏪</a>
                         </li>`;
    }

    // < (이전)
    if (page > 1) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})">
                           <a class="page-link" href="#">⬅️</a>
                         </li>`;
    }

    // 현재 페이지 정보
    paginationHTML += `<li class="page-item active">
                         <span class="page-link">${page} / ${totalPages}</span>
                       </li>`;

    // > (다음)
    if (page < totalPages) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                           <a class="page-link" href="#">➡️</a>
                         </li>`;
    }

    // >> (맨끝)
    if (page < totalPages) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPages})">
                           <a class="page-link" href="#">⏩</a>
                         </li>`;
    }
  } else {
    const pageGroup = Math.ceil(page / groupSize); // 현재 페이지가 속한 그룹 번호
    let lastPage = pageGroup * groupSize; // 현재 그룹의 마지막 페이지
    if (lastPage > totalPages) {
      lastPage = totalPages; // 마지막 그룹 보정
    }

    // 현재 그룹의 첫 페이지
    let firstPage = lastPage - (groupSize - 1);
    if (firstPage < 1) {
      firstPage = 1;
    }

    // << (맨처음)
    if (page > 1) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(1)">
                         <a class="page-link" href="#">⏮️</a>
                       </li>`;
    }

    // < (이전)
    if (page > 1) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})">
                         <a class="page-link" href="#">⬅️</a>
                       </li>`;
    }

    // 첫 페이지가 1이 아니면 1을 먼저 보여주고, 중간에 ... 표시
    if (firstPage > 1) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(1)">
                         <a class="page-link" href="#">1</a>
                       </li>`;
      if (firstPage > 2) {
        paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    // 현재 그룹 페이지들 출력
    for (let i = firstPage; i <= lastPage; i++) {
      paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" 
                          onclick="moveToPage(${i})">
                         <a class="page-link" href="#">${i}</a>
                       </li>`;
    }

    // 마지막 페이지가 totalPages가 아니면 ... 처리 후 마지막 페이지 출력
    if (lastPage < totalPages) {
      if (lastPage < totalPages - 1) {
        paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
      paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPages})">
                         <a class="page-link" href="#">${totalPages}</a>
                       </li>`;
    }

    // > (다음)
    if (page < totalPages) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                         <a class="page-link" href="#">➡️</a>
                       </li>`;
    }

    // >> (맨끝)
    if (page < totalPages) {
      paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPages})">
                         <a class="page-link" href="#">⏭️</a>
                       </li>`;
    }
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

// 페이지 이동
const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

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
