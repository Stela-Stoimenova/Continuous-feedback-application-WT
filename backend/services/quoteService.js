const axios = require('axios');

const getQuoteOfTheDay = async() => {
    try{
        const response = await axios.get('https://zenquotes.io/api/random');
        const item = Array.isArray(response.data) ? response.data[0] : {};
        return {
            quote: item?.q || 'Keep going. You are doing great.',
            author: item?.a || 'Unknown'
        };

    }catch(error){
        throw new Error('Failed to fetch quote');
    }
};

module.exports ={getQuoteOfTheDay};