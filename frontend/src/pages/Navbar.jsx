import React, { useEffect, useState } from "react";
import logo from "../images/logo copy.png";
import axios from "axios";
import { IKImage, IKContext, IKUpload } from "imagekitio-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  function handleLogout(){
    localStorage.clear();
    alert('Loged Out');
    window.location.reload();
  }
  return (
    // <nav className="navbar ">
    //   <div className="navbar-logo">
    //     <img src={logo} alt="Logo" />
    //   </div>
    //   <div className="navbar-college-name text-center">
    //     <h4>
    //       <strong>
    //         Vasantdada Patil Pratishthan's 
    //         College of Engineering &amp; Visual Arts
    //       </strong>
    //     </h4>
    //   </div>
    // </nav>

    
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container">
        <a class="navbar-brand" href="#" style={{alignItems:"center",display:"flex"}}>
          <img src={logo} alt="Logo" width="50px" class="d-inline-block align-text-top"/>
          <span class="navbar-brand mb-0 h1">Academate</span>
        </a>
        <div class="collapse navbar-collapse w-100" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 w-100 justify-content-end">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Dashboard</a>
            </li>
           
            <li class="nav-item dropdown">
              <a class="nav-link active dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Certificates
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/NoduesForm">LC Application Form</a></li>
                {/* <li><hr class="dropdown-divider"/></li> */}
              </ul>
            </li>

            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#" onClick={()=>handleLogout()}>Logout</a>
            </li>
           
          </ul>


         
        </div>
      </div>
      
  </nav>
  );
};

