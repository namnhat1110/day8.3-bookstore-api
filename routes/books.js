var express = require('express');
var router = express.Router();
const fs = require('fs')

let dbData;

function readBooksData() {
  fs.readFile(`${__dirname}/books.json`, "utf8", function (err, data) {
    if (err) throw err;
    dbData = JSON.parse(data);
  });
}

readBooksData()

function save(data) {
  const json = JSON.stringify(data);
  fs.writeFile("./routes/books.json", json, function (err) {
    if (err) return console.log(err);
  });
}


/* GET books listing. */

router.get('/', function (req, res) {

  try {
    const { books } = dbData
    res.json(books)
  } catch (error) {
    res.status(404).json({ message: "Book not found" })
  }
});


/* GET individual book by ID */

router.get('/:bookId', function (req, res) {

  try {
    const book = dbData.books.find(b => b.id === req.params.bookId)
    if (!book) throw Error
    res.json(book)
  } catch (error) {
    res.status(404).json({ message: "Book not found" })
  }
});


/* GET individual book by Title */
router.get('/', function (req, res) {
  let { books } = dbData
  const queryStringFilter = Object.keys(req.query);

  console.log({ queryStringFilter })
  if (queryStringFilter.length !== 0) {
    queryStringFilter.map(filter => {
      books = dbData.books.filter(book => book[filter] === req.query[filter])
    })
  };
  res.json(books);
});


/* CREATE book */

router.post('/', function (req, res) {
  let { books } = dbData

  try {
    let newBook = req.body
    newBook.id = JSON.stringify(books.length + 1)
    console.log({ reqBody: req.body })
    books.push(newBook)
    save(dbData)
    res.json(newBook)
  } catch (error) {
    res.status(404).json({ message: "Book not found" })
  }
})

/* UPDATE individual book. */

router.patch('/:bookId', function (req, res) {

  const { bookId } = req.params
  try {
    let book = dbData.books.find(b => b.id === bookId)
    if (!book) throw Error
    book = { ...book, ...req.body }
    const idx = dbData.books.findIndex(b => b.id === bookId)
    dbData.books[idx] = book
    save(dbData)
    res.json(book)
  } catch (error) {
    res.status(404).json({ message: "Book not found" })
  }
});

/* DELETE individual book. */

router.delete('/:bookId', function (req, res) {

  try {
    const { bookId } = req.params
    let idx = dbData.books.findIndex(b => b.id === bookId)
    if (idx === -1) throw Error
    dbData.books.splice(idx, 1)
    save(dbData)
    res.json({ statusCode: 200, message: "Book deleted" })
  } catch (error) {
    res.status(404).json({ message: "Book not found" })
  }
});


module.exports = router;
