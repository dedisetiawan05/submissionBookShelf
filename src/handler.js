const { nanoid } = require('nanoid');
const books = require('./books');

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;    
    const book = books.filter((n) => n.id === id)[0];
    if (book === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
    response.code(404);
    return response;
    }
    const response = h.response({
        status: 'success',
        message: 'data detail buku',
        data: {
            book,
        },
    });
    response.code(200);
    return response;
};

const addBooksHandler = (request, h) => {
    const {name,year,author,summary,publisher,pageCount,readPage,reading} = request.payload;
    //jika nama belum diisi
    if (name === "" || name === undefined || name === null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    //jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;
    const newBooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    //jika berhasil
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    //jika gagal
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(200);
    return response;
};

const updateBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    const finished = pageCount === readPage ? true : false;
    //jika nama kosong
    if (name === "" || name === undefined || name === null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
    response.code(400);
    return response;
    }
    //jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
    }

    const index = books.findIndex((book) => book.id === id);
    const updatedAt = new Date().toISOString();
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount,finished, readPage, reading, updatedAt
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  response.code(404);
  return response;
};

const getAllBooksHandler = (request, h) => {
    let { name, finished, reading } = request.query;
        //buku sedang dibaca
        if (reading == 1) {
            const response = h.response({
                status: 'success',
                message: 'Ini Halaman buku yang sedang dibaca',
                data: {
                    books: books.filter((n) => n.reading === true).map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })
                    )
                },
            });
            response.code(200);
            return response;
        }
        //menampilkan buku yang sedang tidak dibaca
        if (reading == 0) {
            const response = h.response({
                status: 'success',
                message: 'Ini Halaman buku yang sedang tidak dibaca',
                data: {
                    books: books.filter((n) => n.reading === false).map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })
                    )
                },
            });
            response.code(200);
            return response;
        }
        //buku selesai dibaca
        if (finished == 1) {
            const response = h.response({
                status: 'success',
                message: 'Ini Halaman buku yang Sudah Selesai dibaca',
                data: {
                        books: books.filter((n) => n.finished === true).map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                        })
                        )
                    },
                });
            response.code(200);
            return response;
        }
        //menampilkan buku yang belum selesai dibaca
        if (finished == 0) {
            const response = h.response({
                status: 'success',
                message: 'Ini Halaman buku yang Belum selesai dibaca',
                data: {
                        books: books.filter((n) => n.finished == false).map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })
                        )
                },
            });
            response.code(200);
            return response;
        }

        if (name !== undefined) {
            const isFind = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).length > 0;
            if (isFind) {
                const book = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
                const response = h.response({
                    status: 'success',
                    message: 'buku ditemukan',
                    data: {
                        books: book.map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })
                        )
                    },
                });
                response.code(200);
                return response;
            }
            if(!isFind){
                const book = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
                console.log(book);
                const response = h.response({
                    status: 'success',
                    message: 'Books tidak ada',
                    data: {
                        books: book.map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher,
                        })
                        )
                    },
                });
                response.code(200);
                return response;
            }
    }
    //jika ada buku
    if (books.length > 0) {
        const response = h.response({
            status: 'success',
            message: 'Ini Halaman Tampil Semua Books',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })
                )
            },
        });
        response.code(200);
        return response;
    }
    //jika kosong
    const response = h.response({
            status: 'success',
            message: 'Ini Halaman Tampil Semua Books data nya masih kosong',
            data: {
                books,
            }
        });
        response.code(200);
        return response;
}


module.exports = { getAllBooksHandler, addBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler}