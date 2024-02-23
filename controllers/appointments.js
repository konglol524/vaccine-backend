const Appointment = require('../models/Appointment');

//@desc Get all appointments
//@route GET /api/v1/appointments
//@access Private

exports.getAppointments = async (req, res, next) => {
    let query;
    //General users can only see their appointments
    if(req.user.role !== 'admin'){
        //protect function in middleware auth will give request user
        query = Appointment.find({user: req.user.id}).populate({
            //like a lookup on hospital collection
            path:'hospital',
            select:'name province tel'
        });
    } else {
        //admin can see all appointments
        query = Appointment.find().populate({
            path:'hospital',
            select:'name province tel'
        });
    }

    try {
        const appointments = await query;
        res.status(200).json({
            success: true,
            const: appointments.length,
            data: appointments
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success: false, message: "Cannot find Appointment"
        });
    }
};