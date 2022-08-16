// import React, { useState } from 'react'
// import Dropzone from 'react-dropzone'
// // import { api } from "services/api"
// import { Toast } from "service/toast";
// // import { fileUpload } from "services/apiVariables"

// import uploaderImg from 'assets/images/uploader-img.svg';

// export const DragFileUpload = ({ label = "Upload", children, className, disabled = false, handleFileUpload = '', acceptFileFormat = ['png', 'jpeg', 'svg', 'jpg'], type = 'image', maxSize = 10000000000000, handleFileRemove, multiButton = false, hasImage }) => {

//     const [loader, changeLoader] = useState(false);

//     return (
//         <Dropzone
//             disabled={disabled}
//             onDrop={(files, a) => {
//                 if (files.length) {

//                     if (!checkFileValidation(files, acceptFileFormat)) {

//                         Toast({ type: 'error', message: `Please upload ${acceptFileFormat.join('/')} within 10mb` })

//                         return ''
//                     }

//                     changeLoader(true)

//                     handleFileUpload(files)

//                     uploadFile(files).then((res) => {

//                         if (handleFileUpload) {

//                             handleFileUpload(res.data)

//                             changeLoader(false)

//                         }

//                     }).catch((err) => {

//                         changeLoader(false)

//                     })

//                 } else {
//                     Toast({ type: 'error', message: `Please upload ${type} within 10mb` })
//                 }

//             }}>

//             {({ getRootProps, getInputProps }) => (
//                 <>
//                     {(multiButton) ?
//                         <div className={`${className} position-relative `}>
//                             {children}

//                             {(multiButton) ?
//                                 <input {...getInputProps()} />
//                                 : <input />}
//                             {loader ? <div className="upload-loader">
//                                 <div className="position-relative w-100 h-100">
//                                     <div className="loader-circle"></div>
//                                 </div>
//                             </div> : ''}

//                             {(multiButton) ?
//                                 <div className={`overlay-button d-flex position-absolute ${(hasImage) ? 'hasImage' : ''}`}>
//                                     <div {...getRootProps()} className="uploader-content d-flex align-items-center justify-content-center mx-2">
//                                         <img src={uploaderImg} />
//                                         <span>Upload</span>
//                                     </div>
//                                     <div onClick={handleFileRemove} className="uploader-content d-flex align-items-center justify-content-center mx-2">
//                                         <img src={uploaderImg} />
//                                         <span>Remove</span>
//                                     </div>
//                                 </div>
//                                 : ''}
//                         </div>
//                         :
//                         <div {...getRootProps()} className={`${className} position-relative `}>

//                             {children}

//                             <input {...getInputProps()} />
//                             {loader ? <div className="upload-loader">
//                                 <div className="position-relative w-100 h-100">
//                                     <div className="loader-circle"></div>
//                                 </div>
//                             </div> : ''}
//                         </div>
//                     }

//                 </>

//             )
//             }
//         </Dropzone >
//     )
// }

// const uploadFile = ([file]) => {

//     return new Promise((resolve, reject) => {

//         let formData = new FormData()

//         formData.append('key1', file)

//         // fileUpload.body = formData

//         // api(fileUpload).then((res) => {
//         //     resolve(res)
//         // }).catch((err) => {
//         //     reject(reject)
//         //     if (err.statusCode === 413) {
//         //         Toast({ type: 'error', message: err.message });
//         //     }
//         // })
//     })
// }

// const checkFileValidation = (files, validationType) => {

//     return files.every((file) => {

//         let temp = file.name.split('.')

//         let type = temp[temp.length - 1]

//         return validationType.indexOf(type) != -1

//     })

// }

// const accept = (type) => {

//     if (type == 'image') {

//         return 'image/*'

//     } else if (type == 'pdf') {

//         return 'pdf/*'

//     }

// }

import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class DragFileUploadClass extends Component {
  state = {
    fileArray: [],
    imageArray: [],
  };

  uploadImageFiles = (e) => {
    let { fileArray, imageArray } = this.state;
    if (fileArray.length < 5) {
      fileArray.push(URL.createObjectURL(e.target.files[0]));
      imageArray.push(e.target.files[0]);
      this.setState({ fileArray, imageArray });
    }
  };

  handlefile = (e) => {
    let img = new FormData();
    img.append("images", e.target.files[0]);
    this.props.handleFileUpload(e.target.files[0]);
    // console.log(e.target.files[0], "sdkflodsjfpsjdf ===", img)
  };

  removepostImage = (e, name) => {
    let { fileArray } = this.state;
    let index = fileArray.indexOf(name);
    if (index === 0) {
      fileArray.shift();
    } else {
      fileArray.pop();
    }
    this.setState({
      fileArray,
    });
  };

  render() {
    let { fileArray } = this.state;
    let {t} = this.props;
    console.log(fileArray);
    return (
      <>
        <div className="d-flex flex-wrap image-upload">
          <div className="p-0" onChange={this.uploadImageFiles}>
            {/* <input type="file" className="px-2 cursor-pointer custom-file-input" accept="image/*,video/*"  /> */}
            <label
              htmlFor="imageUpload"
              className="btn upload-btn cursor-pointer"
            >
              {t("Upload Image")}
            </label>
            <input
              onChange={this.handlefile}
              type="file"
              id="imageUpload"
              accept="image/*"
              className="d-none"
            ></input>
          </div>
          {(fileArray || []).map((url) => (
            <>
              <div className="position-relative image-folder">
                <img
                  src={url}
                  alt="..."
                  className="image-upload position-relative"
                />
                <div className="close-icon">
                  <span
                    className="icon-close fs-10"
                    onClick={(e) => this.removepostImage(e, url)}
                  ></span>
                </div>
              </div>
            </>
          ))}
        </div>
      </>
    );
  }
}
export const DragFileUpload = withTranslation()(DragFileUploadClass);
