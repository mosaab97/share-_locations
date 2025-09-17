import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import MainNavigation from '../components/Navigation/MainNavigation';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
const Users = React.lazy(() => import('../../user/containers/Users'));
const UserPlaces = React.lazy(() => import('../../places/containers/UserPlaces'));
const UpdatePlace = React.lazy(() => import('../../places/containers/UpdatePlace'));
const NewPlace = React.lazy(() => import('../../places/containers/NewPlace'));
const Auth = React.lazy(() => import('../../user/containers/Auth'));


function Routes() {
    const auth = useAuth();
    let routes;
    if (auth.token) {
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
                <Suspense fallback={<div className='center'><LoadingSpinner /></div>}>
                    {routes}
                </Suspense>
            </main>
        </Router>
    )
}

export default Routes