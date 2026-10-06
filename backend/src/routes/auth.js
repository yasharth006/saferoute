const router = require('express').Router(); const controller = require('../controllers/authController'); const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/reporter-session', asyncRoute(controller.issueReporterSession)); router.post('/admin/login', asyncRoute(controller.adminLogin));
module.exports = router;
