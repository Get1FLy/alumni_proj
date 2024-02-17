const connection = require('./db');

exports.getAllCat=async(req,res)=>{
    connection.query('select * from category',(err,categories)=>{
        if(err){
            console.log(err);
            res.status(500).json({message:'Something went wrong!'});
            return res.end();
        }
        else{
            res.status(200).json({cats:categories});
            return res.end()
        }
    })
}


exports.getFilledData=async(req,res)=>{
    const {email} = req.user;

    console.log(req.user);
    connection.query('select grno, category, fee_receipt, id_photo, offer_admit, proof_id, previous_lc from alumni_data where email = ?',[email],(err,alumni_d)=>{
        if(err){
            console.log(err);
            res.status(500).json({message:'Something went wrong!'});
            return res.end();
        }
        else{
            res.status(200).json({data:alumni_d});
            return res.end()
        }
    })
}

exports.FormSubmistion = async(req,res)=>{
    const {gr_no,yop,cat,ol,fee_receipt, id,proof,plc} = req.body;
    const {email} = req.user;

    if(gr_no=='' ||
       yop=='' ||
       cat=='' ||
       ol== '' ||
       fee_receipt=='' ||
       id=='' ||
       proof=='' ||
       plc==''
    ){
        console.log(err);
        res.status(400).json({message:'All the fields are required!'});
        return res.end();
    }
    else{
        connection.query('update alumni_data set grno =?, batch=?, category=?, offer_admit=?, fee_receipt=?, id_photo=?, proof_id=?, previous_lc=? where email=?',[gr_no,yop,cat,ol,fee_receipt, id,proof,plc,email],(err,done)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:'Something Went Wronge!'});
                return res.end();
            }
            else{
                connection.query(
                    `
                    INSERT INTO nodues_application ( alumni_id)
                        VALUES (?)
                        ON DUPLICATE KEY UPDATE
                        alumni_id = ?; 
                    `,[req.user.id,req.user.id]
                )
                res.status(200).json({message:'Applied'});
                return res.end();
            }
        })
    }
}