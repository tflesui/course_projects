const BASE_URL = 'https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT';


// Grab posts from API
const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        });
        const {data} = await response.json();
        const {posts} = data;
    
        return  renderPosts(posts);
    } catch (error) {
        console.error(error)
    }
}

// Render all posts on page
const renderPosts = (posts) => {
    posts.forEach( post => {
        const postElement = createPostHTML(post);
        $('#postsContainer').append(postElement);
    });
}

const createPostHTML = post => {
    const token = localStorage.getItem('token');
    const {title, description, price, isAuthor} = post;
    const postElement = `<div class="card m-1" style="width: 18rem;" >
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Price: ${price}</h6>
                    <p class="card-text">${description}</p>
                    ${ token 
                        ? `<div class="card-body">
                            ${ !isAuthor ? `<a href="#" class="card-link btn btn-primary btn-sm" role="button">Message</a>` : '' }
                            ${ isAuthor 
                                ? `<a href="#" class="card-link btn btn-secondary btn-sm" role="button">Edit</a>
                                <a href="#" class="card-link btn btn-danger btn-sm" role="button">Delete</a>` 
                                : '' }
                        </div>`
                        : ''
                    }
                </div>
            </div>
    `

    return postElement;
}

// Template for reading messages on Account page
const createMessageHTML = message => {
    const {content, post, createdAt} = message;

    const messageElement = `<div class="card text-center">
                                <div class="card-header">
                                    Message for listing: ${post}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Special title treatment</h5>
                                    <p class="card-text">${content}</p>
                                    <a href="#" class="btn btn-primary">Go somewhere</a>
                                </div>
                                <div class="card-footer text-muted">
                                    ${createdAt}
                                </div>
                            </div>`

    return messageElement;
}

// Sign Up functionality
const registerUser = async (username, password) => {
    const url = `${BASE_URL}/users/register`;
    // Make POST request to API and get back token
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password
                }
            })
        });
        console.log(response);
        const { data: { token, message } } = await response.json();
        console.log(token, message);
        // Store token in Local Storage
        localStorage.setItem("token", JSON.stringify(token));

        // hideRegistration();
    } catch (error) {
        console.error(error);
    }
}

$('#registerModal form').on('submit', event => {
    event.preventDefault();

    const username = $('#registerInputUsername').val();
    const password = $('#registerInputPassword').val();

    registerUser(username, password);  

    $('.modal').css('display', 'none').attr('aria-hidden', 'true');
    $('.modal-backdrop').removeClass('show').attr('aria-hidden', 'true').css('display', 'none');

});

// Login functionality
const loginUser = async (usernameValue, passwordValue) => {
    const url = `${BASE_URL}/users/login`;
    // Make POST request to API and get back token
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                user: {
                    username: usernameValue,
                    password: passwordValue
                }
            })
        });
        const { data: { token, message } } = await response.json();
        console.log(token, message);
        // Store token in Local Storage
        localStorage.setItem("token", JSON.stringify(token));
        // Remove Sign Up link 
        $('#registerNav').css('display', 'none');    
        // Change Login link to Logout
        $('#loginNav').css('display', 'none');
        $('body').removeClass('modal-open');
        $('#postsContainer').empty();
        showHomePage();
    } catch (error) {
        console.error(error);
    }
    
}

$('#loginModal form').on('submit', event => {
    event.preventDefault();

    const username = $('#loginInputUsername').val();
    const password = $('#loginInputPassword').val();

    loginUser(username, password);  

    $('.modal').css('display', 'none').attr('aria-hidden', 'true');
    $('.modal-backdrop').removeClass('show').attr('aria-hidden', 'true').css('display', 'none');

    
    $('#myAccountNav').removeClass('disabled').removeClass('active');
    $('#logoutNav').show();
});


