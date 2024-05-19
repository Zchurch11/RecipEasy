//  random main course call https://api.spoonacular.com/recipes/random?number=1&type=main_course&apiKey=c52518723c08438e862a568db1340ee7
const apiURL = 'https://api.spoonacular.com/recipes/'
const apiKey = 'c52518723c08438e862a568db1340ee7'

const searchInput = document.getElementById('search')
const searchContainer = document.querySelector('search--container')

const searchBtn = document.querySelector('.search--btn')




async function getData(endpoint){
    const response = await fetch(`${apiURL}${endpoint}`)
    const data = await response.json()
    return (data);
}

async function addPopularRecipes(){
    const  { recipes }  = await getData(`random?number=10&type=main_course&apiKey=${apiKey}`)
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
                        
                        <span class="cuisine--type">${recipe.dishTypes[0]}</span>
                        <span class="likes">(${recipe.aggregateLikes})<i class="fa-solid fa-heart fa-sm" style="color: #ff0000;"></i></span>
                        <span class="cook--time">${recipe.readyInMinutes} min <i class="fa-regular fa-clock" style="color: #ffffff;"></i></span>
  
                      </div>
         ` 
        const popularContainer = document.querySelector('.popular--recipes').appendChild(a)
    })
    
    console.log(recipes);
}


async function displayRecipeImage(){
  const recipeID = window.location.search.split('=')[1]
  const imageContainer = document.querySelector('.image--container')
  const image = document.createElement('img')
  image.src = ` https://img.spoonacular.com/recipes/${recipeID}-556x370.jpg`
  image.alt = 'recipe image'
  imageContainer.appendChild(image)
}
async function displayIngredients() {
  const recipeID = window.location.search.split('=')[1];
  const ingredients = await getData(`${recipeID}/information?apiKey=${apiKey}`);
  // display title and additional info
  const recipeTitle = document.querySelector('.recipe--title').textContent = `${ingredients.title}`
    const cookingInfoContainer = document.querySelector('.cooking--info--grid')
    cookingInfoContainer.innerHTML = `
    
                <span class="info">Cook time: ${ingredients.readyInMinutes} min</span>
                <span class="info">Servings: ${ingredients.servings}</span>
                <span class="save--icon"><i class="fa-regular fa-bookmark fa-xl"></i></span>
                <span class="save--icon--filled"><i class="fa-solid fa-bookmark fa-xl" style="color: #000000;"></i></span>
    `
    // display ingredients
  const ingredientsList = document.querySelector('.ingredients--list');
  ingredients.extendedIngredients.map(extendedIngredient =>{
  const ulLi = document.createElement('li')
    ulLi.textContent = `${extendedIngredient.original}`
    ingredientsList.appendChild(ulLi)
  })
    
  }


async function displayInstructions(){
    const recipeID = window.location.search.split('=')[1]
    const  recipes  = await getData(`${recipeID}/analyzedInstructions?apiKey=${apiKey}`)
    
    recipes.forEach(recipe => {
      recipe.steps.forEach(step =>{
        const olLi = document.createElement('li')
        olLi.textContent = `${step.step}`
        const directions = document.querySelector('.directions').appendChild(olLi)
      })
      
    
       
    })
    
}
async function displaySimilarRecipes(){
  const recipeID = window.location.search.split('=')[1]
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
                        
                        <span class="cuisine--type">${similarRecipe.servings} servings</span>
                       
                        <span class="cook--time">${similarRecipe.readyInMinutes} min <i class="fa-regular fa-clock" style="color: #ffffff;"></i></span>
  
                      </div>
         ` 
         const similarDishesContainer = document.querySelector('.related--dishes').appendChild(a)
})
}
async function searchRecipes(e){
  
  const searchTerm = searchInput.value
  const recipeID = window.location.search.split('=')[1]
   const {results} = await getData(`complexSearch?query=${searchTerm}&number=1&apiKey=c52518723c08438e862a568db1340ee7`) 
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
   
          const searchResultsContainer = document.getElementById('search--results--container').appendChild(a)
         
    console.log(results)
   })
   const searchHeading = document.querySelector('.search--heading').textContent = `${results.totalResults} Results for ${searchTerm}.`
   
  
    
}

function clearInput(){
  searchInput.innerHTML = ''
}




console.log(window.location.pathname);


   switch(window.location.pathname){
      case '/':
//       addPopularRecipes()
//       break
       searchBtn.addEventListener('click', searchRecipes)
       clearInput() 
       break
   

    
      case `/recipe.html`:
//       displayInstructions()
//       displayIngredients()
//       displayRecipeImage()
         displaySimilarRecipes()
      break
    }
//     default:
//       console.log('not a page')
//       break   
// }