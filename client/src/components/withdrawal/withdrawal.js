import React, { Component } from 'react';
import request from 'superagent';
import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import './withdrawal.css';

export default class Withdrawal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentBalance: "",
      errorMessage:"",
      withdrawalAmount: "",
      notes: [],
      largeCoins: [],
      smallCoins: []

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setPayoutBoxes = this.setPayoutBoxes.bind(this);
    this.collectCash = this.collectCash.bind(this);

  }

 componentDidMount() {
   this.setState({ currentBalance : this.props.userDetails.currentBalance });
 }

  handleChange(e) {
    this.setState({
      errorMessage : "",
      notes: [],
      largeCoins: [],
      smallCoins: [],
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(event) {

    console.log("*** Withdrawing Money , Please Wait. ***");
    event.preventDefault();

    //TODO move post call to a common api
    request
      .post('http://localhost:8080/withdraw')
      .send({
        accountNumber: this.props.userDetails.accountNumber,
        amount: this.state.withdrawalAmount
      })
      .set('mode', 'no-cors')
      .set('Accept', 'application/json')
      .then(res => {
        console.log('*** Withdrawal Successful ***', JSON.stringify(res.body));
        this.setPayoutBoxes(res.body.cash);
        this.setState({
          currentBalance: res.body.currentBalance
        });
      }).catch(err => {
        if(err.response){
        console.log('OOPS! error', JSON.stringify(err.response.body));
        this.setState({ errorMessage : err.response.body });
       }
        console.log(err);
      });
  }

  setPayoutBoxes(cash){
      console.log("*** distributing cash ***");
      let notesArray = [];
      let largeCoinsArray = [];
      let smallCoinsArray = [];


      for(let denomination in cash){
         if(cash[denomination].type === "NOTE"){
           notesArray.push({ "denomination" : denomination,
           "quantity" : cash[denomination].quantity
           });
         }else if(cash[denomination].type === "LARGE_COIN"){
           largeCoinsArray.push({ "denomination" : denomination,
           "quantity" : cash[denomination].quantity
           });
         }else{
           smallCoinsArray.push({ "denomination" : denomination,
           "quantity" : cash[denomination].quantity
           });
         }
      }

      this.setState({
        notes : notesArray,
        largeCoins : largeCoinsArray,
        smallCoins : smallCoinsArray
      });
      //console.log("** State **", this.state);

  }


 collectCash(){
   //Empty payout boxes

    this.setState({
      notes : [],
      largeCoins : [],
      smallCoins : [],
      withdrawalAmount: ""
    });
    //console.log("** State **", this.state);
    console.log("*** cash collected , emptying boxes ***");
 }



  render(){

    let options = {
      withdrawalAmount: {
        label: "Enter Amount",
        placeholder: ""
      }
    };

    console.log(this.props);

    let notesTemplate= [];
    if(this.state.notes.length > 0){
      notesTemplate = this.state.notes.map((item) =>  <li key={item.denomination} className="list-group-item"><h3><span className="badge badge-primary"><span className="badge badge-light quantity-badge">{item.quantity}</span>{item.denomination}</span></h3></li>)
    }

    let largeCoinsTemplate = [];
    if(this.state.largeCoins.length > 0){
       largeCoinsTemplate = this.state.largeCoins.map((item) =>  <li key={item.denomination} className="list-group-item"><h3><span className="badge badge-primary"><span className="badge badge-light quantity-badge">{item.quantity}</span>{item.denomination}</span></h3></li>)
     }

    let smallCoinsTemplate = [];
    if(this.state.smallCoins.length > 0){
       smallCoinsTemplate = this.state.smallCoins.map((item) =>  <li key={item.denomination} className="list-group-item"><h3><span className="badge badge-primary"><span className="badge badge-light quantity-badge">{item.quantity}</span>{item.denomination}</span></h3></li>)
     }


   return (

         <div className="container-fluid withdrawal-container">
          <div className="row justify-content-md-center">
              <div className = "col-sm-12 col-xs-12 col-md-8 col-lg-8" >
               <div className="panel panel-default">
                 <div className="panel-body">
                     <div className="row justify-content-md-center">
                          <div className="col-sm-12 col-xs-12 col-md-4 col-lg-3 cols">{/*Left Column Start*/}
                            <div className="card user-profile-card pt-3 text-center">
                             <img className="card-img-top mx-auto d-block   profile-image" src="/user.png" alt="User Profile"/>
                             <div className="card-body"><h6 className="card-title"><span>{this.props.userDetails.firstName} {this.props.userDetails.lastName}</span></h6></div>
                            </div> {/*User Profile Card*/}

                            <div className="card pt-3 text-center">
                             <div className="card-body pt-3">
                              <h6 className="card-title">
                              <span>Account Balance</span>
                              </h6>
                              <hr></hr>
                              {this.state.currentBalance}
                             </div>
                            </div> {/* Account Balance Card */}

                          </div> {/*Left Column End*/}

                          <div className="col-sm-12 col-xs-12 col-md-8 col-lg-9 cols">{/*Right Column Start*/}
                           <div className="card pt-3 text-center">{/*Withdrwal Card Start*/}
                              <div className="card-body">
                                <form className = "form-withdraw"  onSubmit={this.handleSubmit}>
                                  <h6 className="card-title">
                                   <span>{options.withdrawalAmount.label}</span>
                                  </h6>
                                  <div className="form-group has-danger">
                                  <div className="form-control-feedback"><p className="validation-message">{this.state.errorMessage}</p></div> </div>
                                  <input type="number" name="withdrawalAmount" className="form-control mb-2"  min="1" value={this.state.withdrawalAmount} onChange = { this.handleChange } />
                                  <button className = "btn btn-lg btn-primary btn-block mb-1"
                                  type = "submit"> Withdraw </button>
                                </form>
                              </div>
                           </div>{/*Withdrwal Card End*/}

                           { ( this.state.notes.length > 0 || this.state.largeCoins.length > 0 || this.state.smallCoins.length > 0 )
                             && <div className="card pt-3 text-center">{/*Cash Dispenser Start*/}
                           <span className="pull-right clickable close-icon" data-effect="fadeOut">
                             <button type="button" className="close close-icon" aria-label="Close" onClick={this.collectCash}>
                               <span aria-hidden="true">&times;</span>
                             </button>
                            </span>
                           <div className="card-body">{/*Card Body Start*/}
                           <h6 className="card-title">
                           <span>Collect Your Cash</span>
                           </h6>
                           <hr></hr>
                             <div className="row justify-content-md-center">

                                { (this.state.notes.length > 0) && <div className="col-sm-4 col-xs-4 col-md-4 col-lg-4">{/*Notes Payout Box*/}
                                   <div className="card payout-box">
                                    <div className="card-body">
                                      <h6 className="card-title">
                                      <span>Notes</span>
                                      </h6>
                                      <hr></hr>
                                      <ul className="list-group">
                                        {notesTemplate}
                                      </ul>
                                    </div>
                                   </div>
                                </div>}{/*Notes Payout Box End*/}

                                {(this.state.largeCoins.length > 0) && <div className="col-sm-4 col-xs-4 col-md-4 col-lg-4">{/*Small Coins Payout Box*/}
                                  <div className="card payout-box">
                                   <div className="card-body">
                                     <h6 className="card-title">
                                     <span>Large Coins</span>
                                     </h6>
                                     <hr></hr>
                                     <ul className="list-group">
                                       {largeCoinsTemplate}
                                     </ul>
                                   </div>
                                  </div>
                                </div>}{/*Small Coins Payout Box End*/}

                                {(this.state.smallCoins.length > 0) && <div className="col-sm-4 col-xs-4 col-md-4 col-lg-4">{/* Large Coins Payout Box*/}
                                  <div className="card payout-box">
                                   <div className="card-body">
                                     <h6 className="card-title">
                                     <span>Small Coins</span>
                                     </h6>
                                     <hr></hr>
                                     <ul className="list-group">
                                       {smallCoinsTemplate}
                                     </ul>
                                   </div>
                                  </div>
                                </div>}{/* Large Coins Payout Box End*/}

                              </div>
                              </div>
                           </div>}{/*Cash Dispenser End*/}
                          </div>{/*Right Column End*/}

                     </div>
                 </div> {/*Panel Body End*/}
               </div> {/*Panel End*/}
              </div>
            </div>
         </div>
       );
   }

}
