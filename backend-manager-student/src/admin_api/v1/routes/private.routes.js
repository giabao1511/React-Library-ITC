//! LIBRARY
const router_private = require('express').Router();

//! ROUTES
const adminPrivateRouter = require('./admin.routes/admin.private.route');
const bookPrivateRouter = require('./book.routes/book.private.route');
const authorPrivateRouter = require('./author.routes/author.private.route');
const categoriesPrivateRouter = require('./categories.routes/categories.private.route');
const borrowBookPrivateRouter = require('./borrow_book_routes/borrow_book_private.route');
const studentPrivateRouter = require('./student.routes/student.private.route');
const categoriesBookPrivateRouter = require('./book_categories.routes/book_categories.private.route');
const industryCodePrivateRouter = require('./industry_code.routes/industry_code.private.route');

/**
 * @author Nguyễn Tiến Tài
 * @created_at 17/12/2022
 * @update_at 11/01/2023 && 28/02/2023
 * @description Route Admins
 */
router_private.use('/', adminPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 02/03/2023
 * @description Route book
 */
router_private.use('/book', bookPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 02/03/2023
 * @description Route author
 */
router_private.use('/author', authorPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 02/03/2023
 * @description Route categories
 */
router_private.use('/categories', categoriesPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 08/03/2023
 * @description Route borrow book
 */
router_private.use('/borrow_book', borrowBookPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 24/03/2023
 * @description Route student
 */
router_private.use('/student', studentPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 15/04/2023
 * @description Route categories
 */
router_private.use('/book-categories', categoriesBookPrivateRouter);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 24/04/2023
 * @description Route industry code
 */
router_private.use('/industry-code', industryCodePrivateRouter);

module.exports = router_private;
