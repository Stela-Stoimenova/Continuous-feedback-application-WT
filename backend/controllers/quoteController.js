const quoteService = require("../services/quoteService");

exports.getQuote = async(req,res) =>{
    try{
        const quote = await quoteService.getQuoteOfTheDay();
        res.json(quote);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}