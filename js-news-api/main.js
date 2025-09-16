const API_KEY = `f636738a75f345269967e72b6d895e1a`;

let newsList = [];
let url = new URL(`https://newsapi.org/v2/top-headlines?page=2&country=us&apiKey=${API_KEY}`);
const menuButton = document.querySelectorAll(".menus button");
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    getNewsByKeyword();
  }
});

menuButton.forEach((menu) => menu.addEventListener("click", (event) => getNewsCategory(event)));

const getNews = async () => {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const getLatestNews = async () => {
  url = new URL(`https://newsapi.org/v2/top-headlines?page=2&country=us&apiKey=${API_KEY}`);
  getNews();
};

const getNewsCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
  getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
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
getLatestNews();
