const express = require('express');

const app = express();
const port = 3000;

//parse the JSON request bodies
app.use(express.json());
app.use(express.static('public'));

//in memory array for books
let books = [
    {id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genre: 'Fiction', available: true},
    {id: 2, title: 'Confessions', author: 'Saint Augustine', year: 400, genre: 'Philosophy', available: true},
    {id: 3, title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', year: 1880, genre: 'Fiction', available: false},
    {id: 4, title: 'The Divine Comedy', author: 'Dante Alighieri', year: 1320, genre: 'Epic Poetry', available: true},
    {id: 5, title: 'Don Quixote', author: 'Miguel de Cervantes', year: 1605, genre: 'Fiction', available: true},
    {id: 6, title: 'East of Eden', author: 'John Steinbeck', year: 1952, genre: 'Epic Poetry', available: true},
    {id: 7, title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', year: 1844, genre: 'Fiction', available: true},
    {id: 8, title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', year: 1890, genre: 'Fiction', available: false},
    {id: 9, title: 'Dune', author: 'Frank Herbert', year: 1965, genre: 'Science Fiction', available: true},
    {id: 10, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, genre: 'Fantasy', available: true}
];

let nextId = 11;

//validate book data
function validateBook(body) {
    const { title, author, year, genre } = body;
    if(typeof title !== 'string' || !title.trim()) return "title is requied";
    if(typeof author !== 'string' || !author.trim()) return "author is requied";
    if(!Number.isInteger(year)) return "year must be a positive number";
    if(typeof genre !== 'string' || !genre.trim()) return "genre is requied";
    return null;
}

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Library API</title>
                <link rel="stylesheet" type="text/css" href="/css/style.css">
            </head>
            <body>
                <h1>Welcome to the Library API</h1>
                <p>Use the following endpoints to interact with the API:</p>
                <ul>
                    <li>GET /books - Get all books</li>
                    <li>GET /books/:id - Get a book by ID</li>
                    <li>POST /books - Create a new book</li>
                    <li>PUT /books/:id - Update a book by ID</li>
                    <li>DELETE /books/:id - Delete a book by ID</li>
                </ul>
            </body>
        </html>
    `);
});

//routes 
//GET /books - get all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

//GET /books/:id - get a book by id
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const book = books.find((b) => b.id === id);
    if(!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
});

//create a book
//POST /books - create a new book
app.post('/books', (req, res) => {
    const error = validateBook(req.body);
    if(error) {
        return res.status(400).json({ error });
    }
    const {title, author, year, genre, available = true} = req.body;
    const newBook = { id: nextId++, title, author, year, genre, available };
    books.push(newBook);
    res.status(201).json(newBook);
});

//put 
//PUT /books/:id - update a book by id
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const bookIndex = books.findIndex((b) => b.id === id);
    if(bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    const error = validateBook(req.body);
    if(error) {
        return res.status(400).json({ error });
    }
    const {title, author, year, genre, available = true} = req.body;
    const updatedBook = { id, title, author, year, genre, available };
    books[bookIndex] = updatedBook;
    res.status(200).json(updatedBook);
});

//delete
//DELETE /books/:id - delete a book by id
app.delete("/books/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = books.findIndex((b) => b.id === id);
    if(index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    const [removedBook] = books.splice(index, 1);
    res.status(200).json({message: "Book deleted", book: removedBook});
});

//start our server
app.listen(port, () => {
    console.log(`Library API is running on http://localhost:${port}`);
});