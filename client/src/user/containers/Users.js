import { useEffect, useState } from "react"
import UsersList from "../components/UsersList"
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  useEffect(() => {
    const effect = async () => {
        const res = await sendRequest('http://localhost:5000/api/users');
        if(res){
          setLoadedUsers(res.data.users)
        }
    }
    effect();
  }, [sendRequest])
  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && <div className="center">
      <LoadingSpinner />
      </div>}
    <UsersList users={loadedUsers} />
    </>
  )
}

export default Users