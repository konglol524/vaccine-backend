const express = require('express');

const {getAppointments} = require('../controllers/appointments');

//enable access to parameters defined in parent router
const router = express.Router({mergeParams: true});

const {protect} = require('../middleware/auth');

router.route('/').get(protect, getAppointments);

module.exports = router;