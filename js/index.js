(function () {
  const form = document.querySelector("#github-form");
  const searchQuery = document.querySelector("#search");
  const searchType = document.querySelector("#search-type");
  const list = document.querySelector("#user-list");
  const repos = document.querySelector("#repos-list");

  function onSubmit(e) {
    console.log(searchQuery);
    e.preventDefault();
    let search = searchQuery.value;
    let queryType = searchType.value;
    if (queryType == "repos") {
      getSearchByRepos(search);
    } else if (queryType == "user") {
      getSearch(search);
    }
    removeAllChildNodes(list);
    removeAllChildNodes(repos);
  }
  async function getSearch(user) {
    const response = await fetch(
      `https://api.github.com/search/users?q=${user}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const userData = await response.json();
    knowsWhatToDoNext(userData);
  }
  async function getSearchByRepos(query) {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const repoData = await response.json();
    returnRepoDetails(repoData.items);
  }
  function knowsWhatToDoNext(details) {
    for (let u of details.items) {
      let login = u.login;
      let avatar = u.avatar_url;
      let link = u.html_url;
      let li = document.createElement("li");
      let img = document.createElement("img");
      img.setAttribute("src", `${avatar}`);
      let fullLink = document.createElement("a");
      fullLink.innerText = login;
      fullLink.setAttribute("href", link);
      fullLink.addEventListener(
        "click",
        createClickProfileHandler(u.repos_url)
      );
      li.append(img, fullLink);
      list.append(li);
    }
  }
  function createClickProfileHandler(repos_url) {
    return (e) => {
      e.preventDefault();
      removeAllChildNodes(repos);
      return fetch(repos_url)
        .then((response) => response.json())
        .then(returnRepoDetails);
    };
  }
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  function returnRepoDetails(reposList) {
    for (let r of reposList) {
      let li = document.createElement("li");
      let name = r.name;
      li.append(name);
      repos.appendChild(li);
    }
  }

  function main() {
    form.addEventListener("submit", onSubmit);
  }
  main();
})();
