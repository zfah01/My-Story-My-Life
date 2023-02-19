const quoteAPIHost = 'https://zenquotes.io';

export default {

    async fetchRandomQuotes() {
        try {
            const response = await fetch(quoteAPIHost + '/api/random');
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    },
};