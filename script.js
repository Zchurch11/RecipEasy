
// Primary api key: 'c52518723c08438e862a568db1340ee7'
const apiURL = "https://api.spoonacular.com/recipes/";
const apiKey = "11d0d18e4f1046229c788ed126a3d44a";
const recipeID = window.location.search.split("=")[1];
const searchInput = document.getElementById("search");
const searchContainer = document.querySelector(".search--container");
const searchResultsContainer = document.getElementById(
  "search--results--container"
);
const searchBtn = document.querySelector(".search--btn");
const cookingInfoContainer = document.querySelector(".cooking--info--grid");
const searchInfo = document.querySelector(".search--info");
const displaySavedBtn = document.querySelector(".save--btn");
const savedList = document.querySelector(".saved--list");
const recipeTitle = document.querySelector(".recipe--title");
const searchFilters = document.querySelectorAll("input[type=radio]");


async function displaySummary(data) {
  const summary = data.summary;
  // find last bold tag to slice off non working anchor tags from end of summary
  const lastBoldTag = summary.lastIndexOf("</b>");

  const refinedSummary = summary.slice(0, lastBoldTag);
  
  const recipeSummary = (document.querySelector(
    ".recipe--summary"
  ).innerHTML = `${refinedSummary + "."}`);
}

async function getData(endpoint) {
  const response = await fetch(`${apiURL}${endpoint}`);
  const data = await response.json();

  return data;
}
function displayInstructions(data) {
  

  data.forEach((recipe) => {
    recipe.steps.forEach((step) => {
      const olLi = document.createElement("li");
      olLi.textContent = `${step.step}`;
      const directions = (document.querySelector(".directions").innerHTML =
        data.instructions);
    });
    
  });
}

async function addPopularRecipes() {
  const { recipes } = await getData(`random?number=10&apiKey=${apiKey}`);
  recipes.forEach((recipe) => {
   
    const a = document.createElement("a");
    a.classList.add("recipe--card");
    a.href = `./recipe.html?id=${recipe.id}`;
    a.innerHTML = `
         <div class="recipe--image">
                          <img src="https://img.spoonacular.com/recipes/${
                            recipe.id
                          }-556x370.jpg" alt="recipe image">
                      </div>
                      <h3 class="recipe--name">${recipe.title}</h3>
                      <div class="recipe--information">
                        
                        <span class="rating">${
                          recipe.spoonacularScore > 10
                            ? recipe.spoonacularScore.toFixed(0) / 10
                            : recipe.spoonacularScore.toFixed(1)
                        }/10 <i class="fa-solid fa-star" style="color: #fab64f;"></i></span>
                        
                        <span class="cook--time">${
                          recipe.readyInMinutes
                        } min <i class="fa-solid fa-clock" style="color: #fab64f;"></i></span>
  
                      </div>
         `;
    const popularContainer = document
      .querySelector(".popular--recipes")
      .appendChild(a);
  });

  
}

async function displayRecipeImage() {
  const imageContainer = document.querySelector(".image--container");
  const image = document.createElement("img");
  image.src = ` https://img.spoonacular.com/recipes/${recipeID}-556x370.jpg`;
  image.alt = "recipe image";
  imageContainer.appendChild(image);
}
async function displayRecipeInfo() {
  let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

  isItemSaved = savedItems.some((item) => item.id === recipeID);

  const ingredients = await getData(
    `${recipeID}/information?includeNutrition=false&addWinePairing=false&addTasteData=false&apiKey=${apiKey}`
  );
  
  // display title and additional info
  recipeTitle.textContent = `${ingredients.title}`;
  const cookingInfoContainer = document.querySelector(".cooking--info--grid");
  cookingInfoContainer.innerHTML = `
                
                <span class="info">Cook time: ${
                  ingredients.readyInMinutes
                } min</span>
                <span class="info">Servings: ${ingredients.servings}</span>
                <span class="icon--container">${
                  isItemSaved
                    ? '<i class="fa-regular fa-bookmark fa-xl save-icon" style= "display: none"></i><i class="fa-solid fa-bookmark fa-xl delete-icon" style="color: hsl(240, 27%, 41%);"></i>'
                    : '<i class="fa-regular fa-bookmark fa-xl save-icon"></i><i class="fa-solid fa-bookmark fa-xl delete-icon" style="color: hsl(240, 27%, 41%); display: none"></i>'
                }</span>
                
    `;
  // display ingredients
  const ingredientsList = document.querySelector(".ingredients");
  ingredients.extendedIngredients.map((extendedIngredient) => {
    const ulLi = document.createElement("li");
    ulLi.textContent = `${extendedIngredient.original}`;
    ingredientsList.appendChild(ulLi);
  });
  displayInstructions(ingredients);
  displaySummary(ingredients);
}

