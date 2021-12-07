
const moviesContainer = document.querySelector('.movies');
const resultsPreview = document.querySelector('#resultsPreview');
const searchForm = document.querySelector('#searchForm');
const spinner = document.querySelector('#spinner');
const spinnerLarge = document.querySelector('#spinnerLarge');
const main = document.querySelector('main');


// TODO: add the backdrop to the screen when the input is active  and delete it when its not active
// TODO: when user clicks on a movie page refreshes. why?


const spinnerNone = () => {
    spinner.style.display = "none";
}
const spinnerBlock = () => {
    spinner.style.display = "block";
}

const spinnerLargeNone = () => {
    spinnerLarge.style.display = "none";
}
const spinnerLargeBlock = () => {
    spinnerLarge.style.display = "block";
}


const fetchMovies = (url) => {
    spinnerLargeBlock();
    axios.get(url)
        .then(function (response) {
            resultsPreview.classList.remove('show-results-box')
            moviesContainer.innerHTML = '';

            // handle success
            console.log(response.data.data);

            if (response.data.data.movies) {
                const movies = response.data.data.movies;
                movies.map(movie => {
                    let qualities = [];
                    movie.torrents.map(item => {
                        // console.log(item.quality)
                        qualities += `<span class="movie-card__top-quality-item">${item.type} ${item.quality}</span>`
                    })

                    let genres = [];
                    movie.genres.map(item => {
                        // console.log(item.quality)
                        genres += `<span>${item}</span>`
                    })

                    let poster = 'images/ironman1.jpg'
                    if (movie.large_cover_image) {
                        poster = movie.large_cover_image
                    } else if (movie.medium_cover_image) {
                        poster = movie.medium_cover_image
                    } else if (movie.small_cover_image) {
                        poster = movie.small_cover_image
                    } else {
                        poster = 'images/ironman1.jpg'
                    }

                    let rateColor
                    if (parseFloat(movie.rating) >= 7) {
                        rateColor = "green"
                    } else if (parseFloat(movie.rating) >= 5) {
                        rateColor = "orange"
                    } else {
                        rateColor = "red"
                    }
                    moviesContainer.innerHTML += `
                    <a href="?id=${movie.id}">
                        <div class="movie">
                            <img class="movie-img" src="${poster}" alt="${movie.title}">
                                <div class="movie-name">
                                    <h3>${movie.title_long}</h3>
                                </div>
                                <div class="movie-rate">
                                    <span>IMDB: ${movie.rating}</span>
                                </div>
                            <div class="movie-details">
                                <h4 class="movie-details__title">summary:</h4>
                                <p class="movie-details__text">${movie.summary}</p>
                                <div class="movie-details__genres">
                                    <h4>Genres: </h4>
                                    <div class="movie-details__genres-items">
                                        ${genres}
                                    </div>
                                </div>
                                <div class="movie-details__qualities">
                                    <h4>Available in: </h4>
                                    <div class="movie-details__qualities-items">
                                    ${qualities}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                    `
                })
            } else {
                moviesContainer.innerHTML += `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"> Not found, Please try something else... </div>
                `
            }

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            spinnerLargeNone();
            // always executed
        });

}
















// Movie Details
let searchParams = new URLSearchParams(window.location.search);
console.log(searchParams.has('id'))

