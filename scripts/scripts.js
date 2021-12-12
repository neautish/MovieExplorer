"use strict";


const moviesContainer = document.querySelector('.movies');
const resultsPreview = document.querySelector('#resultsPreview');
const searchForm = document.querySelector('#searchForm');
const spinner = document.querySelector('#spinner');
const spinnerLarge = document.querySelector('#spinnerLarge');
const main = document.querySelector('main');
const searchInput = document.querySelector('#searchInput');
const pages = document.querySelector('.pages');


let movieDetailsParam = new URLSearchParams(window.location.search);
let movieSearchParam = new URLSearchParams(window.location.search);



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
            console.log(response);
            console.log(response.data);
            console.log(response.data.data);
            if (response.data.data.movies) {
                const movies = response.data.data.movies;

                // if (response.data.data.movie_count > 20 && response.data.data.movie_count < 200) {
                for (let i = 1; i <= (response.data.data.movie_count > 200 ? 9 : response.data.data.movie_count / 20 + 1); i++) {
                    let url = new URL(window.location.href);
                    url.searchParams.set('page', i)
                    pages.innerHTML += `
                            <a href="${url}" class="page">${i}</a>
                        `
                }
                // }
                if (movieSearchParam.has('page')) {
                    const pageNums = document.querySelectorAll('.page');
                    for (let i = 0; i < pageNums.length; i++) {
                        if (Number(movieSearchParam.get('page')) === Number(pageNums[i].textContent)) {
                            pageNums[i].style.backgroundColor = '#215487a1';
                        }
                    }
                }


                movies.map(movie => {
                    let qualities = [];
                    movie.torrents.map(item => {
                        qualities += `<span class="movie-card__top-quality-item">${item.type} ${item.quality}</span>`
                    })

                    let genre = [];
                    movie.genres.map(item => {
                        genre += `<span>${item}</span>`
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
                            <img class="movie-img" loading="lazy" src="${poster}" alt="${movie.title}">
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
                                        ${genre}
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

}



const openSearchMovie = () => {
    document.querySelector('#searchMovie').style.height = '100%';
    document.querySelector('#searchMovie').style.width = '100%';
    document.querySelector("#searchInput").focus();
}
const closeSearchMovie = () => {
    document.querySelector('#searchMovie').style.height = '0';
    document.querySelector('#searchMovie').style.width = '0';
}

// Load movies on page load

if ((!movieDetailsParam.has('id') || movieDetailsParam.get('id') === '') && (!movieSearchParam.has('query') || movieSearchParam.get('query') === '')) {
    fetchMovies(`https://yts.mx/api/v2/list_movies.json?sort_by=like_count&page=${movieSearchParam.get('page')}`);
    // TODO: add page=1 to the url when the first time page loads
}
if (movieSearchParam.has('query') && movieSearchParam.get('query') != '') {
    fetchMovies(`https://yts.mx/api/v2/list_movies.json?query_term=${movieSearchParam.get('query')}&order_by=asc&limit=20&page=${movieSearchParam.get('page')}`)
}


// Movie Details page
if (movieDetailsParam.has('id') && movieDetailsParam.get('id') != '') {
    spinnerLargeBlock();
    axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieDetailsParam.get('id')}&with_images=true&with_cast=true`)
        .then(function (response) {
            // handle success
            const movie = response.data.data.movie;

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


            let screenShots = ``;
            if (movie.large_screenshot_image1) {
                screenShots += `<a><img src="${movie.large_screenshot_image1}" alt="screen"></img></a>`;
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
                <div class="movie-page">
                <img src="${movie.large_cover_image}" alt="ironman">
                <div class="movie-page__details">
                    <h3 class="movie-page__details-name">${movie.title}</h3>
                    <div class="movie-page__details-scores">
                        <span class="imdb-score">IMDB: ${movie.rating}</span>
                    </div>
                    <div class="movie-page__details-genres"> Genres: 
                        ${genres}
                    </div>
                    <div class="movie-page__details-qualities"> Available in:
                        ${torrentQualities} 
                    </div>
                    <div class="movie-page__details-language"> Language: 
                        <span>${movie.language}</span>
                    </div>
                    <div class="movie-page__details-summary">Sumary: 
                        <p class="summary">${movie.description_intro}</p>
                    </div>
                </div>
            </div>
            <div class="movie-page movie-casts-section">
                <h4>Cast</h4>
                <div class="movie-casts">${casts}</div>
            </div>
            <div class="movie-page movie-screenshots">
                <h4>Screenshots</h4>
                <div class="screenshots">${screenShots}</div>
            </div>
            <div class="movie-page movie-torrent">
                <h4>Torrent Links</h4>
                ${torrentLinks}
            </div>
                </div>
            `
            // })
        })
        .catch(function (error) {
            // handle error
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
}


// Load movies list on user type
const inputOnChangeHandler = (term) => {
    axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${term}&order_by=asc&limit=20`)
        .then(function (response) {
            resultsPreview.innerHTML = '';

            // handle success

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


// Show results on typing
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

// On form submit
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (searchInput.value) {
        window.location.search = `query=${searchInput.value}&page=1`; // or param=new_value
        searchInput.style.borderColor = '#aaa';
        searchInput.value = '';
        closeSearchMovie();
    } else {
        searchInput.style.border = '2px solid red';
    }
})
