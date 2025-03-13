import React from 'react'
import AdminSidebar from '../compnents/common/AdminSidebar'
import TopBar from '../compnents/common/TopBar'

const Profile = () => {
  return (
    <div id="wrapper">
    {/* Sidebar */}
 <AdminSidebar/>
    {/* End of Sidebar */}
    {/* Content Wrapper */}
    <div id="content-wrapper" className="d-flex flex-column">
      {/* Main Content */}
      <div id="content">
        {/* Topbar */}
      <TopBar/>
        {/* End of Topbar */}
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <div className="d-sm-flex align-items-center justify-content-between mb-3">
            <h1 className="h5 mb-0 text-gray-800 font-weight-bolder">
              Company Profile
            </h1>
          </div>
          {/* Start Create Load Form */}
          <hr />
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="creatLoad_style mt-md-3">
                <form className="loadForm">
                  <div className="form-group row">
                    <div className="col-sm-12 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Name"
                        required=""
                      />
                    </div>
                    <div className="col-sm-12 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bussiness Type"
                        required=""
                      />
                    </div>
                    <div className="col-sm-12 mb-3">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Contact No."
                        required=""
                      />
                    </div>
                    <div className="col-sm-12 mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email ID"
                        required=""
                      />
                    </div>
                    <div className="col-sm-12 mb-3">
                      <textarea
                        className="form-control h-100"
                        placeholder="About Company"
                        rows={5}
                        cols={50}
                        required=""
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 justify-content-end d-flex mb-5 px-0">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block w-100 px-5 py-2"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card mt-md-3">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-gray-800">
                    Company Info
                  </h6>
                </div>
                <div className="card-body">
                  <p>
                    <b>Name :</b> Sameer
                  </p>
                  <p>
                    <b>Bussiness Type :</b> Logistic Brokerage
                  </p>
                  <p>
                    <b>Contact No. :</b> 555-666-888
                  </p>
                  <p>
                    <b>Email Id :</b> jogadispatch@gmail.com
                  </p>
                  <p>
                    <b>About Us :</b> At MyCompany T, we redefine efficiency and
                    reliability in the world of logistics. With an unwavering
                    commitment to seamless operations and customer satisfaction,
                    we offer comprehensive solutions tailored to meet the diverse
                    needs of our clients.....
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* End Create Load Form */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* End of Main Content */}
    </div>
    {/* End of Content Wrapper */}
  </div>
  
  )
}

export default Profile