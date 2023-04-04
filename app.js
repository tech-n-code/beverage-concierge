let $mainCont = $("<div id='mainCont' class='container text-center'></div>");
$("body").append($mainCont);

let $topHeader = $("<header id='topHeader' class='py-3 mb-3 border-bottom'></header>");
$mainCont.append($topHeader);

let $topHeaderH2 = $("<h2 class='py-2 border' style='background-color: var(--bs-warning-border-subtle); --bs-border-color: var(--bs-warning-border-subtle); color: var(--bs-warning-text);'>Beverage Concierge</h2>");
$topHeader.append($topHeaderH2);

let $topHeaderCont = $("<div id='topHeaderCont' class='container-fluid d-grid gap-3 align-items-center' style='grid-template-columns: 1fr 2fr;'></div>");
$topHeader.append($topHeaderCont);

let $leftHeaderCol = $("<img src='bartender.jpg' width='100px' class='mx-auto d-block'></img>");
$topHeaderCont.append($leftHeaderCol);

let $rightHeaderCol = $("<div id='rightHeaderCol' class='d-grid gap-2 d-md-flex justify-content-md-end'></div>");
$topHeaderCont.append($rightHeaderCol);

let $form = $("<form class='w-100 me-3' role='search'>");
$rightHeaderCol.append($form);

let $searchField = $("<input id='search' type='search'class='form-control' placeholder='Search...' aria-label='Search'>");
$form.append($searchField);

let $submitBtn = $("<button id='submit' class='btn btn-primary' type='button'>Search</button>");
$rightHeaderCol.append($submitBtn);

let $resetBtn = $("<button id='reset' class='btn btn-primary btn-danger' type='button'>Reset</button>");
$rightHeaderCol.append($resetBtn);

let $results = $("<div id='results' class='container-fluid pb-3'></div>");
$mainCont.append($results);

let $resultsCont = $("<div id='resultsCont' class='d-grid gap-3' style='grid-template-columns: 1fr 2fr;'></div>");
$results.append($resultsCont);

let $leftResultCol = $("<div id='leftResultCol' class='d-grid gap-2' style='align-content: start;'></div>");
$resultsCont.append($leftResultCol);

let $rightResultCol = $("<div id='rightResultCol' class='bg-light border rounded d-grid gap-2'></div>");
$resultsCont.append($rightResultCol);

let $attribution = $("<p class='text-secondary' style='font-size: 10px;'>API: www.thecocktaildb.com/api.php<br>Logo: www.vecteezy.com</p>");
$mainCont.append($attribution);

initResults();

function initResults() {
    $("#rightResultCol").html("<span> </span>".repeat(10));
}

$(document).ready(function() {
    function searchAPI() {
        let $searchString = $("#search").val();
        if ($searchString.length === 0) {
            $("#leftResultCol").empty();
            $("#rightResultCol").empty();
            initResults();
            $("span:first-child").addClass("text-muted").text("Ops! Forgot to enter your search.");
        } else {
            $.get("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + $searchString, function (data) {
            console.log(data);
            if (!data.drinks) {
                $("#leftResultCol").empty();
                $("#rightResultCol").empty();
                initResults();
                $("span:first-child").addClass("text-muted").text("No results found.");
            } else {
                $("#leftResultCol").empty();
                $("#rightResultCol").empty();
                $.each(data.drinks,  function (i, drink) {
                    let image = drink.strDrinkThumb;  //it may help pre-load thumbnails
                    let $resultBtn = $(`<button id="${drink.idDrink}" class="btn btn-success" type="button">${drink.strDrink}</button>`);
                    $("#leftResultCol").append($resultBtn).on("click", `#${drink.idDrink}`, function(event) {
                        $("#rightResultCol").empty();
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
                        $("#rightResultCol").append($card);
                    });
                });
            }
            });
        }
    }
    $("#submit").on("click", searchAPI);  //triggers search on button click
    $("#reset").on("click", function(event) {
        $("#leftResultCol").empty();
        $("#rightResultCol").empty();
        $searchField.val("");
        initResults();
    });
    $("#search").on("keydown", function(event) {  //triggers search on `enter`
        if (event.which === 13) {   //ASCII code for 'enter' key
            event.preventDefault();  //prevents 'enter' from clearing the field
            searchAPI();
      }
    });
});