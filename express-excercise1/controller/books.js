function createBook(req, res, next){

    const {id, name} = req.body;
    const book = {
        id : name
    };
    res.status(200).json(book);
}

function listBooks(req, res, next){

    const books = {
        "book1" : "water",
        "book2" : "earth",
        "book3" : "fire"
    };

    res.status(200).json(books);
}

module.exports = {createBook, listBooks};