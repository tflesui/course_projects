// Global declarations
let allTodos; 

function createElementFromTodo(todo) {
    // Builds an element and returns it
    const title = todo['title'],
        dueDate = todo['dueDate'],
        description = todo['description'],
        isComplete = todo['isComplete'];

    return $(`<div class="todo">
            <h3><span class="title">${title}</span><span class="due-date">${dueDate} 3:23:56 PM</span></h3>
            <pre>${description}</pre>
            <footer class="actions">
            ${
                 isComplete 
                 ? ''
                 : '<button class="action complete">Complete</button>'
            }
            <button class="action delete">Delete</button>
            </footer>
            </div>`).data('todo', todo);

};

function renderTodos() {
    // Clear all todos on page
    $('main .content').empty();
    // Display Todo in appropriate column
    pendingTodos.forEach( myTodo => {
        const pendingTodo = createElementFromTodo( myTodo );
        $('.pending-todos').append(pendingTodo);
    })

    completedTodos.forEach( myTodo => {
        const completedTodo = createElementFromTodo( myTodo );
        $('.completed-todos').append(completedTodo);
    })

    expiredTodos.forEach( myTodo => {
        const expiredTodo = createElementFromTodo( myTodo );
        $('.expired-todos').append(expiredTodo);
    })
};


// Left Drawer click listener
$('.left-drawer').click( function() {
   $( this ).toggleClass('drawer-open');
   $('#app').toggleClass('drawer-open');
});

// Add Todo button click listener
$('.add-todo').click( () => {
    $('.modal').addClass('open');
});

// Remove Completed Todo click listener
$('.remove-completed').click( () => {
    remainingTodos = allTodos.filter( todo => {
        return !todo.isComplete;
    });
    allTodos = remainingTodos;
    updatePage();
});

// Remove Expired Todo click listener
$('.remove-expired').click( () => {
    remainingTodos = allTodos.filter( todo => {
        return isCurrent(todo);
    });
    allTodos = remainingTodos;
    updatePage();
});

// Create & Cancel Modal button click listener
$('.create-todo, .cancel-create-todo').click( () => {
    $('.modal').removeClass('open');
});

// Completed button click listener
$('main').on('click', '.action.complete', function() {
    // Grab parent element
    const completedTodo = $(this).closest('.todo');
    // Grab object from todo that was clicked (child element)
    const myTodo = completedTodo.data('todo');
    // Set isComplete property to true
    myTodo.isComplete = true;
    // Slide up effect on parent element
    completedTodo.slideUp( () => {
        // Update interface with new data
        splitTodos();
        renderTodos();
    })
});

// Delete button click listener
$('main').on('click', '.action.delete', function() {
    // Grab parent element
    const deletedTodo = $(this).closest('.todo');
    // Grab object from Todo that was clicked (child element)
    const myTodo = deletedTodo.data('todo');
    // Grab index of Todo that was clicked
    const myTodoIndex = allTodos.indexOf( myTodo );
    // Slide up effect on parent element
    deletedTodo.slideUp( () => {
        // Remove Todo at index of Todo that was clicked
        allTodos.splice(myTodoIndex, 1);
        storeData();
    })
});

// Creating a new Todo //
// Create function to read Todo Form and return Todo object
const createTodoFromForm = () => {
    const newTodo = {};
    const todoForm = $('.todo-form');

    newTodo['title'] = $('#todo-title').val();
    newTodo['dueDate'] = $('#todo-due-date').val();
    newTodo['description'] = $('#todo-description').val();
    newTodo['isComplete'] = false;
    
    return newTodo;
};


// Create Todo click listener
$('.create-todo').on('click', function(event) {
    // Prevent default action
    event.preventDefault();
    // Store object
    const myTodo = createTodoFromForm();
    // Add object to beginning of allTodos array
    allTodos.unshift(myTodo);
    // Reset Todo form
    $('.todo-form').trigger('reset');
    // Update page
    updatePage();
});

// Create global variables to store different Todo categories
let pendingTodos,
    completedTodos,
    expiredTodos;

// Check if Todo is current (Compare Todo date with current date)
const isCurrent = todo => {
    // Grab dueDate from Todo
    const todoDueDate = new Date(todo.dueDate);
    // Grab current date
    const now = new Date();
    // Compare current date with dueDate and return it
    return now < todoDueDate;
};

// Divide allTodos into appropriate category
const splitTodos = () => {
    // Pending Todos
    pendingTodos = allTodos.filter( todo => {
        return isCurrent(todo) && !todo.isComplete;
    });

    // Completed Todos
    completedTodos = allTodos.filter( todo => {
        return todo.isComplete 
    });

    // Expired Todos
    expiredTodos = allTodos.filter( todo => {
        return !isCurrent(todo) && !todo.isComplete; 
    });
};

// Data Persistance //

const storeData = () => {
    // Create an item in storage using allTodos
    localStorage.setItem('allTodos', JSON.stringify(allTodos));
};

// Starter data if localStorage is empty
const fetchDefaultTodos = () => {
    let defaultTodos = [
        {
        title:'Pending Task',
        dueDate: '03-10-2022',
        description: 'Pending Todos will appear here',
        isComplete: false
        },
        {
        title:'Use Controls',
        dueDate: '03-11-2022',
        description: 'Use buttons on the left to create & remove Todos',
        isComplete: false
        },
        {
        title:'Finished Task',
        dueDate: '03-11-2022',
        description: 'Completed Todos will appear here',
        isComplete: true
        },
        {
        title:'Expired Task',
        dueDate: '03-11-2021',
        description: 'Expired Todos will appear here',
        isComplete: false
        },
    ];
    return defaultTodos;
};

const retrieveData = () => {
    allTodos  = localStorage.getItem('allTodos') === null
        ? allTodos = fetchDefaultTodos()
        : allTodos = JSON.parse(localStorage.getItem('allTodos'))
};

const updatePage = () => {
    storeData();
    splitTodos();
    renderTodos();
}

// Show Todos on page

retrieveData();
splitTodos();
renderTodos();