import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./style.scss";
import {
  NormalInput,
  NormalButton,
  NormalTextarea,
  NormalCheckbox
} from "component/common";
import { getTokenDetails } from "redux/actions/auth";
import {  
  getCommonApi,
  commonCreateApi,
  commonUpdateApi,
  commonDeleteApi,
} from "redux/actions/common";
export class TermsConditionClass extends Component {
  state = {
    formFields: {
      id:0,     
      template_name: "",
      template_text: "",

     
    },
    templates: [],
    addEditTemplate: false,
    editTemplate: false

  };


  componentWillMount=()=>{
    this.getAllTemplates();
  }

  handleClear=()=>{
    let {formFields}=this.state;
    formFields.id=0;
    formFields.template_name="";
    formFields.template_text="";
    this.setState({formFields});

  }

  getAllTemplates= async()=>{

   const res= await this.props.getCommonApi("termsandcondition/")
   if(res.data?.dataList)
   this.setState({ templates:res.data.dataList});
    this.handleClear();

  }
  handleSave= async ()=>{
    let { templates, formFields } = this.state;
    if(formFields.id){
      let t= templates.find(x=>x.id==formFields.id);
      t.template_name=formFields.template_name;
      t.template_text=formFields.template_text
      await this.props.commonUpdateApi(`termsandcondition/${formFields.id}/`,t)
    }else{
    let tepmlate = {
      template_name: formFields.template_name,
      template_text: formFields.template_text,

    }
    const res= await this.props.commonCreateApi('termsandcondition/', tepmlate)
    templates.push(res.data)
    }
    this.setState({ templates });
    this.handleClear();

  }
  handleChange = ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    this.setState({ formFields })
  };

  handleDelete=async (id)=>{
    let {templates}= this.state;
    let t= templates.find(x=>x.id==id);
    t.isactive=!t.isactive;
    await this.props.commonUpdateApi(`termsandcondition/${id}/`,t)        
    this.setState({templates})

  }


  handleEdit =async (id)=>{
    let {templates ,formFields}= this.state;
    const  template= templates.find(x=>x.id==id);
    formFields={...template};
    this.setState({formFields})

  }


  render() {
    let { templates, addTemplate, editTemplate } = this.state;
    let { template_name, template_text, } = this.state.formFields;
    let { t } = this.props;
    return (
      <>
        <div className="container add-terms-condition" >
          <div >
            <div className="row ">
              <div className="col-md-4 col-4 mt-4 ">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Current Tepmlate")}
                </label>
              </div>
              <div className="col-md-3 col-3 mt-3 ">

              </div>

              <div className="col-md-5 col-5 mt-5 ">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Add New"
                  onClick={() => {
                    this.setState({ addEditTemplate: true })
                  }
                  }
                />
              </div>

              {templates.length>0 ?
              <div className="col-md-12 col-12 mt-12 template-list">
            {templates.filter(x=>x.isactive).map((e ,index)=>{return(
              <div className="row">
              <div className="col-md-4 col-4">

                {e.template_name}
</div> 
<div className="col-md-4 col-4 mt-4 ">

                

</div> 
<div className="col-md-2 col-2 mt-2 ">
<span className="icon-edit mr-2" onClick={()=>this.handleEdit(e.id)}></span>              
               

</div> 
<div className="col-md-2 col-2 mt-2 icon-change">
<span className="icon-delete mr-2" onClick={()=>this.handleDelete(e.id)}></span>              

</div> 


              </div>

            )})
             }
              </div>:''
                }
              <div className="col-md-5 col-5 mt-5">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Tepmlate Name")}
                </label>
              </div>
              <div className="col-md-2 col-2 mt-2"> </div>
              <div className="col-md-5 col-5 mt-5">
                <NormalInput
                  placeholder="Enter here"
                  value={template_name}
                  name="template_name"
                  onChange={this.handleChange}
                />
              </div>

              <div className="col-md-2 col-5 mt-5">
                <label className="text-left text-black common-label-text fs-17 pt-3">
                  {t("Tepmlate Text")}
                </label>
              </div>
              <div className="col-md-10 col-10 mt-10"></div>
              <div className="col-md-12 col-12 mt-12">
              <NormalTextarea                  
                  rows="10"                   
                  placeholder="Enter here"
                  value={template_text}
                  name="template_text"
                  onChange={this.handleChange}
                />


              </div>
              <div className="col-md-8 col-8 mt-8 ">
               
              </div>
              <div className="col-md-2 col-2 mt-2 ">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Cancel"
                  onClick={() => this.handleClear()
                  }
                />
              </div>
              <div className="col-md-2 col-2 mt-2 ">
                <NormalButton
                  buttonClass={"mx-2"}
                  mainbg={true}
                  className="confirm"
                  label="Save"
                  onClick={() =>this.handleSave()
                  }
                />
              </div>
              <div className="col-md-12 col-12 mt-12 ">
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}


const mapStateToProps = (state) => ({
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      commonUpdateApi,
      commonDeleteApi,
      getTokenDetails,
    },
    dispatch
  );
};

export const TermsCondition = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(TermsConditionClass)
);