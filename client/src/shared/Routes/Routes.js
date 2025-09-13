import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Users from '../../user/containers/Users';
import UserPlaces from '../../places/containers/UserPlaces';
import UpdatePlace from '../../places/containers/UpdatePlace';
import NewPlace from '../../places/containers/NewPlace';
import MainNavigation from '../components/Navigation/MainNavigation';
import Auth from '../../user/containers/Auth';

function Routes() {
    const auth = useAuth();
    let routes;
    if (auth.user) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId" exact>
                    <UpdatePlace />
                </Route>,

                <Route path="/places/:placeId" exact>
                    <UpdatePlace />
                </Route>
                <Redirect to="/" />

            </Switch>)

        //logged in
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>,
                <Route path="/:userId/places" exact>
                    <UserPlaces />
                </Route>
                <Route path="/auth" exact>
                    <Auth />
                </Route>
                <Redirect to="/auth" />
            </Switch>

        )
        //not logged in
    }
    return (
        <Router>
            <MainNavigation />
            <main>
                    {routes}
            </main>
        </Router>
    )
}

export default Routes