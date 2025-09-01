import Input from '../../shared/components/FormElements/Input'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import './PlacesContainers.css'
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/from';


const NewPlace = () => {

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

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log('PLACE SUBMITTED', state.inputs);
  }

  

  return (
    <form className='place-form'>
      {/* <Input id="title" element="input" type="text" label="Title"   /> */}
      <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title." onInput={changeHandler} />
      <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description (at least 5 characters)." onInput={changeHandler} />
      <Input id="address" element="input" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid address." onInput={changeHandler} />
      <Button type="submit" disabled={!state.isValid} onClick={placeSubmitHandler}>ADD PLACE</Button>
    </form>
  )
}

export default NewPlace