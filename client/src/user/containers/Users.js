import UsersList from "../components/UsersList"

const Users = () => {
    const USERS = [
        { id: 'u1', name: 'Max Schwarz', image: 'https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww', places: 3 },
        { id: 'u2', name: 'Manu Schwarz', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D', places: 2 }
    ]
  return (
    <UsersList users={USERS}/>
  )
}

export default Users