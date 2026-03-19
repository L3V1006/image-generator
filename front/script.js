async function generateImage() {
  const promptInput = document.getElementById("prompt");
  const loader = document.getElementById("loader");
  const img = document.getElementById("result");

  const prompt = promptInput.value.trim();

  // Basic validation
  if (!prompt) {
    alert("Please enter a description for the image!");
    return;
  }

  // UI State: Show loader, hide previous image
  loader.style.display = "block";
  img.style.display = "none";
  img.src = ""; // Clear the old image source

  try {
    // ✅ NEW: Relative path for Netlify Functions (/api/...)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Server error occurred. Check Netlify logs.");
    }

    const data = await response.json();

    if (data.image) {
      // Set the image source to the Pollinations URL returned by the API
      img.src = data.image;

      // ✅ Wait for the image to actually LOAD before showing it
      img.onload = () => {
        loader.style.display = "none";
        img.style.display = "block";
        img.style.width = "100%"; // Ensures full-size look
        console.log("✨ Image rendered successfully!");
      };

      // Handle cases where the image URL might be broken
      img.onerror = () => {
        loader.style.display = "none";
        alert("The AI node is busy. Please try a different prompt in 10 seconds!");
      };
    } else {
      throw new Error("No image data received from API");
    }

  } catch (error) {
    loader.style.display = "none";
    console.error("Fetch Error:", error);
    alert("Connection error! Make sure you are running 'netlify dev' or the site is deployed.");
  }
}

// Fixed Toggle Mode Function
function toggleTheme() {
  document.body.classList.toggle("dark");
  
  const btn = document.querySelector(".toggle");
  if (document.body.classList.contains("dark")) {
    btn.innerHTML = "☀️ Light Mode";
  } else {
    btn.innerHTML = "🌙 Toggle Mode";
  }
}