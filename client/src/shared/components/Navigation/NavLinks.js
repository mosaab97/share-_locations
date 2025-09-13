import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const NavLinks = () => {
    const auth = useAuth();
    return <ul className="nav-links">
        <li>
            <NavLink to="/" exact>All Places</NavLink>
        </li>
        {
            auth.user && <>
                <li>
                    <NavLink to={`/${auth.user.id}/places`}>My Places</NavLink>
                </li>
                <li>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>
                <li>
                    <NavLink onClick={() => auth.logout()} to="/auth">log out</NavLink>
                </li>
            </>
        }
        {
            !auth.user && <li>
                <NavLink to="/auth">Authenticate</NavLink>
            </li>
        }

    </ul>
}

export default NavLinks