if (searchParams.has('id') && searchParams.get('id') != '') {
    spinnerLargeBlock();
    axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${searchParams.get('id')}&with_images=true&with_cast=true`)
        .then(function (response) {
            // handle success
            const movie = response.data.data.movie;
            console.log(movie)

            let genres = [];
            movie.genres.map(genre => {
                genres += `<small class="genre">${genre}</small>`;
            })

            let torrentQualities = [];
            let torrentLinks = [];
            movie.torrents.map(link => {
                torrentQualities += `<small class="quality">${link.type} ${link.quality}</small>`;
                torrentLinks += `
                <div class="torrent-links">
                    <span class="torrent-link">${link.type} ${link.quality}: 
                        <a href="${link.url}">Download</a>
                        <span>${link.size}</span>
                    </span>
                </div>
                `
            })

            let casts = [];
            movie.cast.map(cast => {
                casts += `
                <div class="cast">
                    <div class="cast-name-container">
                        <span class="cast-name">${cast.name} <br> as <br> ${cast.character_name}</span>
                    </div>
                    <img src="${cast.url_small_image}" alt="${cast.name}">
                </div>
                `
            })

            let screenShots = [];
            if (movie.large_screenshot_image1) {
                screenShots += `<img src="${movie.large_screenshot_image1}" alt="screen"></img>`;
                if (movie.large_screenshot_image2) {
                    screenShots += `<img src="${movie.large_screenshot_image2}" alt="screen"></img>`;
                    if (movie.large_screenshot_image3) {
                        screenShots += `<img src="${movie.large_screenshot_image3}" alt="screen"></img>`;
                        if (movie.large_screenshot_image4) {
                            screenShots += `<img src="${movie.large_screenshot_image4}" alt="screen"></img>`;
                        }
                    }
                }
            }

            moviesContainer.innerHTML = `
                <div>
                <div class="movie">
                <img src="${movie.large_cover_image}" alt="ironman">
                <div class="movie__details">
                    <h3 class="movie__details-name">${movie.title}</h3>
                    <div class="movie__details-scores">
                        <span class="imdb-score">IMDB: ${movie.rating}</span>
                    </div>
                    <div class="movie__details-genres"> Genres: 
                        ${genres}
                    </div>
                    <div class="movie__details-qualities"> Available in:
                        ${torrentQualities} 
                    </div>
                    <div class="movie__details-language"> Language: 
                        <span>${movie.language}</span>
                    </div>
                    <div class="movie__details-summary">Sumary: 
                        <p class="summary">${movie.description_intro}</p>
                    </div>
                </div>
            </div>
            <div class="movie movie-casts-section">
                <h4>Cast</h4>
                <div class="movie-casts">${casts}</div>
            </div>
            <div class="movie movie-screenshots">
                <h4>Screenshots</h4>
                <div class="screenshots">${screenShots}</div>
            </div>
            <div class="movie movie-torrent">
                <h4>Torrent Links</h4>
                ${torrentLinks}
            </div>
                </div>
            `
            // })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            if (error == "Error: Network Error") {
                moviesContainer.innerHTML = `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"> Network Error, Please check your connection... </div>
            `
            }
        })
        .then(function () {
            spinnerLargeNone();
            // always executed
        });
} else {

    // Load movies on page load
    fetchMovies('https://yts.mx/api/v2/list_movies.json?sort_by=like_count');
}

// Load movies list on user type
const inputOnChangeHandler = (term) => {
    axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${term}&order_by=asc&limit=10`)
        .then(function (response) {
            resultsPreview.innerHTML = '';

            // handle success
            console.log(response.data.data);

            if (response.data.data.movies) {
                const movies = response.data.data.movies;
                movies.map(movie => {
                    let poster = 'images/ironman1.jpg'
                    if (movie.large_cover_image) {
                        poster = movie.large_cover_image
                    } else if (movie.medium_cover_image) {
                        poster = movie.medium_cover_image
                    } else if (movie.small_cover_image) {
                        poster = movie.small_cover_image
                    } else {
                        poster = 'images/ironman1.jpg'
                    }

                    resultsPreview.innerHTML += `
                        <a href="?id=${movie.id}">
                            <div class="preview-card">
                                <img class="preview-card__image" src="${poster}" alt="No image for: ${movie.title}">
                                <h5 class="preview-card__title">${movie.title}</h5>
                            </div>
                        </a>
                        `
                })
            } else {
                resultsPreview.innerHTML += `
                    <small>not found, try something else...</small>
                `
            }

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            if (error == "Error: Network Error") {
                resultsPreview.innerHTML = `
                    <small> Network Error, Please check your connection... </small>
                `
            }
        })
        .then(function () {
            spinnerNone();
            // always executed
        });
}

const searchInput = document.querySelector('#searchInput');

let timer;
searchInput.addEventListener('keyup', (e) => {
    const text = e.target.value;
    spinnerBlock();

    if ((searchInput == document.activeElement && text.length > 0)) {
        resultsPreview.classList.add('show-results-box');

        clearTimeout(timer);

        timer = setTimeout(() => {
            inputOnChangeHandler(text)
        }, 1000);

    } else {
        resultsPreview.classList.remove('show-results-box');
        spinnerNone();
    }

})


// On submit form Movies list
const onFormSubmitHandler = (term) => {

    fetchMovies(`https://yts.mx/api/v2/list_movies.json?query_term=${term}&order_by=asc&limit=20`)
}
searchForm.addEventListener('submit', () => {
    if (searchInput.value) {
        searchInput.style.borderColor = '#aaa';
        onFormSubmitHandler(searchInput.value);
        searchInput.value = '';

    } else {
        searchInput.style.borderColor = 'red';
    }

})