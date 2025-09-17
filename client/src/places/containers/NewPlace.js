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
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


const NewPlace = () => {
  const history = useHistory();
  const { token } = useAuth()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
      value: null,
      isValid: false
    }
  }, false);
  const placeSubmitHandler = async event => {
    event.preventDefault();
    const formData = new FormData()
    formData.append('title', state.inputs.title.value);
    formData.append('description', state.inputs.description.value);
    formData.append('address', state.inputs.address.value);
    formData.append('image', state.inputs.image.value);
    const res = await sendRequest('/places', 'POST', formData, 
      { Authorization: `Bearer ${token}`})
    if (res) history.push('/');
  }

  return (
    <>

      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form'>
        {
          isLoading && <LoadingSpinner asOverlay />
        }
        {/* <Input id="title" element="input" type="text" label="Title"   /> */}
        <ImageUpload id="image" center={true} onInput={changeHandler} errorText={"Please Provide Image"} />
        <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title." onInput={changeHandler} />
        <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description (at least 5 characters)." onInput={changeHandler} />
        <Input id="address" element="input" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid address." onInput={changeHandler} />
        <Button type="submit" disabled={!state.isValid} onClick={placeSubmitHandler}>ADD PLACE</Button>
      </form>
    </>
  )
}

export default NewPlace