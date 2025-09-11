// Manual test script for comments functionality
// Run this after starting the server: node test_comments_manually.js

const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

// Helper function for logging
const log = (message, data = "") => {
  console.log(`\n🧪 ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

// Helper function for error handling
const handleError = (error, context) => {
  console.error(`\n❌ Error in ${context}:`);
  if (error.response) {
    console.error(error.response.data);
  } else {
    console.error(error.message);
  }
};

async function testCommentsFlow() {
  let authToken = "";
  let testRecipeId = "";
  let testCommentId = "";

  try {
    // 1. Create a test user and login
    log("1. Creating test user...");
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: "testuser_comments",
        email: "test_comments@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });
    } catch (error) {
      // User might already exist, that's okay
      console.log("User might already exist, continuing...");
    }

    // Login
    log("2. Logging in...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: "test_comments@example.com",
      password: "password123",
    });
    authToken = loginResponse.data.token;
    log("Login successful", { token: authToken.substring(0, 20) + "..." });

    // 3. Create a test recipe
    log("3. Creating test recipe...");
    const recipeResponse = await axios.post(
      `${BASE_URL}/recipes`,
      {
        title: "Test Recipe for Comments",
        description: "A test recipe to check comments functionality",
        ingredients: ["ingredient1", "ingredient2"],
        instructions: ["step1", "step2"],
        cookingTime: 30,
        servings: 4,
        difficulty: "easy",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    testRecipeId = recipeResponse.data.id;
    log("Recipe created", { id: testRecipeId });

    // 4. Create a comment
    log("4. Creating comment...");
    const commentResponse = await axios.post(
      `${BASE_URL}/recipes/${testRecipeId}/comments`,
      {
        comment: "This is a test comment!",
        rating: 5,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    testCommentId = commentResponse.data.comment._id;
    log("Comment created", commentResponse.data);

    // 5. Get recipe comments
    log("5. Fetching recipe comments...");
    const commentsResponse = await axios.get(
      `${BASE_URL}/recipes/${testRecipeId}/comments`
    );
    log("Comments fetched", commentsResponse.data);

    // 6. Like the comment
    log("6. Liking comment...");
    const likeResponse = await axios.post(
      `${BASE_URL}/comments/${testCommentId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    log("Comment liked", likeResponse.data);

    // 7. Update the comment
    log("7. Updating comment...");
    const updateResponse = await axios.put(
      `${BASE_URL}/comments/${testCommentId}`,
      {
        comment: "This is an updated test comment!",
        rating: 4,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    log("Comment updated", updateResponse.data);

    // 8. Get updated comments
    log("8. Fetching updated comments...");
    const updatedCommentsResponse = await axios.get(
      `${BASE_URL}/recipes/${testRecipeId}/comments`
    );
    log("Updated comments fetched", updatedCommentsResponse.data);

    log("✅ All tests passed successfully!");
  } catch (error) {
    handleError(error, "test flow");
  }
}

// Run the test
testCommentsFlow();

module.exports = testCommentsFlow;
