const $mainCont = $("<div id='mainCont' class='container text-center'></div>");
$("body").append($mainCont);

const $topHeader = $("<header id='topHeader' class='py-3 mb-3 border-bottom'></header>");
$mainCont.append($topHeader);

const $topHeaderH2 = $("<h2 class='py-2 border' style='background-color: var(--bs-warning-border-subtle); --bs-border-color: var(--bs-warning-border-subtle); color: var(--bs-warning-text);'>Beverage Concierge</h2>");
$topHeader.append($topHeaderH2);

const $topHeaderCont = $("<div id='topHeaderCont' class='container-fluid d-grid gap-3 align-items-center' style='grid-template-columns: 1fr 2fr;'></div>");
$topHeader.append($topHeaderCont);

const $leftHeaderCol = $("<img src='bartender.jpg' width='100px' class='mx-auto d-block'></img>");
$topHeaderCont.append($leftHeaderCol);

const $rightHeaderCol = $("<div id='rightHeaderCol' class='d-grid gap-2 d-md-flex justify-content-md-end'></div>");
$topHeaderCont.append($rightHeaderCol);

const $form = $("<form class='w-100 me-3' role='search'>");
$rightHeaderCol.append($form);

const $searchField = $("<input id='searchField' type='search'class='form-control' placeholder='Search...' aria-label='Search'>");
$form.append($searchField);

const $submitBtn = $("<button id='submit' class='btn btn-primary' type='button'>Search</button>");
$rightHeaderCol.append($submitBtn);

const $resetBtn = $("<button id='reset' class='btn btn-primary btn-danger' type='button'>Reset</button>");
$rightHeaderCol.append($resetBtn);

const $results = $("<div id='results' class='container-fluid pb-2'></div>");
$mainCont.append($results);

const $resultsCont = $("<div id='resultsCont' class='d-grid gap-3' style='grid-template-columns: 1fr 2fr;'></div>");
$results.append($resultsCont);

const $leftResultCol = $("<div id='leftResultCol' class='d-grid gap-2' style='align-content: start;'></div>");
$resultsCont.append($leftResultCol);

const $rightResultCol = $("<div id='rightResultCol' class='bg-light border rounded d-grid gap-2'></div>");
$resultsCont.append($rightResultCol);

const $attribution = $("<p class='text-secondary' style='font-size: 10px;'>By Will Franceschini<br>A Galvanize bootcamp project<br>API credits: www.thecocktaildb.com/api.php<br>Logo credits: www.vecteezy.com</p>");
$mainCont.append($attribution);

const gitHubDiv = document.createElement("div");
const gitHubLogo = document.createElement("img");
gitHubLogo.src = "./github-mark.png";
gitHubLogo.style.display = "block";
gitHubLogo.style.width = "2rem";
gitHubLogo.style.margin = "0.5rem auto";
gitHubDiv.appendChild(gitHubLogo);
document.body.append(gitHubDiv);

gitHubLogo.addEventListener("click", () => {
        window.open("https://github.com/tech-n-code", "_blank");
    });
gitHubLogo.addEventListener("mouseover", () => {
        gitHubLogo.style.cursor = "pointer";
    });

const linkedInDiv = document.createElement("div");
const linkedInLogo = document.createElement("img");
linkedInLogo.src = "https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat&logo=Linkedin&logoColor=white";
linkedInLogo.style.display = "block";
linkedInLogo.style.margin = "0.5rem auto";
linkedInDiv.appendChild(linkedInLogo);
document.body.append(linkedInDiv);

linkedInLogo.addEventListener("click", () => {
        window.open("https://www.linkedin.com/in/will-franceschini/", "_blank");
    });
linkedInLogo.addEventListener("mouseover", () => {
        linkedInLogo.style.cursor = "pointer";
    });

initResults();

function initResults() {
    $leftResultCol.empty();
    $rightResultCol.empty().removeClass("bg-light border rounded");
    $("#noResultsMsg").remove();
    $("#noSearchStr").remove();
}

$(document).ready(() => {
    function searchAPI() {
        const searchStr = $searchField.val();
        if (searchStr.length === 0) {
            initResults();
            $results.append("<div id='noSearchStr' class='bg-light border rounded'>Ops! Forgot to enter your search</div>");
        } else {
            $.get("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + searchStr, (data) => {
                    console.log(data);
                    if (!data.drinks) {
                        initResults();
                        $results.append("<div id='noResultsMsg' class='bg-light border rounded'>No results found.</div>");
                    } else {
                        initResults();
                        $rightResultCol.addClass("bg-light border rounded");
                        $.each(data.drinks, (i, drink) => {
                            let image = drink.strDrinkThumb; //it may help pre-load thumbnails
                            let $resultBtn = $(`<button id="${drink.idDrink}" class="btn btn-success" type="button">${drink.strDrink}</button>`);
                            $leftResultCol.append($resultBtn).on("click", `#${drink.idDrink}`, (event) => {
                                $rightResultCol.empty();
                                let $card = $("<span>");
                                $(`<h2 class="py-1">${drink.strDrink}</h2>`).appendTo($card);
                                $(`<img src="${image}" alt="${drink.strDrink}" width="200px" class="rounded shadow"></img>`).appendTo($card);
                                $(`<h4 class="py-1">Mixing Instructions:</h4>`).appendTo($card);
                                $(`<p class="px-3">${drink.strInstructions}</p>`).appendTo($card);
                                $("<h4>Ingredients:</h4>").appendTo($card);
                                for (let i = 1; i <= 15; i++) {
                                    let ingredient = drink["strIngredient" + i];
                                    let measure = drink["strMeasure" + 1];
                                    if (ingredient && measure) {
                                        $(`<p>${measure} of ${ingredient}</p>`).appendTo($card);
                                    }
                                }
                                $("html, body").scrollTop(0);
                                $rightResultCol.append($card);
                            });
                        });
                        $rightResultCol.append("<p class='text-secondary p-3'>Choose beverage to display instructions.</p>");
                    }
                });
        }
    }
    $submitBtn.on("click", searchAPI); //triggers search on button click
    $resetBtn.on("click", (event) => {
            $searchField.val("");
            initResults();
        });
    $searchField.on("keydown", (event) => {
            if (event.which === 13) { //ASCII code for 'enter' key
                event.preventDefault(); //prevents 'enter' from clearing the field
                searchAPI();
            }
        });
});