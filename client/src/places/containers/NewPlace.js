import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import './PlacesContainers.css'
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/from';
import { useHttpClient } from '../../shared/hooks/http';
import { useAuth } from '../../shared/context/authContext';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


const NewPlace = () => {
  const history = useHistory();
  const { user } = useAuth()
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [state, changeHandler] = useForm({
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    }, false);

  const placeSubmitHandler = async event => {
    event.preventDefault();
    const res = await sendRequest('http://localhost:5000/api/places', 'POST', {
      title: state.inputs.title.value,
      description: state.inputs.description.value,
      address: state.inputs.address.value,
      creator: user.id
    })
    if(res) history.push('/');
  }

  

  return (
    <>
    
    <ErrorModal error={error} onClear={clearError} />
      <form className='place-form'>
        {
          isLoading && <LoadingSpinner asOverlay/>
        }
        {/* <Input id="title" element="input" type="text" label="Title"   /> */}
        <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title." onInput={changeHandler} />
        <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description (at least 5 characters)." onInput={changeHandler} />
        <Input id="address" element="input" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid address." onInput={changeHandler} />
        <Button type="submit" disabled={!state.isValid} onClick={placeSubmitHandler}>ADD PLACE</Button>
      </form>
    </>
  )
}

export default NewPlace