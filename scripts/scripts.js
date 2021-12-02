
const moviesContainer = document.querySelector('.movies');
const resultsPreview = document.querySelector('#resultsPreview');
const searchForm = document.querySelector('#searchForm');
const spinner = document.querySelector('#spinner');
const spinnerLarge = document.querySelector('#spinnerLarge');


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

spinnerLargeBlock();
axios.get('https://yts.mx/api/v2/list_movies.json?sort_by=like_count')
    .then(function (response) {
        spinnerLargeNone();
        // handle success
        console.log(response.data.data);
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

            let rateColor
            if (parseFloat(movie.rating) >= 7) {
                rateColor = "green"
            } else if (parseFloat(movie.rating) >= 5) {
                rateColor = "orange"
            } else {
                rateColor = "red"
            }
            moviesContainer.innerHTML += `
            <div class="movie-card">
                <div class="movie-card__top">
                    <img class="movie-card__top-image" src="${poster}" alt="No image for: ${movie.title}">
                    <span class="movie-card__top-quality">
                        web 1080p
                    </span>
                    <p class="movie-card__top-summary">${movie.summary}</p>
                </div>
                <div class="movie_card__details">
                    <h3 class="movie_card__details-title">${movie.title}</h3>
                    <span class="movie_card__details-rate" style="color: ${rateColor}; border-color: ${rateColor}">${movie.rating}</span>
                </div>
            </div>
            `
        })
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });

const inputOnChangeHandler = (term) => {
    axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${term}&order_by=asc&limit=10`)
        .then(function (response) {
            resultsPreview.innerHTML = '';
            spinnerNone();

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

                    let rateColor
                    if (parseFloat(movie.rating) >= 7) {
                        rateColor = "green"
                    } else if (parseFloat(movie.rating) >= 5) {
                        rateColor = "orange"
                    } else {
                        rateColor = "red"
                    }
                    resultsPreview.innerHTML += `
                <div class="preview-card">
                    <img class="preview-card__image" src="${poster}" alt="No image for: ${movie.title}">
                    <h5 class="preview-card__title">${movie.title}</h5>
                </div>
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
        })
        .then(function () {
            // always executed
        });
}

const SearchInput = document.querySelector('#SearchInput');

let timer;
SearchInput.addEventListener('keyup', (e) => {
    const text = e.target.value;
    spinnerBlock();

    if (text.length > 0) {
        resultsPreview.classList.add('show-results-box')

        clearTimeout(timer);

        timer = setTimeout(() => {
            inputOnChangeHandler(text)
        }, 1000);

    } else {
        resultsPreview.classList.remove('show-results-box');
        spinnerNone();
    }

})

const onFormSubmitHandler = (term) => {
    axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${term}&order_by=asc&limit=20`)
        .then(function (response) {
            resultsPreview.classList.remove('show-results-box')
            moviesContainer.innerHTML = '';

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

                    let rateColor
                    if (parseFloat(movie.rating) >= 7) {
                        rateColor = "green"
                    } else if (parseFloat(movie.rating) >= 5) {
                        rateColor = "orange"
                    } else {
                        rateColor = "red"
                    }
                    moviesContainer.innerHTML += `
            <div class="movie-card">
                <div class="movie-card__top">
                    <img class="movie-card__top-image" src="${poster}" alt="No image for: ${movie.title}">
                    <span class="movie-card__top-quality">
                        web 1080p
                    </span>
                    <p class="movie-card__top-summary">${movie.summary}</p>
                </div>
                <div class="movie_card__details">
                    <h3 class="movie_card__details-title">${movie.title}</h3>
                    <span class="movie_card__details-rate" style="color: ${rateColor}; border-color: ${rateColor}">${movie.rating}</span>
                </div>
            </div>
            `
                })
            }

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
searchForm.addEventListener('submit', () => {
    if (SearchInput.value) {
        onFormSubmitHandler(SearchInput.value)
    } else {
        console.log('please enter a name')
    }

})