// API URL
const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

    // Functions to display user data
// Build the user element
const renderUser = user => {
    
    const element = $(`<div class="user-card">
                <header>
                    <h2>${ user.name }</h2>
                </header>
                <section class="company-info">
                    <p><b>Contact:</b> ${ user.email }</p>
                    <p><b>Works for:</b> ${ user.company.name }</p>
                    <p><b>Company creed:</b> ${ user.company.catchPhrase }</p>
                </section>
                <footer>
                    <button class="load-posts">POSTS BY ${ user.username }</button>
                    <button class="load-albums">ALBUMS BY ${ user.username }</button>
                </footer>
            </div>`);

    element.data('user', user);

    return element;
}

// Display each element on the page
const renderUserList = userList => {
    $('#user-list').empty();

    userList.forEach( user => {
        const userElement = renderUser(user);
        $('#user-list').append(userElement);
    });
}

    // Functions to load and show user albums
// Render a single album
const renderAlbum = album => {
    console.log(album);
    const element = $(`<div class="album-card">
                        <header>
                            <h3>${album.title}, by ${album.user.name} </h3>
                        </header>
                        <section class="photo-list"></section>
                    </div>`);
    
    const photoList = element.find('.photo-list');
    
    album.photos.forEach( photo => {
        const photoElement = renderPhoto(photo);
        photoList.append(photoElement);
    });

    return element;
}

// Render a single photo
const renderPhoto = photo => {
    return $(`<div class="photo-card">
    <a href="${photo.url}" target="_blank">
      <img src="${photo.thumbnailUrl}">
      <figure>${photo.title}</figure>
    </a>
  </div>`);
}

// Render an array of albums
function renderAlbumList(albumList){
    $('#app section.active').removeClass('active');   
    $('#album-list').empty().addClass('active');

    albumList.forEach( album => {
        const albumElement = renderAlbum(album)
        $('#album-list').append(albumElement);
    });
}

// Helper functions
const fetchData = url => {
    return fetch(url)
                .then( res => {
                    return res.json()
                })
                .catch( error => {
                    console.error(error);
                })
}

// Function to fetch users
const fetchUsers = () => {
    return fetchData(`${BASE_URL}/users`);
}

// Get an album list, or array of albums
const fetchUserAlbumList = userId => {
    return  fetchData(`${BASE_URL}/users/${userId}/albums?_expand=user&_embed=photos`);    
}

const bootstrap = () => {
    fetchUsers().then( data => {
        renderUserList(data);
    });
}

// Click listeners
$('#user-list').on('click', '.user-card .load-posts', function() {
    // Load posts for this user
    const userCard = $(this).closest('.user-card').data('user');
    console.log(userCard.username);
    // Render posts for this user

});


$('#user-list').on('click', '.user-card .load-albums', function() {
        // Load albums for this user
    const userCard = $(this).closest('.user-card').data('user');
    fetchUserAlbumList(userCard.id).then( albumList => {
        renderAlbumList(albumList);
    });


    // Render albums for this user

});

bootstrap();

