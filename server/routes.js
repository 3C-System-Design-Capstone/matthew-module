const router = require('express').Router();
const controller = require('./controller');

router.route('/products/:id/comments').get(controller.get);
router.route('/products/:id/comments').post(controller.post);

module.exports = router;
