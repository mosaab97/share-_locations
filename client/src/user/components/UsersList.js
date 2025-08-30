import './UserComponents.css'
import UserItem from './UserItem';

const UsersList = ({ users }) => {
    if (!users || users.length === 0) {
        return (
            <div className="center">
                <h2>No users found.</h2>
            </div>
        );
    }

    return <ul className="users-list">
        {users.map(user => (
            <UserItem key={user.id} id={user.id} name={user.name} image={user.image} placesCount={user.places.length} />
        ))}
    </ul>
}

export default UsersList