import React from 'react'
import AdminSidebar from '../../compnents/common/AdminSidebar'
import TopBar from '../../compnents/common/TopBar'
const ChangePassword = () => {
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
              Change Password
            </h1>
          </div>
          {/* Start Create Load Form */}
          <hr />
          <div className="row">
            <div className="col-lg-5">
              <div className="creatLoad_style mt-md-3">
                <form className="loadForm">
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-eye" />
                          </div>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Old Password"
                          required=""
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-eye" />
                          </div>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="New Password"
                          required=""
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-eye" />
                          </div>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm Password"
                          required=""
                        />
                      </div>
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

export default ChangePassword