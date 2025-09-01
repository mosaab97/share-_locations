import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList'
import './PlacesContainers.css'


const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4np_zcJ5E-_AWCDaHb0wBb80PkN2H-d6AHfoSMejinekGTNQPVJ-jPvtBTFUZF5aRjbtgq7cE1RhGSGG9uFcD8_u69o9CgXbq8LABEZw_NtZsvx80MBk0rwsm6LQyDlQ7CiYWbaF=w243-h174-n-k-no-nu',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: { lat: 40.7484405, lng: -73.9878584 },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4np_zcJ5E-_AWCDaHb0wBb80PkN2H-d6AHfoSMejinekGTNQPVJ-jPvtBTFUZF5aRjbtgq7cE1RhGSGG9uFcD8_u69o9CgXbq8LABEZw_NtZsvx80MBk0rwsm6LQyDlQ7CiYWbaF=w243-h174-n-k-no-nu',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: { lat: 40.7484405, lng: -73.9878584 },
        creator: 'u2'
    }
]

const UserPlaces = () => {

    const userId = useParams().userId
  return (
    <PlaceList places={DUMMY_PLACES.filter(place => place.creator === userId)}/>
  )
}

export default UserPlaces