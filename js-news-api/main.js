const API_KEY = `f636738a75f345269967e72b6d895e1a`;

let newsList = [];
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
const menuButton = document.querySelectorAll(".menus button");
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    getNewsByKeyword();
  }
});

menuButton.forEach((menu) => menu.addEventListener("click", (event) => getNewsCategory(event)));

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

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
getLatestNews();
