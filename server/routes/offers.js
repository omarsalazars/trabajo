const express = require('express');
const router = express.Router();

let Offer = require('../models/offer');

router.get('/',(req,res)=>{
    Offer.find({})
    .populate('enterprise', 'name')
    .exec((err, offers)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            offers
        })
    })
})

router.get('/:id', (req, res)=>{
    let id = req.params.id;
    Offer.findById(id)
    .exec((err, offerDB)=>{
        if(err){
            return res.status(500).json({
                err
            })
        }
        if(!offerDB){
            return res.status(400).json({
                err:{
                    message:'No hay oferta con ese id'
                }
            })
        }
        return res.json({
            offer:offerDB
        })
    })
})

router.post('/', function(req, res){
    let body = req.body;

    let offer = new Offer({
        enterprise: body.enterprise,
        position: body.position,
        description:body.description,
        salary:parseInt(body.salary),
        travel:body.travel
    });

    offer.save((err, offerDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            offer:offerDB
        })

    });

});

//GET OFFERS BY ENTERPRISE ID
router.get('/enterprise/:id', async (req, res)=>{
    let id = req.params.id;

    await Offer.find({enterprise:id})
    .populate('enterprise')
    .exec( (err, offers)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!offers){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            offers
        })
    })
})


//UPDATE OFERTA
router.put('/:id', function(req, res){
    let id = req.params.id;
    let body = req.body;
    Offer.findByIdAndUpdate(id, {
            $set:{
                position: body.position,
                description:body.description,
                salary:parseInt(body.salary),
                travel:body.travel
            }
        },{new:true,runValidators:true} ,(err, enterpriseDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            enterprise: enterpriseDB
        });
    });
});

router.delete('/:id', (req, res)=>{
    Offer.findByIdAndDelete(id)
    .exec((err, offerDB)=>{
        if(err){
            return json.status(500).json({
                ok:false,
                err
            })
        }
        if(!offerDB){
            return json.status(400).json({
                ok:false,
                err:{
                    message:"No se encontro esa oferta"
                }
            }) 
        }
        res.json({
            offer:offerDB
        })
    })
})

module.exports = router;