function displayInstructions(ingredients) {
  ingredients.analyzedInstructions[0].steps.forEach((step) => {
    
    const olLi = document.createElement("li");
    olLi.textContent = `${step.step}`;
    const directions = document.querySelector(".directions").appendChild(olLi);
  });
}
async function displaySimilarRecipes() {
  const similarRecipes = await getData(`${recipeID}/similar?apiKey=${apiKey}`);
  similarRecipes.forEach((similarRecipe) => {
    const a = document.createElement("a");
    a.classList.add("recipe--card");
    a.href = `./recipe.html?id=${similarRecipe.id}`;
    a.innerHTML = `
         <div class="recipe--image">
                          <img src="https://img.spoonacular.com/recipes/${
                            similarRecipe.id
                          }-556x370.jpg" alt="recipe image">
                      </div>
                      <h3 class="recipe--name">${similarRecipe.title}</h3>
                      <div class="recipe--information">
                        
                        <span class="cuisine--type">${similarRecipe.servings} ${
      similarRecipe.servings > 1 ? "servings" : "serving"
    }</span>
                       
                        <span class="cook--time">${
                          similarRecipe.readyInMinutes
                        } min <i class="fa-solid fa-clock" style="color: #fab64f;"></i></span>
  
                      </div>
         `;
    const similarDishesContainer = document
      .querySelector(".related--dishes")
      .appendChild(a);
  });
}
// Determine which filter is selected
function checkIsChecked() {
  const checkedFilter = document.querySelector("input[type=radio]:checked");
  if (checkedFilter != null) {
    return checkedFilter.value;
  }
}
// Display instructions for search
function showSearchInstructions() {
  const value = checkIsChecked();
  if (value === "by--recipe") {
    
    searchInfo.textContent = "Enter a recipe name.";
  } else if (value === "type") {
    
    searchInfo.textContent =
      "Enter dish type (e.g. breakfast, snack, dessert).";
  } else {
    
    searchInfo.textContent = "Enter the cuisine type.";
  }
  
}
function determineSearchEndpoint(searchTerm) {
  const searchFilter = checkIsChecked();
  let searchEndpoint;
  if (searchFilter === "by--recipe") {
    searchEndpoint = `complexSearch?query=${searchTerm}&number=5&apiKey=${apiKey}`;
  } else if (searchFilter === "type") {
    searchEndpoint = `complexSearch?type=${searchTerm}&number=5&apiKey=${apiKey}`;
  } else {
    searchEndpoint = `complexSearch?cuisine=${searchTerm}&number=5&apiKey=${apiKey}`;
  }
  
  return searchEndpoint;
}

async function searchRecipes(e) {
  const searchTerm = searchInput.value;
  const searchEndpoint = determineSearchEndpoint(searchTerm);
  if (searchInput.validity.valueMissing) {
    alert("Please enter a search term");
  } else {
    while (searchResultsContainer.firstElementChild) {
      searchResultsContainer.removeChild(
        searchResultsContainer.firstElementChild
      );
    }
    // *TODO* Fix results returning as an object for recipe/cuisine search
    const { results } = await getData(searchEndpoint);

    
    results.forEach((result) => {
      const a = document.createElement("a");
      a.classList.add("recipe--card");
      a.href = `./recipe.html?id=${result.id}`;
      a.innerHTML = `
       <div class="recipe--image">
                        <img src="https://img.spoonacular.com/recipes/${result.id}-556x370.jpg" alt="recipe image">
                    </div>
                    <h3 class="recipe--name">${result.title}</h3>
                    <div class="recipe--information">
                    <span class="likes">(${result.likes})<i class="fa-solid fa-heart fa-sm" style="color: #ff0000;"></i></span>
                    </div>
       `;

      searchResultsContainer.appendChild(a);
    });
    const searchHeading = document.querySelector(".results--heading");
    searchHeading.style.display = "block";

    searchHeading.textContent = `${results.length} ${
      results.length > 1 || results.length === 0
        ? `Results for ${searchTerm} `
        : `Result for ${searchTerm}`
    }`;
    
  }
  clearInput();
}
// clear input after search
function clearInput() {
  searchInput.value = "";
}
// validate search term is entered
function checkInputNotBlank() {
  if ((searchInput.value = "")) {
    
  }
}

