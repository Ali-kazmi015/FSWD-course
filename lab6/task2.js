'use strict';

function fetchUser() {
return fetch('https://jsonplaceholder.typicode.com/users/1')
.then(response => {
if (!response.ok) {
throw new Error('Failed to fetch user. Status: ' + response.status);
}

        return response.json();
    })
    .then(user => {
        if (!user || typeof user.id !== 'number' || typeof user.name !== 'string') {
            throw new Error('Invalid user data received.');
        }

        return user;
    });


}

function fetchPost() {
return fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => {
if (!response.ok) {
throw new Error('Failed to fetch post. Status: ' + response.status);
}


        return response.json();
    })
    .then(post => {
        if (!post || typeof post.id !== 'number' || typeof post.title !== 'string') {
            throw new Error('Invalid post data received.');
        }

        return post;
    });


}

Promise.all([fetchUser(), fetchPost()])
.then(([user, post]) => {
console.log('Both operations succeeded!');
console.log('User:', user);
console.log('Post:', post);
})
.catch(error => {
console.log('Main promise rejected:', error.message);
});
