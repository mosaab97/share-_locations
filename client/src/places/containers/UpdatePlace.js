import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import './PlacesContainers.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/from'
import Card from '../../shared/components/UIElements/Card'
import { useHttpClient } from '../../shared/hooks/http'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useAuth } from '../../shared/context/authContext'


const UpdatePlace = () => {
    const history = useHistory()
    const {user} = useAuth();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const placeId = useParams().placeId;
    const [loadedPlace, setLoadedPlace] = useState();

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

    useEffect(() => {
        const effect = async () => {
            const res = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
            if (res) {
                setLoadedPlace(res.data.place)
                setFormData({
                    title: {
                        value: res.data.place.title,
                        isValid: true
                    },
                    description: {
                        value: res.data.place.description,
                        isValid: true
                    }
                })
            }
        }
        effect();
    }, [sendRequest, setFormData, placeId])

    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (!loadedPlace && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        )
    }


    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        const res = await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', {
            title: state.inputs.title.value,
            description: state.inputs.description.value,
        })
        if(res) {
            history.push(`/${user.id}/places`)
        }
    }

    return <>
        <ErrorModal error={error} onClear={clearError} />
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <h2>Edit Place</h2>
            <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title." onInput={changeHandler} InitialValue={loadedPlace.title} InitialValid={true} />
            <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description (at least 5 characters)." onInput={changeHandler} InitialValue={loadedPlace.description} InitialValid={true} />
            <Button type="submit" disabled={!state.isValid}>UPDATE PLACE</Button>
        </form>
    </>
}

export default UpdatePlace