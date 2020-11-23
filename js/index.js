(function () {
  const form = document.querySelector("#github-form");
  const input = document.querySelector("#search");
  const list = document.querySelector("#user-list");
  const repos = document.querySelector("#repos-list");
  function onSubmit(e) {
    console.log(input);
    e.preventDefault();
    let search = input.value;
    getSearch(search);
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
      //   let fullLink = document.createElement("a");
      //   fullLink.innerText = link;
      //   fullLink.setAttribute("href", link);
      li.append(name);
      repos.appendChild(li);
    }
  }

  function main() {
    form.addEventListener("submit", onSubmit);
  }
  main();
})();