export const StudentIDCard = ({element}) => {
  const [data,setData] = useState(undefined);
  const [pdata,setPData] = useState(undefined);
  const [cat,setCat] = useState(undefined);
 const [pro, setPro]  =useState(null);

  useEffect(() => {
    axios.get(
      `${process.env.REACT_APP_BASE_URL}/admission/personalDetails?uid=${localStorage.getItem('uid')}`, 
      )
      .then((response) => {
      setData(response.data['radd'])
      console.log(response.data['radd'])
      })
      .catch((error) => {
        console.log('Error Bro')
        console.log(error);
      });

      axios.get(
        `${process.env.REACT_APP_BASE_URL}/admission/currentEducation_per?uid=${localStorage.getItem('uid')}`, 
        )
        .then((response) => {
        setPData(response.data['data'])
        setCat(response.data['category'])
        })
        .catch((error) => {
          console.log('Error Bro')
          console.log(error);
        });

        axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/admission/upload?uid=` +
            localStorage.getItem("uid")
        )
        .then((response) => {
          setPro(response.data['docs'].photo)
        }).catch(err=>console.log(err))
  
  }, []);

  return (

    <>
    {
      data!=undefined && pdata!=undefined ?
      <>
      <div className="card mb-3" style={{width:"100%"}}>
      <div className="row g-0">
        <div className="col-md-4" style={{
    display: 'flex',
    justifyContent: 'center'
}}>
          <img src={pro} className="img-fluid rounded-start" alt="..." style={{width:'300px'}}/>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{data[0].name}</h5>
            <p className="card-text"><b>Date of Birth: </b>{new Date(data[0].dob).toLocaleDateString('en-GB')}<br/>
            <b>College ID:</b> {pdata[0].stud_clg_id}<br/>
            <b>GR Number:</b> {pdata[0].gr_number}<br/>
            <b>Category:</b> {cat}<br/></p>
            {element}
            {/* <small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
          </div>
        </div>
      </div>
    </div>
      </>:<></>
    }
    </>
    
    
  );
};

export const Cards = ({ title, text, button }) => {


  return (
    <div className="cards my-2">
      <div className="card mx-auto my-4">
        <div className="card-body">
          <h5 className="card-title"> {title} </h5>
          <p className="card-text">Rs. {text}</p>
          {button}
        </div>
      </div>
    </div>
  );
};

export const Buttons = () => {
  const [clickNeft, setClickNeft] = useState(false);
  const [clickDD, setClickDD] = useState(false);
  return (
    <>
      <div className="buttons mt-4 ">
        {/* <button
          onClick={() => {
            setClickDD(false);
            setClickNeft(!clickNeft);
          }}
          className="colour-picker"
        >
          Pay via NEFT
        </button> */}

              <form action='https://vppcoe-va.getflytechnologies.com/payment/initiate_payment_installment' method='POST' id='integration' >
                <button name='id' value={localStorage.getItem('uid')}>
                  Pay Fees
                </button>
              </form>


        <button
          onClick={() => {
            setClickNeft(false);
            setClickDD(!clickDD);
          }}
          className="colour-picker"
        >
          Pay via DD
        </button>
      </div>
      {clickNeft && <NeftForm />}
      {clickDD && <DdForm />}
    </>
  );
};

export const NeftForm = () => {
  const [formData, setFormData] = useState({
    utrnumber: "",
    neftdate: "",
    neftamount: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const NEFTsubmission = async (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    let isValid = true;
    for (let [name, value] of formData.entries()) {
      if (value.trim() === '') {
        isValid = false;
        break;
      }
    }

    formData.append("uid", localStorage.getItem('uid'))

    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/admission/neft_info`, Object.fromEntries(formData));
    const data = await response.data;
    alert(data.message)
  }

  return (
    <div className="forms my-5 px-3">
      <form onSubmit={NEFTsubmission}>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="dd_number" className="form-label">
                Transaction/UTR number
              </label>
              <input
                onChange={handleChange}
                name="dd_number"
                type="text"
                className="form-control"
                id="utrnumber"
              />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="dd_date" className="form-label">
                Date
              </label>
              <input
                onChange={handleChange}
                name="dd_date"
                type="date"
                className="form-control"
                id="neftdate"
              />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                onChange={handleChange}
                name="amount"
                type="number"
                className="form-control"
                id="neftamount"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export const DdForm = () => {
  const publicKey = "public_gWKOuQlhuPW59VhaGTXah7GGmHU=";
  let urlEndpoint = "https://ik.imagekit.io/getflytechnologies/";
  const authenticationEndpoint =
    "https://vppcoe-va.getflytechnologies.com/api/faculty/upload_auth";
  const [formData, setFormData] = useState({
    bankname: "",
    bankbranch: "",
    ddamount: "",
    date: "",
    ddnumber: "",
  });

  const [ddlink, setDDlink] = useState(false);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var formData = new FormData(e.target);

    let isValid = true;
    for (let [name, value] of formData.entries()) {
      if (value.trim() === '') {
        isValid = false;
        break;
      }
    }

    if (!isValid || ddlink == false) {
      alert('Please fill in all the fields.');
      return;
    }

    formData.append("dd_link", ddlink);
    formData.append("uid", localStorage.getItem('uid'))

    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/admission/dd_info`, Object.fromEntries(formData));
    const data = await response.data;
    alert(data.message)
  }
  
  return (
    <div className="forms my-5 px-3">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="bankname" className="form-label">
                Bank Name
              </label>
              <input
                onChange={handleChange}
                name="bank_name"
                type="text"
                className="form-control"
                id="bankname"
              />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="bankbranch" className="form-label">
                Bank Branch
              </label>
              <input
                onChange={handleChange}
                name="bank_branch"
                type="text"
                className="form-control"
                id="bankbranch"
              />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                onChange={handleChange}
                name="amount"
                type="number"
                className="form-control"
                id="ddamount"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="dd_date" className="form-label">
                Date
              </label>
              <input
                onChange={handleChange}
                name="dd_date"
                type="date"
                className="form-control"
                id="date"
              />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="mb-3">
              <label htmlFor="ddnumber" className="form-label">
                DD Number
              </label>
              <input
                onChange={handleChange}
                name="dd_number"
                type="number"
                className="form-control"
                id="ddnumber"
              />
            </div>
          </div>

          <div className="col-lg-12 col-md-12">
          <div className="mb-3">
              <label htmlFor="ddnumber" className="form-label">
                DD Image
              </label><br />
              <IKContext
                    publicKey={publicKey}
                    urlEndpoint={urlEndpoint}
                    authenticationEndpoint={authenticationEndpoint}
                  >
                    <IKUpload
                      fileName="dd.jpg"
                      tags={["tag1"]}
                      useUniqueFileName={true}
                      isPrivateFile={false}
                      onSuccess={(r) => {
                        setDDlink(r.url);
                        alert('DD Image has been Uploaded')
                      }}
                    />
                  </IKContext>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
