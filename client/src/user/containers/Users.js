import { useEffect, useState } from "react"
import axios from 'axios';
import UsersList from "../components/UsersList"
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    const effect = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        console.log(res.data.users)
        setLoadedUsers(res.data.users)
      } catch (err) {
        console.log(err)
        setError(err?.response?.data.message || "something went wrong")
      }
      setIsLoading(false)
    }
    effect();
  }, [])
  console.log(loadedUsers)
  return (
    <>
    <ErrorModal error={error} onClear={() => setError(null)} />
    {isLoading && <div className="center">
      <LoadingSpinner />
      </div>}
    <UsersList users={loadedUsers} />
    </>
  )
}

export default Users