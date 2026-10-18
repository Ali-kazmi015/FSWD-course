async function fetchUser() {
try {
const response = await fetch(
'https://jsonplaceholder.typicode.com/users/1'
);


    if (!response.ok) {
        return 'Fetching unsuccessful. Status: ' + response.status;
    }

    const user = await response.json();

    if (!user || typeof user.id !== 'number' || typeof user.name !== 'string') {
        return 'Invalid user data received.';
    }

    return user;

} catch (error) {
    return 'Fetching unsuccessful. Please check your internet connection.';
}


}

async function main() {
const result = await fetchUser();
console.log(result);
}

main();
