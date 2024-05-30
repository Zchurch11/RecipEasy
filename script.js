//  random main course call https://api.spoonacular.com/recipes/random?number=1&type=main_course&apiKey=c52518723c08438e862a568db1340ee7
// Primary api key: '7c82070af4334fd1be1f34acee57a522'
const apiURL = 'https://api.spoonacular.com/recipes/'
const apiKey = 'c52518723c08438e862a568db1340ee7'
const recipeID = window.location.search.split('=')[1];
const searchInput = document.getElementById('search')
const searchContainer = document.querySelector('.search--container')
const searchResultsContainer = document.getElementById('search--results--container')
const searchBtn = document.querySelector('.search--btn')
const cookingInfoContainer = document.querySelector('.cooking--info--grid')
const displaySavedBtn = document.querySelector('.save--btn')
const savedList = document.querySelector('.saved--list')
const recipeTitle = document.querySelector('.recipe--title')


async function displaySummary(data){
  // const results = await getData(`${recipeID}/summary?apiKey=${apiKey}`) 
   
  
  const recipeSummary = document.querySelector('.recipe--summary').innerHTML = `${data.summary}`
  
}


async function getData(endpoint){
  
    const response = await fetch(`${apiURL}${endpoint}`)
    const data = await response.json()
    // const item = {...data}
    // console.log(data.instructions);
     
  
        
    return data  
}
function displayInstructions(data){
    
  // const  recipes  = await getData(`${recipeID}/analyzedInstructions?apiKey=${apiKey}`)
  
  data.forEach(recipe => {
    recipe.steps.forEach(step =>{
      const olLi = document.createElement('li')
      olLi.textContent = `${step.step}`
      const directions = document.querySelector('.directions').innerHTML = data.instructions
    })
   console.log(data); 
   
  
     
  })
  
}

async function addPopularRecipes(){
    const  { recipes }  = await getData(`random?number=10&apiKey=${apiKey}`)
    recipes.forEach(recipe => {
      // replace with createRecipeCard() ??
      const a = document.createElement('a')
         a.classList.add('recipe--card')
         a.href = `./recipe.html?id=${recipe.id}`
         a.innerHTML = `
         <div class="recipe--image">
                          <img src="https://img.spoonacular.com/recipes/${recipe.id}-556x370.jpg" alt="recipe image">
                      </div>
                      <h3 class="recipe--name">${recipe.title}</h3>
                      <div class="recipe--information">
                        
                        <span class="rating">${recipe.spoonacularScore > 10 ? recipe.spoonacularScore.toFixed(0) / 10: recipe.spoonacularScore.toFixed(1)}/10 <i class="fa-solid fa-star" style="color: #fab64f;"></i></span>
                        
                        <span class="cook--time">${recipe.readyInMinutes} min <i class="fa-solid fa-clock" style="color: #fab64f;"></i></span>
  
                      </div>
         ` 
        const popularContainer = document.querySelector('.popular--recipes').appendChild(a)
    })
    
    console.log(recipes);
}


