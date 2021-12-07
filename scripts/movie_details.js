const fetchMovies = (text) => {
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