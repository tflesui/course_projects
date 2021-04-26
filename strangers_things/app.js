const BASE_URL = 'https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT';

let POST_ID = '';

// Get user data
const getUser = async () => {
    const TOKEN_STRING = localStorage.getItem('token');
    // console.log(TOKEN_STRING);
    try{
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(TOKEN_STRING)}`
            },
        });
        // console.log(response);
        const data = await response.json();
        return data;
    } catch(err) {
        console.error(err);
    }

}
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
const renderPosts = posts => {
    posts.forEach( post => {
        const postElement = createPostHTML(post);
        $('#postsContainer').append(postElement);
    });
}


const createPostHTML = post => {
    const token = localStorage.getItem('token');
    const {title, description, price, isAuthor} = post;
    const postElement = $(`<div class="card m-1" style="width: 18rem;" >
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Price: ${price}</h6>
                    <p class="card-text">${description}</p>
                    ${ token 
                        ? `<div class="card-body">
                            ${ !isAuthor ? `<button type="button" class="card-link btn btn-outline-primary btn-sm" id="messageBtn" data-bs-toggle="modal" data-bs-target="#messageModal">Message</button>` : '' }
                            ${ isAuthor 
                                ? `                               <button type="button" class="card-link btn btn-outline-secondary btn-sm" id="editBtn" data-bs-toggle="modal" data-bs-target="#editModal">Edit
                                </button>
                                <button type="button" class="card-link btn btn-outline-danger btn-sm" id="deleteBtn">Delete</button>`
                                : '' }
                        </div>`
                        : ''
                    }
                </div>
            </div>
    `).data('post', post);

    return postElement;
}

// Update Post
const updatePost = async ( updatedPost, postId ) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const url = `${BASE_URL}/posts/${postId}`;

    try{
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedPost)
        })
        // console.log(response);
        const result = await response.json();
        // console.log(result);
        return result;
    } catch(err) {
        console.error(err);
    }
}

$('#editModal form').on('submit', async event => {
    event.preventDefault();
    
    const postId = localStorage.getItem('postId');
    // console.log(postId);
    let willDeliver = null;
    $('#editWillDeliver').is(':checked')
        ? willDeliver = true
        : willDeliver = false;
    const postData = {
        post: {
            title: $('#edit-title').val(),
            price: $('#edit-price').val(),
            description: $('#edit-description').val(),
            location: $('#edit-location').val(),
            willDeliver: willDeliver
        }
    }
    try{
        const result = await updatePost( postData, JSON.parse(postId));
        // console.log(result);
        localStorage.removeItem('postId');
        $('body').removeClass('modal-open');
        $('.modal').css('display', 'none').attr('aria-hidden', 'true');
        $('.modal-backdrop').removeClass('show').attr('aria-hidden', 'true').css('display', 'none');
        $('#editModal').removeClass('show');
        $('form').trigger('reset');
        $('body').click();
        showHomePage();

    }catch(err){
        console.error(err);
    }
})

$(document).on('click', '#editBtn', async event => {
    event.preventDefault();
    $('#editModal').show();
    try{
        const listingElement = $(event.target).closest('.card');
        const data = listingElement.data();
        // console.log(data)
        const {post} = data;
        // console.log(post)
        const { title, price, description, location, willDeliver } = post;
        const { post: { _id } } = data;

        localStorage.setItem('postId', JSON.stringify(_id));

        $('#edit-title').val(title);
        $('#edit-price').val(price);
        $('#edit-description').val(description);
        $('#edit-location').val(location);
        if(willDeliver){
            $('#editWillDeliver').is(':checked');
        }

    // localStorage.setItem('postId', JSON.stringify(_id));

    }catch(err){
        console.error(err);
    }

})

// Delete Listing
const deleteListing = async (postId) => {
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`${BASE_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            }
        });
        const result = await response.json();
        console.log(result);
    } catch(err) {
        console.error(err);
        throw err;
    }
}

$(document).on('click', '#deleteBtn', async event => {
    event.preventDefault();
    const listingElement = $(event.target).closest('.card');
    // console.log(listingElement);
    const data = listingElement.data();
    // console.log(data);
    const { post: { _id } } = data;
    // console.log(_id);
    // console.log('clicked');

    deleteListing(_id);
    showHomePage();
})

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
        // console.log(token, message);
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

// Send Message
const sendMessage = async (messageBody, postId) => {
    const url = `${BASE_URL}/posts/${postId}/messages`;
    const token = localStorage.getItem('token');

    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify({
                message: {
                    content: `${messageBody}`
                }
            })
        });
        console.log(response);
        const { data: {message} } = await response.json();
        console.log(message);
        return message;
    } catch(err) {
        console.error(err);
    }
}


