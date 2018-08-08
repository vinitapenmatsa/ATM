import React  from 'react';
import { BrowserRouter ,Redirect, Route , Switch } from 'react-router-dom';

import Withdrawal from './components/withdrawal/withdrawal';

  const Routes = () => (
    <BrowserRouter >
        <Switch>
          <Route path="/Withdrawal" component={Withdrawal}/>
          <Redirect to="/Withdrawal" />
         </Switch>
       </BrowserRouter>
     );

 export default Routes;
