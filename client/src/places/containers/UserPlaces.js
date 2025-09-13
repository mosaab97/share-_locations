import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList'
import './PlacesContainers.css'
import { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {

    const userId = useParams().userId;
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [places, setPlaces] = useState([])

    useEffect(() => {
      const effect = async () => {
        const res = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
        if(res) {
          setPlaces(res.data.places)
        }
      }
      effect()
    }, [sendRequest, userId])

    const onDelete = (id) => {
      setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== id))
    }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      { isLoading ? <LoadingSpinner asOverlay /> : <PlaceList places={places} onDelete={onDelete}/>} 
      
    </>
  )
}

export default UserPlaces