// Display My Account
const showMyAccount = async () => {
    try{
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(token)}`
        }
        });
        const data = await response.json();
        const {data: {username}} = data;
        getUserMessages();
        const accountPage = `
                    <h2 class="d-flex justify-content-end">Welcome, ${username}!</h2>
                    <div class="card mb-3 mt-3">
                        <div class="card-header">
                            <h5 class="card-title d-flex justify-content-center">Create Listing</h5>
                        </div>
                        <div class="card-body">
                            <h6>Something to sell?</h6>
                            <p class="card-text">Hit Start to create a new listing.</p>
                            <a  class="btn btn-primary" role="button" data-bs-toggle="offcanvas" href="#listingEntry" aria-controls="listingEntry">Start</a>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="card-header d-flex justify-content-center">
                            <h5 class="card-title">Messages</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">See what other users have to say to you</p>
                            <a  class="btn btn-primary" role="button" data-bs-toggle="modal" href="#messages" aria-controls="messages">Show messages</a>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title d-flex justify-content-center">My Listings</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">See your posted listings.</p>
                            <a  class="btn btn-primary" role="button" data-bs-toggle="offcanvas" href="#listingEntry" aria-controls="listingEntry">Show listings</a>
                        </div>
                    </div>
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="listingEntry" aria-labelledby="listingEntryLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="listingEntryLabel">Create a Listing</h5>
                            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <div>
                            Please fill out this form to create a listing that will be posted to the Stranger's Things marketplace.
                            </div>
                            <div class="dropdown mt-3">
                                <form>
                                    <div class="mb-3 mt-4">
                                        <label for="listing-title" class="form-label">Listing Title</label>
                                        <input type="text" class="form-control" name="" id="listing-title" required>
                                    </div>
                                    <div class="input-group mb-3">
                                        <label for="listing-price" class="form-label"></label>
                                        <span class="input-group-text">$</span>
                                        <input type="text" class="form-control" id="listing-price" aria-label="Amount (to the nearest dollar)" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="listing-description" class="form-label">Description</label>
                                        <textarea class="form-control"  id="listing-description" required></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="listing-location" class="form-label">Location</label>
                                        <input type="text" class="form-control" name="" id="listing-location">
                                    </div>
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" value="" id="willDeliver">
                                        <label class="form-check-label" for="willDeliver">
                                            Willing to deliver?
                                        </label>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="messages" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="messagesLabel">Message</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                 <div class="modal-body">
                                    <p>messages here</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Understood</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
        

        if(token) {
            $('#registerNav').css('display', 'none');
            $('#myAccountNav').removeClass('disabled').addClass('active');
            $('#logoutNav').show();
            $('#homePageNav').removeClass('active');
            $('#postsContainer').empty();
            $('#myAccountContainer').empty();
            $('#myAccountContainer').append(accountPage);
        } else {
            $('#myAccountNav').addClass('disabled');
            $('#logoutNav').css('display', 'none');
        }
    } catch(err) {
        console.error(err);
    }

    $('form').on('submit', e => {
        e.preventDefault();

        const listingTitle = $('#listing-title').val();
        const listingDesc = $('#listing-description').val();
        const listingPrice = $('#listing-price').val();
        const listingLoc = $('#listing-location').val();
        let willDeliver = null;
        $('#willDeliver').is(':checked')
            ? willDeliver = true 
            :willDeliver = false;             
            
        const listingBody = {
            title: listingTitle,
            description: listingDesc,
            price: listingPrice,
            location: listingLoc,
            willDeliver: willDeliver
        }
        
        postListing(listingBody);
        $('#postsContainer').empty();
        showHomePage();
    });
}

const getUserMessages = async () => {
    const {messages} = await getUser();

    return messages;
    // if(messages){
    // messageElement = ` 
    //         <div class="modal fade" id="messages" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    //             <div class="modal-dialog">
    //                 <div class="modal-content">
    //                     <div class="modal-header">
    //                     <h5 class="modal-title" id="messagesLabel">Message</h5>
    //                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //                     </div>
    //                     <div class="modal-body">
    //                     ${ messages.forEach(message => {
    //                         `<p>${message}</p>`
    //                     })}
    //                     </div>
    //                     <div class="modal-footer">
    //                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    //                     <button type="button" class="btn btn-primary">Understood</button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    // `
    // } else {
    //     messageElement = ` 
    //         <div class="modal fade" id="messages" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    //             <div class="modal-dialog">
    //                 <div class="modal-content">
    //                     <div class="modal-header">
    //                     <h5 class="modal-title" id="messagesLabel">Message</h5>
    //                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //                     </div>
    //                     <div class="modal-body">
    //                     <p>No messages to display</p>
    //                     </div>
    //                     <div class="modal-footer">
    //                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Done</button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    // `
    // }
}

const postListing = async (listingBody) => {
    const token = localStorage.getItem('token');
    try {
        const request = await fetch(`${BASE_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify({
                post: listingBody
            })
        })
        console.log(request);
    } catch(err) {
        console.error(err);
    }
}

const showHomePage = () => {
    const token = localStorage.getItem('token');

    if(token) {
        $('#registerNav').css('display', 'none');
        $('#loginNav').css('display', 'none');
        $('#logoutNav').show();
        $('#myAccountContainer').empty();
        fetchPosts();
        $('#homePageNav').addClass('active');
        $('#myAccountNav').removeClass('disabled').removeClass('active');
    } else {
        $('#myAccountContainer').empty();
        $('#postsContainer').empty();
        $('#logoutNav').css('display', 'none');
        fetchPosts();
    }
}

// Get user data
const getUser = async () => {
    const TOKEN_STRING = localStorage.getItem('token');
    console.log(TOKEN_STRING);
    try{
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(TOKEN_STRING)}`
            },
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(err) {
        console.error(err);
    }


}

// Logout User
const logoutUser = () => {
    localStorage.removeItem('token');
    $('#registerNav').show();
    $('#loginNav').show();
    $('#logoutNav').css('display', 'none');
    
    $('#myAccountNav').addClass('disabled').removeClass('active');
}

$('#logoutNav').on('click', () => {
    logoutUser();
    showHomePage();
})

$('#myAccountNav').on('click', () => {
    showMyAccount();
});

$('#homePageNav').on('click', () => {
    $('#postsContainer').empty();
    showHomePage();
});

// fetchPosts();
showHomePage();