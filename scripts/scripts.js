
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
        // handle success
        console.log(response);
        console.log(response.data);
        console.log(response.data.data);
        const movies = response.data.data.movies;
        movies.map(movie => {
            console.log(movie.torrents)
            let quality2160;
            let quality1080;
            let quality720;
            let quality3D;
            movie.torrents.map(item => {
                console.log(item.quality)
                if (item.quality === "2160p") {
                    quality2160 = item.quality;
                }
                if (item.quality === "1080p") {
                    quality1080 = item.quality;
                }
                if (item.quality === "720p") {
                    quality720 = item.quality;
                }
                if (item.quality === "3D") {
                    quality3D = item.quality;
                }
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
            <div class="movie-card">
                <div class="movie-card__top">
                    <img class="movie-card__top-image" src="${poster}" alt="No image for: ${movie.title}">
                    <div class="movie-card__top-quality">
                    <span class="movie-card__top-quality-item">${quality1080}</span>
                    <span class="movie-card__top-quality-item">${quality720}</span>
                    <span class="movie-card__top-quality-item">${quality3D}</span>
                    <span class="movie-card__top-quality-item">${quality2160}</span>
                    </div>
                    <p class="movie-card__top-summary"><span style="display: block;margin-bottom: 1rem">Summary:</span>
                    ${movie.summary}</p>
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
    spinnerLargeBlock();
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
                    <p class="movie-card__top-summary"><span style="display: block;margin-bottom: 1rem">Summary:</span>${movie.summary}</p>
                </div>
                <div class="movie_card__details">
                    <h3 class="movie_card__details-title">${movie.title}</h3>
                    <span class="movie_card__details-rate" style="color: ${rateColor}; border-color: ${rateColor}">${movie.rating}</span>
                </div>
            </div>
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
searchForm.addEventListener('submit', () => {
    if (SearchInput.value) {
        SearchInput.style.borderColor = '#aaa';
        onFormSubmitHandler(SearchInput.value)
    } else {
        SearchInput.style.borderColor = 'red';
    }

})