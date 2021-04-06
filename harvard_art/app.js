const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=bfecebdd-6f7a-4c42-9173-4dcdb3905af1';

const fetchObjects = async () => {
    const url = `${ BASE_URL }/object?${ KEY }`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

fetchObjects()
    .then(data => console.log(data));