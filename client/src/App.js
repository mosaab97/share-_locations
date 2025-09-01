// import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// import Users from './user/containers/Users';
// import NewPlace from './places/containers/NewPlace';
// import MainNavigation from './shared/components/Navigation/MainNavigation';
// import UserPlaces from './places/containers/UserPlaces';
// import UpdatePlace from './places/containers/UpdatePlace';
// import Auth from './user/containers/Auth';
import { AuthProvider } from './shared/context/authContext';
import Routes from './shared/Routes/Routes';


const App = () => {
  
  return (
    <AuthProvider>
      <Routes />

    </AuthProvider>
  );
}

export default App;
