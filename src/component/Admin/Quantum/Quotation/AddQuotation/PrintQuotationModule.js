import React, { Component } from "react";
import { NormalButton, NormalSelect } from "component/common";
import "./style.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history } from "helpers";
import { getCommonApi, commonCreateApi } from "redux/actions/common";
// import { ChangePayment } from "./ChangePayment";
// import { ChangeStaff } from "./ChangeStaff";
import { NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
// import { ChangeDate } from "./ChangeDate";

import { SignPanel } from "component/common/SignPanel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "component/Admin/Report/Account/Invoice";
import { withTranslation } from "react-i18next";

// import logo from 'assets/images/logo.png'

export class PrintQuotationModuleClass extends Component {
  state = {
    responseData: [],
    downloadlLink: "",
    isOpenPayment: false,
    isOpenstaff: false,
    settingData: {},
    isOpenDate: false,
    signPhoto: "",
    isPrintPdfClick: false,
    selectTemplate:"",
    templates:[],
    isModalVisibleTemplate:false
  };

  componentDidMount() {
    this.getResponseDate();
    this.signFunc();
    this.getAllTemplates();
  }

  signFunc = () => {
    this.props
      .getCommonApi(`quotationsign/?quo_id=${this.props.match.params.id}`)
      .then((res) => {
        console.log("responseofprint:", res);
        if (res.status != 204) {
          this.setState({ signPhoto: res.data[0].quo_sig });
        }
      });
  };

  getResponseDate =   () => {
    this.props
      .getCommonApi(
        `quotationpdf/?searchid=${this.props.match.params.id}`
      )
      .then((res) => {
        console.log("responseofprint:", res);
        this.setState({ responseData: res.data});
      });
  };

  
  handleSignSaveClick = (imgData) => {   
    let formData = new FormData();
    formData.append("fk_quotation", this.props.match.params.id);
    formData.append(
      "quo_sig",
      this.dataURLtoFile(imgData, `${this.props.match.params.id}.jpeg`)
    );

    this.props.commonCreateApi(`quotationsign/`, formData).then((key) => {
      let { status, data } = key;
      if (status == 201) {
        this.signFunc();
      }
    });
  };

  dataURLtoFile = (dataurl, filename, mime) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  handlePrintPdfFormat = (url) => {
    this.setState({
      isPrintPdfClick: false,
    });
    var a = document.createElement("a");
    a.setAttribute("download", `${new Date()}.pdf`);
    a.setAttribute("href", url);
    a.click();
    window.open(url);
  };

  getAllTemplates= async()=>{
    const res= await this.props.getCommonApi("termsandcondition/")
    if(res.data?.dataList){
    this.setState({ templates:res.data.dataList});    
    }
   }

   selectTemplate=(id)=>{
    let { templates,  } = this.state;
    const t= templates.find(x=>x.id==id);
    this.setState({selectTemplate:t});
   }

   handleChange = ({ target: { value, name } }) => {
    this.selectTemplate(value.id)
  };
  handleToogleModalTemplate = () => {
    let { isModalVisibleTemplate } = this.state;
    isModalVisibleTemplate = !isModalVisibleTemplate;
    this.setState({
      isModalVisibleTemplate
    });
  };
  render() {
    let {
      responseData = [],
      templates,
      selectTemplate
      
    } = this.state;
    let {
      sub_data = {},
      footer = {},
      } = responseData;
      let{t}=this.props;
    return (
      <>
        <div className="print-section container">
          <div className="print-bill">
            <div className="receipt card">
              <div className="logo-header">
                <div className="d-flex justify-content-center">
                  <div className="col-10">
                    <div className="row">
                      <div className="col-3">
                        <img
                          src={this.state.responseData[0]?.company_header.logo}
                          alt=""
                        ></img>
                      </div>
                      <div className="col-9">
                        <h3 className="bill-head">
                          {this.state.responseData[0]?.company_header.name}
                        </h3>
                        <p className="receipt-detail">
                          {this.state.responseData[0]?.company_header.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill-header">
                <div className="row ">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-3 f-600">Invoice No.</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.quotation_number}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Invoice Date</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.created_at}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-3  f-600">Status</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.status}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-3  f-600">Project</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.title}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Validity</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.validity}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-3  f-600">Terms</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.terms}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Company Name</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.company}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Attn To</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.contact_person}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Prepared By</div>
                      <div className="col-9">
                        : {this.state.responseData[0]?.quotation.in_charge}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3  f-600">Printed On</div>
                      <div className="col-9">
                        {new Date().toISOString().slice(0, 10)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill-detail mt-4 py-1">
                <div className="row m-0 table-header  f-600">
                  <div className="col-2">Code</div>
                  <div className="col-4 text-left">Description</div>
                  <div className="col-2 text-right">Quantity</div>
                  <div className="col-2 text-right">Unit Price</div>
                  <div className="col-2 text-right">Amount.</div>
                </div>
                {this.state.responseData[0]?.quotationitem.map((item, index) => {
                  return (
                    <div className="row m-0 mt-2" key={index}>
                      <div className="col-2">{item.quotation_itemcode}</div>
                      <div className="col-4 text-left">
                        {item.quotation_itemdesc}
                      </div>
                      {/* <div className="col-2 text-right">{item.quotation_itemdesc}</div> */}
                      <div className="col-2 text-right">
                        {item.quotation_quantity}
                      </div>
                      <div className="col-2 text-right">
                        {item.quotation_unitprice}
                      </div>
                      <div className="col-2 text-right">
                        {item.quotation_unitprice * item.quotation_quantity}
                      </div>
                    </div>
                  );
                })}

               {/*  <div className="row table-header sub-total m-0 fs-14 f-600 mt-5">
                   <div className="col-4 text-right">{sub_data.sub_total}</div> 
                  <div className="col-4 text-right"></div>
                  <div className="col-1 text-right">{sub_data.tot_qty}</div>
                  <div className="col-1 text-right">{sub_data.tot_price}</div>
                  <div className="col-1 text-right">{sub_data.tot_disc}</div>
                  <div className="col-1 text-right">{sub_data.tot_net}</div>
                  <div className="col-1 text-right">{sub_data.tot_paid}</div>
                  <div className="col-2 d-none">{sub_data.tot_bal}</div>
                </div>
                */}
              </div>
              <div className="payment-detail my-4 fs-14 f-600 mb-5">
                <div className="row m-0">
                  <div className="col-7"></div>                
                  <div className="col-5 text-right">
                    <div className="row">
                      <div className="col-6">Shipping Cost :</div>
                      <div className="col-6 text-right">
                        {this.state.responseData[0]?.quotationdtl.q_shipcost}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">Discount :</div>
                      <div className="col-6 text-right">
                        {" "}
                        {this.state.responseData[0]?.quotationdtl.q_discount}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">Taxes :</div>
                      <div className="col-6 text-right">
                        {this.state.responseData[0]?.quotationdtl.q_taxes}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6"> Total :</div>
                      <div className="col-6 text-right">
                        {this.state.responseData[0]?.quotationdtl.q_total}
                      </div>
                    </div>
                  </div>
                </div>
                {/* used payment list */}
              </div>
              <div className="invoice-footer mt-5">
                <div className="row m-0">
                  <div className="col-9 fs-12">
                  Terms And Condition
                    <p className="">                    
                      {selectTemplate}
                    </p>

                    
                  </div>
                  <div className="col-3 text-center p-1">
                    {this.state.signPhoto ? (
                      <img
                        className={`sigImage`}
                        alt=""
                        width={200}
                        height={150}
                        src={this.state.signPhoto}
                      />
                    ) : (
                      <SignPanel
                        handleSignSaveClick={(imgData) =>
                          this.handleSignSaveClick(imgData)
                        }
                      />
                    )}
                    Customer Signature
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 d-flex text-center action-buttons">
              
              <div className="w-100 mr-2">
                <NormalButton
                  onClick={() => {
                    this.setState({
                      isPrintPdfClick: true,
                    });
                  }}
                  label="Print"
                  success={true}
                  className="print"
                />
                <NormalButton
                  onClick={() => this.handleToogleModalTemplate()}
                  label="Term And Condition "
                  success={true}
                  className="print"
                />
                {this.state.isPrintPdfClick ? (
                  <PDFDownloadLink
                    document={
                      <Invoice
                        termsandcondition={selectTemplate}
                        TableList={this.state.responseData[0]}
                        accountHeader={
                          this.state.responseData[0]["company_header"]
                        }
                        signPhoto={this.state.signPhoto}
                        Flag={10}
                        landscape={false}
                      />
                    }
                  >
                    {({ blob, url, loading, error }) =>
                      !loading && url ? this.handlePrintPdfFormat(url) : null
                    }
                  </PDFDownloadLink>
                ) : null}
              </div>
              
            </div>
          </div>
        </div>
        <NormalModal
          modal={this.state.isModalVisibleTemplate}
          handleModal={this.handleToogleModalTemplate}
          style={{ minWidth: "600px" }}
        >
          <>
            <div className="row d-flex">
              <div className="input-group input-group-padding">
                <div col-md-10 col-sm-10 mb-10>
                  <label className="text-left text-black common-label-text fs-17 pt-3">
                    {("Terms And Condition")}
                  </label>
                  <NormalSelect
                  options={templates.map(x=>{return{id:x.template_name,value:x.template_text,label:x.template_name}})}
                  value={selectTemplate}
                  name="tandc"
                 onChange={(event)=>{this.setState({selectTemplate:event.target.value});
                this.handleToogleModalTemplate()}}
                />
                </div >
                
              </div>
              
            </div>

          </>
        </NormalModal>
             </>
    );
  }
}

const mapStateToProps = (state) => ({
  appointmentDetail: state.appointment.appointmentDetail,
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const PrintQuotationModule =(connect(
  mapStateToProps,
  mapDispatchToProps
))(PrintQuotationModuleClass);
