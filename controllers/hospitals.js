const Hospital = require('../models/Hospital');
const vacCenter = require('../models/VacCenter')

//@desc Get all hospitals
//@route GET /api/v1/hospitals
//@access Public
exports.getHospitals = async (req, res, next) => {
    let query;
    //Copy req.query as key value array
    const reqQuery = {...req.query};
    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //turn query into string
    let queryStr = JSON.stringify(reqQuery);
    //\b is for boundary [lt] -> $lt put a dollar sign in front
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
   //finding resource
    query = Hospital.find(JSON.parse(queryStr)).populate('appointments');
    //query = Hospital.find(JSON.parse(queryStr)).populate('lol');
    
    //select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    } else {
        query=query.sort({'name': 1});
    }

    //Pagination
    //get page number to display, parse as int
    const page = parseInt(req.query.page, 10) || 1;
    //how many document in each page
    const limit = parseInt(req.query.limit, 10) || 25;
    //works because we're zero indexing
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    
    

    try{
        const total = await Hospital.countDocuments();
        //make query skip to the start we want 
        //and only show a limited number of document
        query = query.skip(startIndex).limit(limit);
        //Executing query
        const hospitals = await query;
        //Pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page:page+1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true, count:hospitals.length, pagination, data:hospitals});
    } catch(err){
        res.status(400).json({success:false});
    }
};

exports.getHospital = async (req, res, next) => {
    try{
        const hospital = await Hospital.findById(req.params.id);
        
        if(!hospital){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:hospital});
    } catch(err){
        res.status(400).json({success:false});
    } 
};

exports.createHospital= async (req, res, next) => {
    //console.log(req.body);
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success:true, data: hospital});
};

exports.updateHospital= async (req, res, next) => {
    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!hospital){
            return res.status(400).json({success: false, message: 'Hospital not found'});
        }

        res.status(200).json({success:true, data: hospital});
    } catch(err){
        res.status(400).json({success:false, message: 'update error'});
    }
    
};

exports.deleteHospital= async (req, res, next) => {
    try{
        // const hospital = await Hospital.findById(req.params.id);
        const hospital = await Hospital.findById(req.params.id);
        console.log(hospital);
        if(!hospital){
            return res.status(400).json({success: false, 
            message: `Hospital not found with id of ${req.params.id}`
            });
        }
        await hospital.deleteOne();
        res.status(200).json({success:true, data: {}});
    } catch(err){
        console.log(err);
        res.status(400).json({success:false});
    }
};

//@desc Get vaccine centers
//@route GET /api/v1/hospitals/vacCenters/
//@access public
exports.getVacCenters = (req, res, next) => {
    vacCenter.getAll((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message || "Some error occured while retrieving Vaccine Centers."
            });
        } else {
            res.send(data);
        }
    });
};