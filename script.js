// A: Globals
// 1. Constants
const API_URL = "http://localhost:3000";
const endpoint = "films";

// 2. State
const state = {
  firstMovieData: undefined,
  movieListData: [],
};
const stateKeys = {
  firstMovieData: "firstMovieData",
  movieListData: "movieListData",
};

// 3. State update functions
function setState(name, newState) {
  state[name] = newState;
}

function getState(name) {
  return state[stateKeys[name]];
}

// 3. DOM elements
const firstMovieCardEl = document.querySelector(".first-movie div.movie");
const movieListEl = document.querySelector(".movie-list");

// Steps to get the app working
showFirstMovieDetails();
showMovieMenu();

// B: Helper functions
async function showFirstMovieDetails() {
  // Get movie details from API
  const movieData = await getMovie(1);
  // Update firstMovieData state
  setState(stateKeys.firstMovieData, movieData);
  // Render new state data
  renderFirstMovie(getState("firstMovieData"));
}

async function getMovie(movieId) {
  const movieData = await fetchMovie(movieId);
  return movieData;
}

async function fetchMovie(id) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json(); // Parse the data as JSON
    return data;
  } catch (error) {
    console.error(`There was a problem with your fetch operation: ${error}`);
  }
}

function renderFirstMovie(data) {
  const firstMovieCardPosterEl = firstMovieCardEl.querySelector("img");
  const firstMovieCardTitleEl = firstMovieCardEl.querySelector(".title");
  const firstMovieCardRuntime = firstMovieCardEl.querySelector(".runtime");
  const firstMovieCardShowtime = firstMovieCardEl.querySelector(".showtime");
  const firstMovieCardAvailableTickets =
    firstMovieCardEl.querySelector(".available-tickets");

  firstMovieCardPosterEl.setAttribute("src", data.poster);
  firstMovieCardPosterEl.setAttribute("alt", data.title);
  firstMovieCardTitleEl.textContent = `Title: ${data.title}`;
  firstMovieCardRuntime.textContent = `Runtime: ${data.runtime} mins`;
  firstMovieCardShowtime.textContent = `Showtime: ${data.showtime}`;

  const availableTickets = data.capacity - data.tickets_sold;
  firstMovieCardAvailableTickets.textContent = `Available Tickets: ${availableTickets}`;
}

async function showMovieMenu() {
  // Get movie menu data
  const movieListData = await getMovies();
  // Update state
  setState(stateKeys.movieListData, movieListData);
  // Render movie menu
  renderMovieMenu(getState(stateKeys.movieListData));
}

async function getMovies() {
  // Make GET request to API
  const moviesListData = await fetchMovies();
  return moviesListData;
}

async function fetchMovies() {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json(); // Parse the data as JSON
    return data;
  } catch (error) {
    console.error(`There was a problem with your fetch operation: ${error}`);
  }
}

function renderMovieMenu(data) {
  const fragmentEl = document.createDocumentFragment();
  // Create menu item for each element in array
  const menuIitemListEl = data.map((movieData) => createMenuItemEl(movieData));
  // Clear movie menu html element in preparation for new render
  clearMovieMenu();
  // Display new data
  for (const menuItemEl of menuIitemListEl) {
    fragmentEl.appendChild(menuItemEl);
  }
  movieListEl.appendChild(fragmentEl);
}

function createMenuItemEl(movieData) {
  const movieEl = document.createElement("li");
  movieEl.classList.add("movie");

  const moviePosterEl = document.createElement("img");
  moviePosterEl.setAttribute("src", movieData.poster);
  moviePosterEl.classList.add("poster");
  movieEl.appendChild(moviePosterEl);

  const movieTitleEl = document.createElement("h5");
  movieTitleEl.classList.add("title");
  movieTitleEl.textContent = movieData.title;
  movieEl.appendChild(movieTitleEl);

  return movieEl;
}

function clearMovieMenu() {
  movieListEl.innerHTML = null;
}