$('#messageModal form').on('submit', async event => {
    event.preventDefault();

    const postId = localStorage.getItem('postId')
    const messageText = $('#messageBody').val();
    try {
    const result = await sendMessage(messageText, JSON.parse(postId));
    console.log(result);
    localStorage.removeItem('postId');
    $('body').removeClass('modal-open');
    $('.modal').css('display', 'none').attr('aria-hidden', 'true');
    $('.modal-backdrop').removeClass('show').attr('aria-hidden', 'true').css('display', 'none');
    $('#messageModal').removeClass('show');
    $('form').trigger('reset');
    showHomePage();
    } catch(err) {
        console.log(err);
        throw err;
    }
})

$(document).on('click', '#messageBtn', async event => {
    event.preventDefault();
    try{
    const listingElement = $(event.target).closest('.card');
    const data = listingElement.data();
    const { post: { _id } } = data;

    localStorage.setItem('postId', JSON.stringify(_id));

    }catch(err){
        console.error(err);
    }

})

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
                            <a  class="btn btn-primary" id="inboxBtn" role="button" data-bs-toggle="modal" href="#messages" aria-controls="messages">Inbox</a>
                        </div>
                        <div class="card-body">
                            <p class="card-text">See your messages to other users</p>
                            <a  class="btn btn-primary" id="outboxBtn" role="button" data-bs-toggle="modal" href="#messages" aria-controls="messages">Sent Messages</a>
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
                        <div class="modal-dialog modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="messagesLabel">Inbox</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                 <div class="modal-body">
                                    <div class="message-list">
                                        <p>messages here</p>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                        // Incoming Messages
    const getIncomingMessages = async () => {
        const data = await getUser();
        const { data: {messages} } = data;
        // const [ message ] = messages;
        // console.log(messages);
        // console.log(message);
            return renderIncomingMessages(messages);
    }

    // Template for reading messages on Account page
    const showInboxMessageHTML = message => {
        const  {fromUser:{ username:sender }} = message;
        const {post: {title}} = message;
        const {content} = message;

        const messageElement = `<div class="card text-center mb-3">
                                    <div class="card-header">                                        
                                        <h5 class="card-title">Message for listing: ${title}</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">${content}</p>
                                    </div>
                                    <div class="card-footer text-muted">
                                        <p>From ${sender}</p>
                                    </div>
                                </div>`

        return messageElement;
    }

    const renderIncomingMessages = async inboxMessages => {
        try{
            const data = await getUser();
            const { data: {_id:myId} } = data;
            const { data: {messages} } = data;

            $('.message-list').empty();
    
            inboxMessages.forEach( card => {
                const { fromUser: {_id:senderId}} = card;
                if(myId != senderId){
                    const cardElement = showInboxMessageHTML(card);
                    $('.message-list').append(cardElement);
                }
            });
        }catch(err){
            console.log(err);
        }
    }
    
    $('#inboxBtn').on('click', () => {
        getIncomingMessages();
    })
    
                        // Outgoing Messages
    const getOutgoingMessages = async () => {
        const data = await getUser();
        const { data: {messages} } = data;
        // const [ message ] = messages;
        // console.log(messages);
        // console.log(message);
            return renderOutgoingMessages(messages);
    }

    // Template for reading messages on Account page
    const showOutboxMessageHTML = message => {
        // const  {fromUser:{ username:sender }} = message;
        const {post: {title}} = message;
        const {content} = message;

        const messageElement = `<div class="card text-center mb-3">
                                    <div class="card-header">                                        
                                        <h5 class="card-title">Listing: ${title}</h5>
                                    </div>
                                    <div class="card-body">
                                        <h6>Message:</h6>
                                        <p class="card-text">${content}</p>
                                    </div>
                                </div>`

        return messageElement;
    }

    const renderOutgoingMessages = async outboxMessages => {
        try{
            const data = await getUser();
            const { data: {_id:myId} } = data;
            const { data: {messages} } = data;

            $('.message-list').empty();
    
            outboxMessages.forEach( card => {
                const { fromUser: {_id:senderId}} = card;
                if(myId === senderId){
                    const cardElement = showOutboxMessageHTML(card);
                    $('.message-list').append(cardElement);
                }
            });
        }catch(err){
            console.log(err);
        }
    }
    
    $('#outboxBtn').on('click', () => {
        getOutgoingMessages();
    })
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
    const postId = localStorage.getItem('postId');

    if(postId){
        localStorage.removeItem('postId');
    }

    if(token) {
        $('#registerNav').css('display', 'none');
        $('#loginNav').css('display', 'none');
        $('#logoutNav').show();
        $('#myAccountContainer').empty();
        $('#postsContainer').empty();
        $('body').removeClass('offcanvas-backdrop');
        $('body').click();
        $('#homePageNav').addClass('active');
        $('#myAccountNav').removeClass('disabled').removeClass('active');
        
        fetchPosts();
    } else {
        $('#myAccountContainer').empty();
        $('#postsContainer').empty();
        $('#logoutNav').css('display', 'none');
        fetchPosts();
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
(async () => {
    showHomePage();
})();