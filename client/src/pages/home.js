import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserId";
import {useCookies} from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [Cookies , _] = useCookies(["access_token"]);

  const userID = useGetUserID();
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
        // console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
     if(Cookies.access_token) fetchSavedRecipe();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      },
       {headers: {authorization: Cookies.access_token}}
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);
  return (
    <div className="home">
      <h1 className="recipe">Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id} className="recipeBox">
            {/* {savedRecipes.includes(recipe._id) && <h2>ALREADY SAVED!</h2>} */}
            <div >
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
                className="recipeButton"
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "save"}
              </button>
            </div>
            <div><p>{recipe.ingredients }</p></div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    
    </div>
  );
};
