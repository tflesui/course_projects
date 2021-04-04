// API URL
const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

    // Functions to display user data
// Build the user element
const renderUser = user => {
    // create user element
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
    // attach user object to the element
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
      <img src="${photo.thumbnailUrl}" />
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

// Fetch comments for post then attach to the post
const setCommentsOnPost = post => {
    // if comments exist, don't fetch them
    if (post.comments) {
        // reject the promise
        return Promise.reject(null);
    }

    // fetch and upgrade the post object, then return it
    return fetchPostComments(post.id)
            .then( comments => {
                // if fetch is successful, attach comments to post and return it
                post.comments = comments;
                return post;
            });
}

// Toggling comments
const toggleComments = postCardElement => {
    const footerElement = postCardElement.find('footer');

    if (footerElement.hasClass('comments-open')) {
        footerElement.removeClass('comments-open');
        footerElement.find('.verb').text('show');
    } else {
        footerElement.addClass('comments-open');
        footerElement.find('.verb').text('hide');
    }
}

// Render Posts
const renderPost = post => {
    // create the element
    const element = $(`<div class="post-card">
                            <header>
                                <h3>${post.title}</h3>
                                <h3>---${post.user.name}</h3>
                            </header>
                            <p>${post.body}</p>
                            <footer>
                                <div class="comment-list"></div>
                                <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
                            </footer>
                        </div>`)
    // attach post object to the element
    element.data('post', post);

    return element;
}

const renderPostList = postList => {
    $('#app section.active').removeClass('active');   
    $('#post-list').empty().addClass('active');

    postList.forEach( post => {
        const postElement = renderPost(post)
        $('#post-list').append(postElement);
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

// Function to fetch user posts
const fetchUserPosts = userId => {
    return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
}

// Function to fetch comments from a post
const fetchPostComments = postId => {
    return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
}

// Click listeners
$('#user-list').on('click', '.user-card .load-posts', function() {
    // Load posts for this user
    const userCard = $(this).closest('.user-card').data('user');
    // Render posts for this user
    fetchUserPosts(userCard.id).then( posts => {
        renderPostList(posts);
    })

});

$('#user-list').on('click', '.user-card .load-albums', function() {
    // Load albums for this user
    const userCard = $(this).closest('.user-card').data('user');
    // Render albums for this user
    fetchUserAlbumList(userCard.id).then( albumList => {
        renderAlbumList(albumList);
    });
    
});

$('#post-list').on('click', '.post-card .toggle-comments', function() {
    const postCardElement = $(this).closest('.post-card');
    const post = postCardElement.data('post');    
    const commentList = postCardElement.find('.comment-list');
  
    setCommentsOnPost(post)
      .then( post => {
        // console.log('building comments for the first time...', post);
        commentList.empty();
        post.comments.forEach( comment => {
            commentList.prepend($(`<h3>${comment.body} | ${comment.email}</h3>`));
        });
        toggleComments(postCardElement);
      })
      .catch( () => {
        // console.log('comments previously existed, only toggling...', post);
        toggleComments(postCardElement);
      });
  });

bootstrap();

