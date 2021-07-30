import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import SignupComplete from './components/auth/SignupComplete';
import VerifyUser from './components/auth/VerifyUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute'
import SendGiftCard from './components/pages/SendGiftCard';
import PaymentComplete from './components/payments/PaymentComplete';
import AddPage from './components/gift-pages/AddPage';
import EditPage from './components/gift-pages/EditPage';
import ListPages from './components/gift-pages/ListPages';
import Page from './components/gift-pages/Page';
import SendGiftCardPage from './components/gift-pages/SendGiftCardPage';
import Account from './components/auth/Account';
import Home from './components/pages/Home';


function App() {
  return (
    <Router>
    <ToastContainer/>
        <Switch>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/signup" component={Signup}></Route>
          <Route exact path="/signup/complete" component={SignupComplete}></Route>
          <Route exact path="/user/verify/:id" component={VerifyUser}></Route>
          <Route exact path="/:id/payment/complete" component={PaymentComplete}></Route>
          <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
          <PrivateRoute exact path="/gift-card/send/:id" component={SendGiftCard}></PrivateRoute>
          <PrivateRoute exact path="/page/add" component={AddPage}></PrivateRoute>
          <PrivateRoute exact path="/page/edit/:id" component={EditPage}></PrivateRoute>
          <PrivateRoute exact path="/pages" component={ListPages}></PrivateRoute>
          <PrivateRoute exact path="/account" component={Account}></PrivateRoute>
          <Route exact path="/page/:id" component={Page}></Route>
          <Route exact path="/page/:page/gift-card/send/:id" component={SendGiftCardPage}></Route>
          <Route exact path="/" component={Home}></Route>
        
        </Switch>
    </Router>
  );
}

export default App;
