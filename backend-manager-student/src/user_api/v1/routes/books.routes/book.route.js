//! LIBARY
const router = require('express').Router();

//! CONTROLLER USER
const bookController = require('../../controllers/book.controllers/book.controller');

/**
 * @author Nguyễn Tiến Tài
 * @created_at 07/03/2023
 * @description Route get detail book
 * @param {('GET')} [method='GET'] The request's method
 */
router.get('/detail/:book_id', bookController.getDetailBook);

/**
 * @author Nguyễn Tiến Tài
 * @created_at 07/03/2023
 * @description Route get all book
 * @param {('GET')} [method='GET'] The request's method
 */
router.get('/all', bookController.getAllBook);

module.exports = router;
