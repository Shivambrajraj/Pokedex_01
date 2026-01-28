const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const container = document.getElementById("pokemon-container");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("modal-close-btn");
const backListBtn = document.getElementById("back-list-btn");
const homeBtn = document.getElementById("home-btn")

homeBtn.addEventListener("click" , () =>{
  window.location.reload();
});

// for API

async function fetchPokemonList() {
  try{
    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML="";  //this is used when we run function many times

    for(const pokemon of data.results){
      try{
        const res = await fetch(pokemon.url);
        const details = await res.json();

       createPokemonCard(details.name, details.id, details.types); //by checking the API response sructure;
      }
      catch(error){
        console.error("Failed to load:", pokemon.name);
      }
    }
  }
   
  catch (error) {
  console.error(error); // for seeing exact error
  container.innerHTML = "<p style='text-align:center;'>Failed to load Pokémon</p>";
  }
}


// Create Pokémon Card

function createPokemonCard(name, id, types) {
  const card = document.createElement("div");
  card.className = "card";
  const primaryType = types[0].type.name;
  card.dataset.type = primaryType;

  const typeHTML = types 
    .map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`)
    .join("");

   card.innerHTML = `
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
    <h3>${name.toUpperCase()}</h3>
    <div class="types">${typeHTML}</div>
  `;

  card.addEventListener("click", () => showPokemonDetail(name));

 container.appendChild(card);
}


// Show Pokémon Details in Modal

async function showPokemonDetail(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error();

    const data = await response.json();
    displayModal(data);
  } catch {
    alert("Pokémon not found!");
  }
}


/*called this function after data is fetched*/

function displayModal(data) {
  const typeHTML = data.types
    .map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`)
    .join("");

  modalBody.innerHTML = `
    <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
    <h2 style="text-align:center; padding-bottom:7px;">${data.name.toUpperCase()}</h2>

    <div class="types" style="padding-bottom:7px;">${typeHTML}</div>

    <p><strong>Height:</strong> ${data.height}</p>
    <p><strong>Weight:</strong> ${data.weight}</p>
    <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>

    <h3 style="padding-top:5px;">Stats</h3>
    <ul>
      ${data.stats.map(s => `<li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>`).join("")}
    </ul>
  `;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden"; // prevent scrolling
}


// Close Modal

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});


//back list button

backListBtn.addEventListener("click", () => {
  searchInput.value = "";             
  backListBtn.style.display = "none"; 
  fetchPokemonList();                  
});


// Search Pokémon

searchBtn.addEventListener("click", async () => {
  const value = searchInput.value.trim().toLowerCase();
  if (!value) return;

  backListBtn.style.display = "inline-block"; 

  container.innerHTML = "<p style='text-align:center;'>Searching Pokémon...</p>";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
    if (!response.ok) throw new Error();

    const details = await response.json();
    container.innerHTML = "";
    createPokemonCard(details.name, details.id, details.types);
  } catch {
    container.innerHTML = "<p style='text-align:center;'>Pokémon not found!</p>";
  }
});

fetchPokemonList();
