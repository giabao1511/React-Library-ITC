//! SHARE
const HELPER = require('../../../../share/utils/helper');
const RANDOMS = require('../../../../share/utils/random');
const CONSTANTS = require('../../../../share/configs/constants');
const MESSAGES = require('../../../../share/configs/message');
const MEMORY_CACHE = require('../../../../share/utils/limited_redis');

//! MIDDLEWARE
const { globalCache } = require('../../../../share/patterns/LRU_Strategy.patterns');
const { returnReasons } = require('../../../../share/middleware/handle_error');

//! MODEL
const book_model = require('../../../../share/models/book.model');
const book_category_model = require('../../../../share/models/book_categories.model');

//! SERVICE
const book_admin_service = require('../../../../share/services/admin_service/book_service');
const book_categories_admin_service = require('../../../../share/services/admin_service/book_categories.service');

const bookController = {
    /**
     * @author Nguyễn Tiến Tài
     * @created_at 03/02/2023
     * @created_at 27/03/2023, 14/04/2023, 24/04/2023
     * @description create book
     * @function createBook
     * @return {Object:{Number,String}}
     */
    createBook: async (req, res) => {
        const {
            name,
            author_id,
            image_uri,
            description,
            page_number,
            industry_code_id,
            bookshelf,
            language,
            quantity,
            public_id_image,
            book_categories_array,
        } = req.body.input.book_input;

        // Check input
        if (
            !name
            || !author_id
            || !image_uri
            || !description
            || !bookshelf
            || !language
            || !quantity
            || !public_id_image
            || !page_number
            || !industry_code_id
        ) {
            return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                element: {
                    result: MESSAGES.GENERAL.INVALID_INPUT,
                },
            });
        }
        // Parse data json
        let book_categories_array_parse = null;
        if (book_categories_array) {
            book_categories_array_parse = JSON.parse(book_categories_array);
        }

        const book_id = RANDOMS.createID();
        const data_insert = {
            book_id,
            name,
            author_id,
            image_uri,
            description,
            bookshelf,
            language,
            total_comment: 0,
            total_like: 0,
            total_rating: 0,
            quantity,
            status: CONSTANTS.STATUS_BOOK.STILL,
            public_id_image,
            page_number,
            real_quantity: quantity,
            industry_code_id,
        };
        try {
            // create book database
            let err;
            let result;
            let result_insert_book_categories;
            [err, result] = await HELPER.handleRequest(book_model.createBook(data_insert));
            if (result) {
                if (book_categories_array_parse) {
                    result_insert_book_categories = await book_categories_admin_service.handleSaveMultiBookCategories(
                        book_id,
                        book_categories_array_parse,
                        null,
                    );
                }
                // Del key Redis
                MEMORY_CACHE.delKeyCache(CONSTANTS.KEY_REDIS.ALL_BOOK);
                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: {
                            insert_book: result[0].book_id,
                            // eslint-disable-next-line no-nested-ternary

                            insert_book_categories:
                                result_insert_book_categories === undefined
                                    ? null
                                    : result_insert_book_categories
                                    ? MESSAGES.GENERAL.SERVER_INSERT_FAIL
                                    : MESSAGES.GENERAL.SERVER_CURD_SUCCESS,
                        },
                    },
                });
            }
            if (err) {
                return res.status(CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR).json({
                    status: CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR),
                });
            }
        } catch (error) {
            return res.status(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE).json({
                status: CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE,
                message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE),
                element: {
                    result: MESSAGES.GENERAL.SERVER_OUT_OF_SERVICE,
                },
            });
        }
    },
    /**
     * @author Nguyễn Tiến Tài
     * @created_at 03/02/2023
     * @updated_at 17/04/2023 24/04/2023
     * @description update book
     * @function updateBook
     * @return {Object:{Number,String}}
     */
    updateBook: async (req, res) => {
        const {
            book_id,
            name,
            author_id,
            image_uri,
            description,
            bookshelf,
            language,
            quantity,
            status,
            page_number,
            public_id_image,
            book_categories_array,
            industry_code_id,
        } = req.body.input.book_input;

        // Check input
        if (!book_id || !HELPER.validateBigInt(book_id)) {
            return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                element: {
                    result: MESSAGES.GENERAL.INVALID_INPUT,
                },
            });
        }

        // Check Input is empty
        if (
            [
                name,
                author_id,
                industry_code_id,
                image_uri,
                description,
                bookshelf,
                language,
                quantity,
                public_id_image,
                page_number,
            ].some((field) => field !== undefined && field.trim() === '')
        ) {
            return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                element: {
                    result: MESSAGES.GENERAL.INVALID_MUTILP_FIELD,
                },
            });
        }
        // Parse data json
        let book_categories_array_parse = null;
        if (book_categories_array) {
            book_categories_array_parse = JSON.parse(book_categories_array);
        }
        const book = await book_model.getBookById({
            book_id,
            isdeleted: CONSTANTS.DELETED_DISABLE,
        });

        if (!book || !book.length) {
            return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                element: {
                    result: MESSAGES.GENERAL.EXITS_NOT_BOOK,
                },
            });
        }
        // if quantity already update
        const quantity_update = quantity ? Number(quantity) : 0;

        const data_update = {
            name,
            author_id,
            image_uri,
            description,
            bookshelf,
            language,
            quantity,
            status,
            public_id_image,
            page_number,
            industry_code_id,
            real_quantity: Number(book[0].quantity) + Number(quantity_update),
        };
        try {
            // Check Student tow a borrow book
            // Get data book_categories
            const book_categories = await book_category_model.getAllBookCategories(
                {
                    book_id,
                    isdeleted: CONSTANTS.DELETED_DISABLE,
                },
                '*',
            );
            // update book database
            let err;
            let result;
            let result_insert_book_categories;

            [err, result] = await HELPER.handleRequest(
                book_model.updateBook(
                    data_update,
                    { book_id, isdeleted: CONSTANTS.DELETED_DISABLE },
                    { book_id: 'book_id' },
                ),
            );
            if (result) {
                if (book_categories_array_parse) {
                    // insert book categories array
                    result_insert_book_categories = await book_categories_admin_service.handleSaveMultiBookCategories(
                        book_id,
                        book_categories_array_parse,
                        book_categories,
                    );
                }
                // Create key Cache
                const key_cache_book_detail = HELPER.getURIFromTemplate(CONSTANTS.KEY_REDIS.DETAIL_BOOK, {
                    book_id,
                });

                // Delete Cache
                book_admin_service.handleDeleteCache(key_cache_book_detail, CONSTANTS.KEY_REDIS.ALL_BOOK);

                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: {
                            insert_book: result[0].book_id,
                            // eslint-disable-next-line no-nested-ternary

                            insert_book_categories:
                                result_insert_book_categories === undefined
                                    ? null
                                    : result_insert_book_categories
                                    ? MESSAGES.GENERAL.SERVER_UPDATE_FAIL
                                    : MESSAGES.GENERAL.SERVER_CURD_SUCCESS,
                        },
                    },
                });
            }
            if (err) {
                return res.status(CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR).json({
                    status: CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR),
                });
            }
        } catch (error) {
            return res.status(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE).json({
                status: CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE,
                message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE),
                element: {
                    result: MESSAGES.GENERAL.SERVER_OUT_OF_SERVICE,
                },
            });
        }
    },
    /**
     * @author Nguyễn Tiến Tài
     * @created_at 03/02/2023
     * @description delete book
     * @function deleteBook
     * @return {Object:{Number,String}}
     */
    deleteBook: async (req, res) => {
        const { book_id } = req.body.input.book_input;

        // Check input
        if (!book_id) {
            return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                element: {
                    result: MESSAGES.GENERAL.INVALID_INPUT,
                },
            });
        }
        try {
            // Check account  already delete
            const result_book_detail = await book_model.getBookById(
                {
                    book_id,
                    isdeleted: CONSTANTS.DELETED_ENABLE,
                },
                {
                    book_id: 'book_id',
                },
            );

            // Check Book already delete
            if (result_book_detail.length > CONSTANTS.ARRAY.EMPTY) {
                return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                    status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                    element: {
                        result: MESSAGES.GENERAL.EXITS_DELETE_BOOK,
                    },
                });
            }

            // Delete book, borrow, favorite database
            let err;
            let result;
            [err, result] = await HELPER.handleRequest(
                book_model.transactionDeleteBook(
                    {
                        isdeleted: CONSTANTS.DELETED_ENABLE,
                    },
                    {
                        book_id,
                        isdeleted: CONSTANTS.DELETED_DISABLE,
                    },
                    {
                        book_id: 'book_id',
                        isdeleted: 'isdeleted',
                    },
                ),
            );
            if (result) {
                // Create key Cache
                const key_cache_book_detail = HELPER.getURIFromTemplate(CONSTANTS.KEY_REDIS.DETAIL_BOOK, {
                    book_id,
                });

                // Delete Cache
                book_admin_service.handleDeleteCache(key_cache_book_detail, CONSTANTS.KEY_REDIS.ALL_BOOK);

                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: book_id,
                    },
                });
            }
            if (err) {
                return res.status(CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR).json({
                    status: CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_INTERNAL_SERVER_ERROR),
                });
            }
        } catch (error) {
            return res.status(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE).json({
                status: CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE,
                message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE),
                element: {
                    result: MESSAGES.GENERAL.SERVER_OUT_OF_SERVICE,
                },
            });
        }
    },
    /**
     * @author Nguyễn Tiến Tài
     * @created_at 03/02/2023
     * @description detail book
     * @function getDetailBook
     * @return {Object:{Number,String}}
     */
    getDetailBook: async (req, res) => {
        const book_id = req.params.book_id;

        // Check input
        if (!book_id) {
            return res.status(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST).json({
                status: CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST,
                message: returnReasons(CONSTANTS.HTTP.STATUS_4XX_BAD_REQUEST),
                element: {
                    result: MESSAGES.GENERAL.INVALID_INPUT,
                },
            });
        }
        try {
            // Create key Cache
            const key_cache_book_detail = HELPER.getURIFromTemplate(CONSTANTS.KEY_REDIS.DETAIL_BOOK, {
                book_id,
            });

            // detail book database
            const cache_lru_book = globalCache.getCache(key_cache_book_detail);
            if (cache_lru_book !== CONSTANTS.NO) {
                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: cache_lru_book,
                    },
                });
            }
            // detail book database
            const result_book_detail = await book_model.getBookById(
                { book_id, isdeleted: CONSTANTS.DELETED_DISABLE },
                '*',
            );
            if (result_book_detail) {
                // Add data cache lru argothim
                book_admin_service.handleSetCacheLRU(key_cache_book_detail, result_book_detail[0]);

                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: result_book_detail[0],
                    },
                });
            }
        } catch (error) {
            console.error('error::::', error);
            return res.status(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE).json({
                status: CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE,
                message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE),
                element: {
                    result: MESSAGES.GENERAL.SERVER_OUT_OF_SERVICE,
                },
            });
        }
    },
    /**
     * @author Nguyễn Tiến Tài
     * @created_at 03/02/2023
     * @description Get all book
     * @function getAllBook
     * @return {Object:{Number,String}}
     */
    getAllBook: async (req, res) => {
        try {
            // Detail book database
            const cache_redis_book = await MEMORY_CACHE.getCache(CONSTANTS.KEY_REDIS.ALL_BOOK);
            if (cache_redis_book) {
                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: JSON.parse(cache_redis_book),
                    },
                });
            }
            // Take data db
            const result_book_detail = await book_model.getAllBook({ isdeleted: CONSTANTS.DELETED_DISABLE }, '*');
            if (result_book_detail) {
                const redisTTLWithRandom = RANDOMS.getRedisTTLWithRandom(CONSTANTS._1_MONTH);
                // Add data redis
                book_admin_service.handleSetCacheRedis(
                    CONSTANTS.KEY_REDIS.ALL_BOOK,
                    result_book_detail,
                    redisTTLWithRandom,
                );

                return res.status(CONSTANTS.HTTP.STATUS_2XX_OK).json({
                    status: CONSTANTS.HTTP.STATUS_2XX_OK,
                    message: returnReasons(CONSTANTS.HTTP.STATUS_2XX_OK),
                    element: {
                        result: result_book_detail,
                    },
                });
            }
        } catch (error) {
            return res.status(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE).json({
                status: CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE,
                message: returnReasons(CONSTANTS.HTTP.STATUS_5XX_SERVICE_UNAVAILABLE),
                element: {
                    result: MESSAGES.GENERAL.SERVER_OUT_OF_SERVICE,
                },
            });
        }
    },
};
module.exports = bookController;