async function displayRecipeImage(){
  
  const imageContainer = document.querySelector('.image--container')
  const image = document.createElement('img')
  image.src = ` https://img.spoonacular.com/recipes/${recipeID}-556x370.jpg`
  image.alt = 'recipe image'
  imageContainer.appendChild(image)
}
async function displayIngredients() {
  const ingredients = await getData(`${recipeID}/information?includeNutrition=false&addWinePairing=false&addTasteData=false&apiKey=${apiKey}`);
  console.log(ingredients);
  // display title and additional info
   recipeTitle.textContent = `${ingredients.title}`
    const cookingInfoContainer = document.querySelector('.cooking--info--grid')
    cookingInfoContainer.innerHTML = `
                
                <span class="info">Cook time: ${ingredients.readyInMinutes} min</span>
                <span class="info">Servings: ${ingredients.servings}</span>
                <span class="save--icon"><i class="fa-regular fa-bookmark fa-xl"></i></span>
                <span class="save--icon--filled"><i class="fa-solid fa-bookmark fa-xl" style="color: #fab64f;"></i></span>
    `
    // display ingredients
  const ingredientsList = document.querySelector('.ingredients');
  ingredients.extendedIngredients.map(extendedIngredient =>{
  const ulLi = document.createElement('li')
    ulLi.textContent = `${extendedIngredient.original}`
    ingredientsList.appendChild(ulLi)
  })
    displayInstructions(ingredients)
    displaySummary(ingredients)
    
    // console.log(data);
    // return ingredients
    
  }


 function displayInstructions(ingredients){
    
    
      ingredients.analyzedInstructions[0].steps.forEach((step) => {
        console.log(step);
        const olLi = document.createElement('li')
        olLi.textContent = `${step.step}`
        const directions = document.querySelector('.directions').appendChild(olLi)
      })
    
    
}
async function displaySimilarRecipes(){
  
  const  similarRecipes  = await getData(`${recipeID}/similar?apiKey=${apiKey}`)
    similarRecipes.forEach(similarRecipe => {
      const a = document.createElement('a')
         a.classList.add('recipe--card')
         a.href = `./recipe.html?id=${similarRecipe.id}`
         a.innerHTML = `
         <div class="recipe--image">
                          <img src="https://img.spoonacular.com/recipes/${similarRecipe.id}-556x370.jpg" alt="recipe image">
                      </div>
                      <h3 class="recipe--name">${similarRecipe.title}</h3>
                      <div class="recipe--information">
                        
                        <span class="cuisine--type">${similarRecipe.servings} ${similarRecipe.servings > 1 ? 'servings': 'serving'}</span>
                       
                        <span class="cook--time">${similarRecipe.readyInMinutes} min <i class="fa-solid fa-clock" style="color: #fab64f;"></i></span>
  
                      </div>
         ` 
         const similarDishesContainer = document.querySelector('.related--dishes').appendChild(a)
})
}
async function searchRecipes(e){
  
  const searchTerm = searchInput.value
  while (searchResultsContainer.firstElementChild){
            searchResultsContainer.removeChild(searchResultsContainer.firstElementChild)
            
           } 
   const {results} = await getData(`complexSearch?query=${searchTerm}&number=1&apiKey=${apiKey}`) 
   results.forEach(result => {
    const a = document.createElement('a')
       a.classList.add('recipe--card')
       a.href = `./recipe.html?id=${result.id}`
       a.innerHTML = `
       <div class="recipe--image">
                        <img src="https://img.spoonacular.com/recipes/${result.id}-556x370.jpg" alt="recipe image">
                    </div>
                    <h3 class="recipe--name">${result.title}</h3>
                    <div class="recipe--information">
                      
                      

                    </div>
       ` 
           
           searchResultsContainer.appendChild(a)
         
    console.log(searchResultsContainer)
   })
   const searchHeading = document.querySelector('.results--heading')
   searchHeading.style.display = 'block'
   
   searchHeading.textContent = `${results.length} ${results.length > 1 || results.length === 0 ? `Results for ${searchTerm} `: `Result for ${searchTerm}`}`
   console.log(searchHeading)
  clearInput()
   
  
    
}

function clearInput(){
  searchInput.value = ''
  
  
}



function saveRecipe(e) {  
  
  const title = recipeTitle.textContent
  const saveIconFilled = document.querySelector('.save--icon--filled');
  const saveIcon = document.querySelector('.save--icon');
  const savedItem = { id: `${recipeID}`, name: `${title}`, saved: false };
  // updateList()
  
  
  let itemsList = JSON.parse(localStorage.getItem('savedItems')) || [];
  
  const existingItemIndex = itemsList.findIndex((item) => item.name === savedItem.name);
  const updatedList = itemsList.filter((item)=> {
      item.name !== savedItem.name})
  if (existingItemIndex >= 0 && e.target.classList.contains('fa-solid'))
    {
    saveIconFilled.style.display = 'inline'
    saveIcon.style.display = 'none'
    console.log('ran');
    
    
    
    saveIconFilled.style.display = 'none'
    saveIcon.style.display = 'inline'
      localStorage.setItem('savedItems', JSON.stringify(updatedList))
        // updateList()
        // console.log(updatedList + 'after filter', itemsList + 'after')
      savedList.innerHTML = ''
  
       updateList()
 
} else if (  e.target.classList.contains('fa-bookmark') ){
    saveIconFilled.style.display = 'none'
    saveIcon.style.display = 'inline'
    
    
      console.log('before update saved: ' + savedItem.saved);
      
      localStorage.setItem('savedItems', JSON.stringify(itemsList));
      
      
         if (existingItemIndex === -1) {
          saveIconFilled.style.display = 'none';
          saveIcon.style.display = 'inline';
          itemsList.push(savedItem);
          savedItem.saved = true
          console.log(savedItem + 'after update');
          localStorage.setItem('savedItems', JSON.stringify(itemsList));
          updateList(saveIcon)
          // console.log('after update save: ' + savedItem.saved,);
         } 
      
        
          
    

  // console.log(itemsList);

saveIconFilled.style.display = 'inline';
          saveIcon.style.display = 'none';
    // })
    
}
} 

function updateList(){
  
    JSON.parse(localStorage.getItem('savedItems'))
  console.log('items updated');
          
           Object.keys(localStorage).forEach(key => {
            const value = JSON.parse(localStorage.getItem(key))
            console.log( key, value);
           value.forEach((value) =>{
            
            const ulLi = document.createElement('li')
            ulLi.innerHTML = `<a href="./recipe.html?id=${value.id}">${value.name}</a><i class="fa-regular fa-trash-can"></i>`
            savedList.appendChild(ulLi)
            JSON.parse(localStorage.getItem('savedItems'))
            
           }) 
          })
          
          
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