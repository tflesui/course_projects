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

        const {records, info} = data;

        console.log(records);
        console.log(info);
        updatePreview(records, info);
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

        //Populating the browser
// Render results into the preview element
const renderPreview = ({description, primaryimageurl, title}) => {
    const record = {};
    // build element and attach object to it
    const element = $(`
        <div class="object-preview">
            <a href="#">
                ${primaryimageurl ? `<img src="${primaryimageurl}" />` : '' }
                ${title ? `<h3>${title}</h3>` : ''}
                ${description ? `<h3>${description}</h3>` : ''}
            </a>
        </div>`).data('record', record);

    return element;
} 

const updatePreview = (records, info) => {
    const root = $('#preview');

    $('.results').empty();

    if (info.next) {
        $('.next').data('url', info.next).attr('disabled', false);
    } else {
        $('.next').data('url', null).attr('disabled', true);
    };

    if (info.prev) {
        $('.previous').data('url', info.prev).attr('disabled', false);
    } else {
        $('.previous').data('url', null).attr('disabled', true);
    };

    records.forEach( record => {
        $('.results').append(renderPreview(record));
    });

}

// Pagination listener
$('#preview .next, #preview .previous').on('click', async function () {
    
    onFetchStart();

    try {
        const url = $(this).data('url');
        const response = await fetch(url);
        const data = await response.json();

        const {records, info} = data;
        updatePreview(records, info);
    } catch (error) {
        console.error(error);
    } finally {
        onFetchEnd();
    }
});