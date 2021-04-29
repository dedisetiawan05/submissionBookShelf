const {home, getAllBooksReadingHandler, getAllBooksHandler, addBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler} = require('./handler')
const routes = [
    //Tambah data
    {
        method: 'POST',
        path: '/books',
        handler: addBooksHandler,
    },
    //tampilkan data
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    //tampil data spesifik
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
    //edit data
    {
        method: "PUT",
        path: '/books/{id}',
        handler:updateBookByIdHandler,
    },
    //hapus data
    {
        method:"DELETE",
        path: '/books/{id}',
        handler: deleteBookByIdHandler,
    },
];

module.exports = routes