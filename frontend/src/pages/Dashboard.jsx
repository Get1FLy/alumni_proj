import React, { useEffect, useState } from "react";
import { Buttons, Cards, Navbar, NeftForm, StudentIDCard } from "./Navbar";
import './Dash.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([])
  const [SingleFee, setSingleFee] = useState([])
  const [isDone, setisDone] = useState([])
  const [isChecked, setChecked] = useState(false);
  const [isCheckedn, setCheckedn] = useState(false);
  const [ddlink, setDDlink] = useState(false);
  const [balance, setBalance] = useState(false);

  useEffect(() => {
    fetchInfo();
    fetchAmount();
  }, []);

  const fetchInfo = () => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/profile`,{ headers: { Authorization: localStorage.getItem('token')}})
      . then((response)=>
        {
          setData(response.data);
        })
        .catch(err=>
          {
          console.log(err.response.data);
          }
      );
  }

  const fetchAmount = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/single_fee_amounts`,{ headers: { Authorization: localStorage.getItem('token')}})
      . then((response)=>
        {
          setSingleFee(response.data);
        })
        .catch(err=>
          {
          if(err.response.data.message=='Forbidden: Invalid token')
          {
            alert("Session Has been Expired!.");
            localStorage.clear()
            window.location.reload();
          }
          }
      );
  }

  var FeeItems = []
  if(SingleFee.length>0){
    for(var i=0;i<SingleFee.length;i++){
      FeeItems.push(
        <div class="card col-lg-3" style={{minWidth: "18rem",width:"fit-content"}}>
        <div class="card-header">
          {SingleFee[i].head_name}
        </div>
        <div class="card-body">
          <h5 class="card-title m-3">{SingleFee[i].amount} Rs.</h5>
          <form action={`https://vppcoe-va.getflytechnologies.com/payment/alumni_initiate_payment?id=${SingleFee[i].sfh_id}`} method='POST' id='integration' >
                <button className='btn btn-primary' name='collegeId' value={data.collegeId}>
                  Pay Fees
                </button>
              </form>
        </div>
      </div>
      )
      
    }
  }
  
  return (
    <>
      <div className="mycontainer_withH">
      <div className="container dashboard d-flex justify-content-between row g-3" >

        <div class="card col-lg-12 d-flex " style={{width: "100%",flexDirection:"row",flexWrap:"wrap",padding:'20px',gap:'10px'}}>
          <div class="card-body">
            <h5 class="card-title mb-3">Hi!, {data.name}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">College Id: {data.collegeId}</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Email Id: {data.email}</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Contact: {data.contact}</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Pass Out Batch: {data.batch}</h6>
          </div>

          {/* <div class="card-body">
            <h5 class="card-title mb-3">Quick Links:</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Apply For Leaving Certificate</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Panding Payments</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Contact: {data.contact}</h6>
            <h6 class="card-subtitle mb-2 text-body-secondary">Pass Out Batch: {data.batch}</h6>
          </div> */}
        </div>
	 {FeeItems}

            
   </div>
   </div>





    </>
 
  );
};

export default Dashboard;


const styles = {
  mainContent: {
    flex: 1,
    padding: "20px",
  },

  formContainer: {
    padding: "20px",
    borderRadius: "4px",
    flex: "none",
  },

  inputGroup: {
    fontWeight: "bold",
  },
  label: {
    marginRight: "10px",
    padding: "10px",
    marginBottom: "20px",
    marginTop: "20px",
  },
  input: {
    flex: "0 0 60px",
    border: "1px solid #ccc",
    transition: "border-color 0.3s ease",
    padding: "8px",
    marginRight: "30px",
    marginBottom: "20px",
    marginLeft: "20px",
    marginTop: "20px",
    borderRadius: "4px",
    borderColor: "#4d4d4d",
  },
  buttonContainer: {
    display: "flex",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#00b695",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "70px",
    marginBottom: "30px",
  },

  tableContainer: {
    maxHeight: "400px",
    border: "0.5px solid #e6e6e6",
    maxWidth: "100%",
    background: "white",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "10px 0", // Increase the margin to create a bigger cell gap
  },

  table: {
    borderCollapse: "collapse",
    width: "100%",
  },

  tableCell: {
    border: "1px solid #e6e6e6",
    padding: "8px",
    height: "40px", // Adjust the height as needed
    verticalAlign: "middle",
  },
};

