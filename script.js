const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal"),
  categoriesEl = document.getElementById("categories"),
  categoriestHeading = document.getElementById("categories-heading"),
  lettersEl = document.getElementById("letters");

// Fetch all meal categories from API
function displayCategories() {
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((res) => res.json())
    .then((data) => {
      categoriestHeading.innerHTML = `<h3>Browse meals by category</h3>`;
      //console.log(data);

      if (data.categories === null) {
        categoriesEl.innerHTML = "";
      } else {
        categoriesEl.innerHTML = data.categories
          .map(
            (category) => `
          <div class="category" data-categoryName="${category.strCategory}">
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" />
            <div class="category-info" data-categoryID="${category.idCategory}">
              <h3>${category.strCategory}</h3>
            </div>
          </div>
        `
          )
          .join("");
      }
    });
}

// Fetch meals from API by category
function getMealsByCategory(categoryName) {
  // Clear single meal
  single_mealEl.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);

      resultHeading.innerHTML = `<h2>Results for category '${categoryName}'</h2>`;

      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
      } else {
        mealsEl.innerHTML = data.meals
          .map(
            (meal) => `
              <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                  <div class="meal-info" data-mealID="${meal.idMeal}" >
                      <h3>${meal.strMeal}</h3>
                  </div>
              </div>
          `
          )
          .join("");
      }
    });
}

// Fetch meals from API by letter
function getMealsbyLetter(singleLetter) {
  // Clear single meal
  single_mealEl.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${singleLetter}`)
    .then((res) => res.json())
    .then((data) => {
      resultHeading.innerHTML = `<h2>Results for letter '${singleLetter.toUpperCase()}'</h2>`;

      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        mealsEl.innerHTML = "";
      } else {
        mealsEl.innerHTML = data.meals
          .map(
            (meal) => `
              <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                  <div class="meal-info" data-mealID="${meal.idMeal}" >
                      <h3>${meal.strMeal}</h3>
                  </div>
              </div>
          `
          )
          .join("");
      }
    });
}

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}'</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
          mealsEl.innerHTML = "";
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}" >
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `
            )
            .join("");
        }
      });
    // Clear search text
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; 1 <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealById(mealID);
  }
});

categoriesEl.addEventListener("click", (e) => {
  const category = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("category");
    } else {
      return false;
    }
  });

  if (category) {
    const categoryName = category.getAttribute("data-categoryName");
    getMealsByCategory(categoryName);
  }
});

lettersEl.addEventListener("click", (e) => {
  const letter = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("letter");
    } else {
      return false;
    }
  });

  if (letter) {
    singleLetter = letter.innerText.toLowerCase();
    getMealsbyLetter(singleLetter);
  }
});

displayCategories();
