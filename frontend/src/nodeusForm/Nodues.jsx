import React from "react";
import {Component } from "react";
import axios from "axios";


class NoduesForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            gr_no:'',
            catList:[],
            yop:'',
            cat:'',
            fee_receipt:'',
            ol:'',
            id:'',
            proof:'',
            plc:''
        }
    }

    componentDidMount(){
        this.fetchAllCat();
        this.fetchAllFilledData();
    }

    fetchAllCat=async()=>{
        await axios.get(`${process.env.REACT_APP_BASE_URL}/fetchAllCategory`,{ headers: { Authorization: localStorage.getItem('token')}})
        .then((response)=>
          {
            this.setState({catList:response.data.cats});
          })
          .catch(err=>
            {
                alert(err.response.data);
            }
        );
    }

    fetchAllFilledData = async() =>{
        await axios.post(`${process.env.REACT_APP_BASE_URL}/getAlumniData`,{},{ headers: { Authorization: localStorage.getItem('token')}})
        .then((response)=>
          {
            this.setState({
                yop:response.data.data[0].batch,
                cat:response.data.data[0].category,
                ol:response.data.data[0].offer_admit,
                id:response.data.data[0].id_photo,
                proof:response.data.data[0].proof_id,
                plc:response.data.data[0].plc,
                fee_receipt:response.data.data[0].fee_receipt,
                gr_no:response.data.data[0].grno});
          })
          .catch(err=>
            {
                alert(err.response.data);
            }
        );
    }

    handleSubmit=async()=>{
        const {gr_no,yop,cat,ol,fee_receipt, id,proof,plc} = this.state;

        if(gr_no=='' ||
            yop=='' ||
            cat=='' ||
            ol== '' ||
            fee_receipt=='' ||
            id=='' ||
            proof=='' ||
            plc==''
            ){
                alert({message:'All the fields are required!'});
            }
        else{
            await axios.post(`${process.env.REACT_APP_BASE_URL}/FormSubmistion`,{
                gr_no:gr_no,
                yop:yop,
                cat:cat,
                ol:ol,
                fee_receipt:fee_receipt,
                id:id,
                proof:proof,
                plc:plc
            },{ headers: { Authorization: localStorage.getItem('token')}})
            .then((response)=>
              {
                alert(response.data.message)
              })
              .catch(err=>
                {
                    alert(err.response.data.message);
                }
            );
        }

        
    }

    handleInputChange=async(e)=>{
        const {name, value} = e.target;

        console.log(name, value)
        this.setState({
            [name]:value
        })
    }

    handleFileChange = async(e) => {
        const { name, files } = e.target;
    
        // Create a FormData object and append the selected file(s)
        const formData = new FormData();
        formData.append("file", files[0]); // Assuming you only want to upload the first file, adjust as needed
    
        // Make an AJAX request to upload the file
        axios.post(`${process.env.REACT_APP_BASE_URL}/uploadFile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            console.log(response.data.filename)
            this.setState({
                [name]:response.data.filename
            })
            alert('Document Uploaded');
        })
        .catch(error => {
            console.error(`Error uploading file:`, error);
        });
    }
    
    handelViewDoc=async(e)=>{
        window.open(`${process.env.REACT_APP_BASE_URL}/viewDoc/${e}`,'_blank')
    }

    render()
    {
        const {catList,fee_receipt,ol,id,proof,plc} = this.state;
        let catOptions = []
        let yopList = []

        catList.forEach(e=>{
            catOptions.push(
                <option value={e.cat_name}>{e.cat_name}</option>
            )
        })


        for(let i=1995;i<2095;i++){
            yopList.push(
                <option value={i}>{i}</option>
            )
        }

        console.log(plc)
        return(
            
            <>
                <div className="container">
                    <div className="form_container w-80 d-flex justify-content-center mb-3">
                        <div class="card" style={{width:"80%"}}>
                            <div class="card-body">

                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="floatingInput" name='gr_no' placeholder="1234" value={this.state.gr_no} onChange={(e)=>{this.handleInputChange(e)}}/>
                                    <label for="floatingInput">GR Number</label>
                                </div>

                                <div class="form-floating mb-3">
                                    <select class="form-select" name='cat' aria-label="Default select example" value={this.state.cat} onChange={(e)=>this.handleInputChange(e)}>
                                        <option selected>Select Category</option>
                                        {catOptions.length>0 && catOptions}
                                    </select>
                                </div>

                                <div class="form-floating mb-3">
                                <select class="form-select" name='yop' aria-label="Default select example" value={this.state.yop} onChange={(e)=>this.handleInputChange(e)}>
                                        <option selected>Year Of Passing</option>
                                        {yopList.length>0 && yopList}
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="formFileMultiple" class="form-label">Fee Receipts</label><br />

                                    {
                                        (fee_receipt=='' || fee_receipt==undefined) ?
                                        <>
                                            <input class="form-control" type="file" name="fee_receipt" id="formFileMultiple" onChange={(e)=>this.handleFileChange(e)} multiple/>
                                        </>:
                                        <>
                                            <button className="btn btn-primary" onClick={(e)=>this.handelViewDoc(fee_receipt)}>
                                                View
                                            </button>
                                        </>
                                    }
                                    
                                </div>

                                <div class="mb-3">
                                    <label for="formFileMultiple" class="form-label">Offer Letter/Admit Letter</label><br />

                                    {
                                        (ol=='' || ol==undefined) ?
                                        <>
                                    <input class="form-control" type="file" name='ol' id="formFileMultiple" onChange={(e)=>this.handleFileChange(e)} multiple/>
                                    </>:
                                        <>
                                            <button className="btn btn-primary" onClick={(e)=>this.handelViewDoc(ol)}>
                                                View
                                            </button>
                                        </>
                                    }

                                </div>

                                <div class="mb-3">
                                    <label for="formFileMultiple" class="form-label">College ID Card</label><br />
                                    {
                                        (id=='' || id==undefined) ?
                                        <>
                                    <input class="form-control" type="file" name="id" id="formFileMultiple" onChange={(e)=>this.handleFileChange(e)} multiple/>
                                    </>:
                                        <>
                                            <button className="btn btn-primary" onClick={(e)=>this.handelViewDoc(id)}>
                                                View
                                            </button>
                                        </>
                                    }

                                </div>

                                <div class="mb-3">
                                    <label for="formFileMultiple" class="form-label">Proof Of Identity</label>
                                    <br />
                                    {
                                        (proof=='' || proof==undefined) ?
                                        <>
                                    <input class="form-control" type="file" name='proof' id="formFileMultiple" onChange={(e)=>this.handleFileChange(e)} multiple/>
                                    </>:
                                        <>
                                            <button className="btn btn-primary" onClick={(e)=>this.handelViewDoc(proof)}>
                                                View
                                            </button>
                                        </>
                                    }

                                </div>

                                <div class="mb-3">
                                    <label for="formFileMultiple" class="form-label">Previous Leaving Certificate</label><br />
                                    {
                                        (plc=='' || plc==undefined) ?
                                        <>
                                    <input class="form-control" type="file" name='plc' id="formFileMultiple" onChange={(e)=>this.handleFileChange(e)} multiple/>
                                    </>:
                                        <>
                                            <button className="btn btn-primary" onClick={(e)=>this.handelViewDoc(plc)}>
                                                View
                                            </button>
                                        </>
                                    }
                                </div>

                                <div class="mb-3">
                                    <button className="btn btn-primary" onClick={()=>{this.handleSubmit()}}>Apply</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default NoduesForm;