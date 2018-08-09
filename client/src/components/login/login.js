import React, {  Component } from "react";
import request from 'superagent';
import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../router';
import "./login.css";

import Withdrawal from '../withdrawal/withdrawal';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountNumber: "",
      password: "",
      errorMessage:"",
      loggedIn : false,
      accountDetails : {}

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleChange(e) {
    this.setState({
      errorMessage : "",
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(event) {
    console.log("*** LOGGING IN ***");
    event.preventDefault();

    request
      .post('http://localhost:8080/login')
      .send({
        accountNumber: this.state.accountNumber,
        password: this.state.password
      })
      .set('mode', 'no-cors')
      .set('Accept', 'application/json')
      .then(res => {
        console.log('*** LOGIN SUCCESSFUL ***' + JSON.stringify(res.body));
        this.setState({ loggedIn : true });
        this.setState({ accountDetails : res.body })
        sessionStorage.setItem('accountDetails',JSON.stringify(res.body));
      }).catch(err => {
        if(err.response){
        console.log('OOPS! error', JSON.stringify(err.response.body));
          this.setState({ errorMessage : err.response.body });
        }
        console.log(err);
      });

  }

logout(){
  this.setState({ loggedIn : false });
  sessionStorage.clear();
}

  render() {

    if(this.state.loggedIn){
      console.debug("***USER LOGGED IN***");
      return (
        <Withdrawal handler={this.logout}
        userDetails={this.state.accountDetails}></Withdrawal>
      )
    }

    if(sessionStorage.getItem('accountDetails')){
      console.debug("USER LOGGED IN");
      return (
        <Withdrawal handler={this.logout}  userDetails={JSON.parse(sessionStorage.getItem('accountDetails'))}></Withdrawal>
      )
    }

      let options = {
        accountNumber: {
          label: "Account Number",
          placeholder: "9 - Digit Account Number"
        },
        password: {
          label: "Password",
          placeholder: "Password"
        },
        submitButton: {
          text: "Submit"
        }
      };

      return (
        <div className = "container login-container" >
          <div className = "row justify-content-md-center" >
            <div className = "col-sm-12 col-xs-12 col-md-6 col-lg-6" >
             <div className = "card text-center" >
              <div className = "card-body" >{/* Login Card Body Start*/}
               Sign in !
              </div>
              <hr></hr>
              <div className = "card-body" >{/* Login Card Body End*/}
              <form className = "form-signin"  onSubmit={this.handleSubmit}>{/* Login form start*/}
               <div className="form-group has-danger">
                <div className="form-control-feedback"><p className="validation-message">{this.state.errorMessage}</p></div> </div>
                 <input type = "text" name = "accountNumber"  className = "form-control mb-2"   autoComplete="account-number"
                  placeholder = {
                   options.accountNumber.placeholder
                  }
                  onChange = {
                    this.handleChange
                   }  required autoFocus / >
                 <input type = "password" name = "password" className = "form-control mb-4" autoComplete="current-password"
                  placeholder = {
                  options.password.placeholder
                   }
                  onChange = {
                  this.handleChange
                  }  required / >
               <button className = "btn btn-lg btn-primary btn-block mb-1"
               type = "submit"> Sign in </button>
            </form> {/* Login form end*/}
           </div>
           </div>
          </div>
         </div>
        </div>
      );
    }
  }
