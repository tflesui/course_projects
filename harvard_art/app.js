const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=bfecebdd-6f7a-4c42-9173-4dcdb3905af1';

// Function to fetch data
const fetchObjects = async () => {
    const url = `${ BASE_URL }/object?${ KEY }`;

    onFetchStart();

    try {
        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    } finally {
        onFetchEnd();
    }
}

                    // Fetching category lists

const fetchAllCenturies = async () => {
    const url = `${ BASE_URL }/century?${ KEY }&size=100&sort=temporalorder`;

    // Get cached data
    if (localStorage.getItem('centuries')) {
        return JSON.parse(localStorage.getItem('centuries'));
    }

    onFetchStart();

    try {
        const response = await fetch(url);
        const data = await response.json();
        const records = data.records;

        localStorage.setItem('centuries', JSON.stringify(records));

        return records;
    } catch (error) {
        console.error(error);
    } finally {
        onFetchEnd();
    }
}

const fetchAllClassifications = async () => {
    const url = `${ BASE_URL }/classification?${ KEY }&size=100&sort=name`;

    // Get cached data
    if (localStorage.getItem('classifications')) {
        return JSON.parse(localStorage.getItem('classifications'));
    }

    onFetchStart();

    try {
        const response = await fetch(url);
        const data = await response.json();
        const records = data.records;

        localStorage.setItem('classifications', JSON.stringify(records));

        return records;
    } catch (error) {
        console.error(error);
    } finally {
        onFetchEnd();
    }
}

const prefetchCategoryLists = async () => {
    try {
        const [
          classifications, centuries
        ] = await Promise.all([
          fetchAllClassifications(),
          fetchAllCenturies()
        ]);

        // Notify user of items in the Classification dropdown
        $('.classification-count').text(`(${ classifications.length })`);

        // Create an option tag for Classification dropdown
        classifications.forEach(classification => {
            $('#select-classification')
                .append(`
                    <option value="${classification.name.toLowerCase()}">${classification.name}</option>
                `);
        });

        // Notify user of items in the Centuries dropdown
        $('.century-count').text(`(${ centuries.length })`);

        // Create an option tag for Centuries dropdown
        centuries.forEach(century => {
            $('#select-century')
                .append(`
                    <option value="${century.name.toLowerCase()}">${century.name}</option>
                `);
        });    
    } catch (error) {
        console.error(error);
    }
}

prefetchCategoryLists();

// Build search
const buildSearchString = () => {
    const classificationOption = $('#select-classification').val();
    const centuryOption = $('#select-century').val();
    const keyword = $('#keywords').val();

    
    return `${ BASE_URL }/object?${ KEY }&classification=${classificationOption}&century=${centuryOption}&keyword=${keyword}`;
}

// Search listener
$('#search').on('submit', async event => {
    event.preventDefault();

    onFetchStart();

    try {
        const response = await fetch(buildSearchString());
        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error(error);
    } finally {
        onFetchEnd();
    }
});

// Searching modal
const onFetchStart = () => {
    $('#loading').addClass('active');
}

const onFetchEnd = () => {
    $('#loading').removeClass('active');
}