// save a recipe to local storage
function addRecipe(savedItem) {
  
  let itemsList = JSON.parse(localStorage.getItem("savedItems")) || [];
  const existingItemIndex = itemsList.findIndex(
    (item) => item.name === savedItem.name
  );
  if (existingItemIndex === -1) {
    itemsList.push(savedItem);
    savedItem.saved = true;
    localStorage.setItem("savedItems", JSON.stringify(itemsList));
  }
 
}
// remove recipe from local storage
function deleteRecipe(savedItem) {
  let itemsList = JSON.parse(localStorage.getItem("savedItems")) || [];
  const existingItemIndex = itemsList.findIndex(
    (item) => item.name === savedItem.name
  );
  

  if (existingItemIndex >= 0) {
    itemsList.splice(existingItemIndex, 1);
    localStorage.setItem("savedItems", JSON.stringify(itemsList));
    
  } else {
    console.log(`Item "${savedItem.name}" not found in local storage.`);
  }
}

// use delegation to add event listener and decide if add or delete should be run
function setupSaveDeleteListeners() {
  const currentItemId = recipeID;
  let itemsList = JSON.parse(localStorage.getItem("savedItems")) || [];

  isItemSaved = itemsList.some((item) => item.id === currentItemId);
  

  cookingInfoContainer.addEventListener("click", (e) => {
    const title = recipeTitle.textContent;
    const targetIcon = e.target;
    const isSaveIcon = targetIcon.classList.contains("save-icon");
    const isDeleteIcon = targetIcon.classList.contains("delete-icon");

    if (isSaveIcon || isDeleteIcon) {
      const savedItem = { id: `${recipeID}`, name: `${title}`, saved: false };

      if (isSaveIcon) {
        addRecipe(savedItem);
        
        targetIcon.style.display = "none";
        targetIcon.nextElementSibling.style.display = "inline";
        savedList.innerHTML = "";
        updateList();
      } else if (isDeleteIcon) {
        deleteRecipe(savedItem);
        targetIcon.style.display = "none";
        targetIcon.previousElementSibling.style.display = "inline";
        savedList.innerHTML = "";
        updateList();
      }
    }
  });
}

function updateList() {
  let itemsList = JSON.parse(localStorage.getItem("savedItems")) || [];

  

  Object.keys(localStorage).forEach((key) => {
    const value = JSON.parse(localStorage.getItem(key));
    
    value.forEach((value) => {
      const existingItemIndex = itemsList.findIndex(
        (item) => item.name === value.name
      );
      if (existingItemIndex >= 0) {
        
        const ulLi = document.createElement("li");
        ulLi.innerHTML = `<a href="./recipe.html?id=${value.id}">${value.name}</a><i class="fa-regular fa-trash-can"></i>`;

        savedList.appendChild(ulLi);
      }
    });
  });
}

function showSavedRecipes(){
  const savedRecipesContainer = document.querySelector('.saved--recipes--container')
  savedRecipesContainer.classList.toggle('active')
    console.log('Working');
  }
  function removeRecipeFromSavedList(e){
    if(e.target.classList.contains('fa-trash-can')){
      console.log('deleting', e);
    }
    
  }


console.log(window.location.pathname);
    savedList.addEventListener('click', removeRecipeFromSavedList)
    displaySavedBtn.addEventListener('click', showSavedRecipes)
   switch(window.location.pathname){
      case '/':
        // addPopularRecipes()

      searchBtn.addEventListener('click',searchRecipes)
       updateList() 
       break
   

    
      case `/recipe.html`:
           
           displayIngredients()
           displayRecipeImage()
           updateList()
          //  saveRecipe()
           cookingInfoContainer.addEventListener('click', saveRecipe)
           //displaySimilarRecipes()
           
           
           
      break
    }
//     default:
//       console.log('not a page')
//       break
// }
