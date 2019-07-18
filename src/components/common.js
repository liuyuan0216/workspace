import axios from 'axios'
import qs from 'qs'

export var local = '';
//版本号
export var version = '';
//手机号
export var phoneText = '';
export var phoneNull = false;
export var phoneFormat = false;
//密码
export var passwordText = '';
export var passwordFormat = false;
//邮箱
export var emailText = '';
export var emailFormat = false;
//税号
export var shText = '';
export var shFormat = false;

export function locationData() {
  //this.local = 'http://192.168.0.15:8087';
  //this.local = 'http://192.168.0.15:8083';
  this.local = 'http://app.caikaixin.cn';
  this.version = 'V1.0';
}

//手机号格式
export function isPhoneAvailable($phoneInput) {
  var myreg =/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if(!$phoneInput) {
    this.phoneText = '手机号码不能为空';
    this.phoneNull = true;
    this.phoneFormat = false;
  }else if (!myreg.test($phoneInput)){
    this.phoneText = '请输入正确的手机号码';
    this.phoneNull = false;
    this.phoneFormat = true;
  }else {
    this.phoneText = '';
    this.phoneNull = false;
    this.phoneFormat = false;
  }
}

//密码格式
export function isPssword(password) {
  var reg = /^[a-zA-Z0-9]{8,20}$/;
  if(!reg.test(password)){
    this.passwordText = '请输入正确的密码';
    this.passwordFormat = true;
  }else{
    this.passwordFormat = false;
  }
  return false
}

//邮箱格式
export function isEmail($mail) {
  var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if(!pattern.test($mail)) {
    this.emailText = '请输入正确的邮箱';
    this.emailFormat = true;
  }else{
    this.emailFormat = false;
  }
  return false
}

//税号格式
export function isSh(val) {
  var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
  if(!reg.test(val)){
    this.shText = '请输入正确的税号';
    this.shFormat = true;
  }else{
    this.shFormat = false;
  }
  return false
}

//ajax请求 请求参数类型为application/x-www-form-urlencoded
export function $ajaxjp(url, param, headerType, successFunction, errorFunction){
  if (successFunction == undefined || successFunction == null || errorFunction == undefined || errorFunction == null) {
    throw "成功和失败函数必需指定";
  }
  $ajaxjpByJson(url, param, headerType, successFunction, errorFunction, false);
}
//ajax请求 根据isJsonParam判断请求方式 true为application/json的请求方式，false为：application/x-www-form-urlencoded
export function $ajaxjpByJson(url, param, headerType, successFunction, errorFunction, isJsonParam){
  if(successFunction == undefined || successFunction == null || errorFunction == undefined || errorFunction == null) {
    throw "成功和失败函数必需指定";
  }

  if(isJsonParam != null && isJsonParam){
    axios.post(url, param).then(res => {
      if (successFunction != undefined && successFunction != "") {
        successFunction(res.data);
        console.log(res);
      }
    }).catch(error => {
      if (errorFunction != undefined && errorFunction != "") {
        errorFunction(error);
      }
    });
  }else{
    if(headerType){
      axios.post(url, qs.stringify(param), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (successFunction != undefined && successFunction != "") {
          successFunction(res.data);
        }
      }).catch(error => {
        if (errorFunction != undefined && errorFunction != "") {
          errorFunction(error);
        }
      });
    }else{
      axios.post(url, qs.stringify(param), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (successFunction != undefined && successFunction != "") {
          successFunction(res.data);
        }
      }).catch(error => {
        if (errorFunction != undefined && errorFunction != "") {
          errorFunction(error);
        }
      });
    }
  }
}
