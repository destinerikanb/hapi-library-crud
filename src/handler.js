const { nanoid } = require('nanoid');
const bookArray = require('./books');

const postBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    let finished;
    if (pageCount === readPage){
        finished = true;
    } else {
        finished = false;
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
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
        updatedAt,
    };

    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    bookArray.push(newBook);
    const isSuccess = bookArray.filter((book) => book.id === id).length > 0;
    if (isSuccess === false){
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    });
    response.code(201);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    if (name !== undefined){
        // eslint-disable-next-line max-len
        const bookList = bookArray.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        if (bookList.length === 0){
            const response = h.response({
                status: 'fail',
                message: `Buku yang mengandung nama ${name} tidak ditemukan.`,
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            data: {
                bookList,
            },
        });
        response.code(200);
        return response;
    }

    if (reading !== undefined){
        if (reading === '1'){
            const readingBooks = bookArray.filter((book) => book.reading === true);
            if (readingBooks.length === 0){
                const response = h.response({
                    status: 'fail',
                    message: 'Buku yang sedang dibaca tidak ditemukan.',
                });
                response.code(404);
                return response;
            }
            const response = h.response({
                status: 'success',
                data: {
                    readingBooks,
                },
            });
            response.code(200);
            return response;
        }

        if (reading === '0'){
            const unreadingBooks = bookArray.filter((book) => book.reading === false);
            if (unreadingBooks.length === 0){
                const response = h.response({
                    status: 'fail',
                    message: 'Buku yang sedang tidak dibaca tidak ditemukan.',
                });
                response.code(404);
                return response;
            }
            const response = h.response({
                status: 'success',
                data: {
                    unreadingBooks,
                },
            });
            response.code(200);
            return response;
        }
    }

    if (finished !== undefined){
        if (finished === '1'){
            const finishedBooks = bookArray.filter((book) => book.finished === true);
            if (finishedBooks.length === 0){
                const response = h.response({
                    status: 'fail',
                    message: 'Buku yang telah selesai dibaca tidak ditemukan.',
                });
                response.code(404);
                return response;
            }
            const response = h.response({
                status: 'success',
                data: {
                    finishedBooks,
                },
            });
            response.code(200);
            return response;
        }

        if (finished === '0'){
            const unfinishedBooks = bookArray.filter((book) => book.finished === false);
            if (unfinishedBooks.length === 0){
                const response = h.response({
                    status: 'fail',
                    message: 'Buku yang belum selesai dibaca tidak ditemukan.',
                });
                response.code(404);
                return response;
            }
            const response = h.response({
                status: 'success',
                data: {
                    unfinishedBooks,
                },
            });
            response.code(200);
            return response;
        }
    }

    const books = bookArray.map((book) => {
        const bookSlice = {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        };
        return bookSlice;
    });

    const response = h.response({
        status: 'success',
        data: {
            books,
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = (bookArray.filter((b) => b.id === id))[0];

    if (book === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            book,
        },
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
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = bookArray.findIndex((book) => book.id === id);

    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (index === -1){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    bookArray[index] = {
        ...bookArray[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    };
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = bookArray.findIndex((book) => book.id === id);

    if (index === -1){
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    bookArray.splice(index, 1);
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
};

module.exports = {
    postBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};
