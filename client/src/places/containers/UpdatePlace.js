import { useEffect, useState } from 'react'
import './PlacesContainers.css'
import { useParams } from 'react-router-dom'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/from'
import Card from '../../shared/components/UIElements/Card'

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire 123 State Building',
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

const UpdatePlace = () => {
    const placeId = useParams().placeId;

    const [isLoading, setIsLoading] = useState(true);
    const [state, changeHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, true);

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId)

    useEffect(() => {
        if (identifiedPlace) setFormData({
        title: {
            value: identifiedPlace.title,
            isValid: true
        },
        description: {
            value: identifiedPlace.description,
            isValid: true
        }
    }, true)
    setIsLoading(false);
    }, [setFormData, identifiedPlace])

    if (!identifiedPlace) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className='center'>
                <h2>Loading</h2>
            </div>
        )
    }

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(state.inputs);
    }

    return <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <h2>Edit Place</h2>
        <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title." onInput={changeHandler} InitialValue={state.inputs.title.value} InitialValid={state.inputs.description.isValid} />
        <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description (at least 5 characters)." onInput={changeHandler} InitialValue={state.inputs.description.value} InitialValid={state.inputs.description.isValid} />
        <Button type="submit" disabled={!state.isValid}>UPDATE PLACE</Button>
    </form>
}

export default UpdatePlace