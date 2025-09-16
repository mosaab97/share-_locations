import { useState } from 'react'
import './UsersContainers.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/from'
import Card from '../../shared/components/UIElements/Card'
import { useAuth } from '../../shared/context/authContext'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http';
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

function Auth() {
    const auth = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [state, changeHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = async event => {
        event.preventDefault();
        let res;
        if (!isLoginMode) {
            const formData = new FormData()
            formData.append('name', state.inputs.name.value);
            formData.append('email', state.inputs.email.value);
            formData.append('password', state.inputs.password.value);
            formData.append('image', state.inputs.image.value);
            res = await sendRequest('http://localhost:5000/api/users/signup', 'POST', formData)
        } else {
            res = await sendRequest('http://localhost:5000/api/users/login', 'POST', {
                email: state.inputs.email.value,
                password: state.inputs.password.value
            })
        }
        if (res) {
            auth.login(res.data);
        }
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...state.inputs,
                name: undefined,
                image: undefined
            },
                state.inputs.email.isValid && state.inputs.password.isValid
            );
        }
        else {
            setFormData({
                ...state.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    return <>
        <ErrorModal error={error} onClear={clearError} />
        <Card className='authentication'>
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>Login Required</h2>
            <hr />
            <form
                onSubmit={authSubmitHandler}>

                {!isLoginMode && <Input id="name" element="input" type="text" label="Name" validators={[VALIDATOR_MINLENGTH(3)]} errorText={"Please Enter a valid Name"} onInput={changeHandler} />}
                {!isLoginMode && <ImageUpload id="image" center={true} onInput={changeHandler} errorText={"Please provide image"} />}
                <Input id="email" element="input" type="email" label="E-Mail" validators={[VALIDATOR_EMAIL()]} errorText={"Please Enter a valid Email Address"} onInput={changeHandler} />
                <Input id="password" element="input" type="password" label="Password" validators={[VALIDATOR_MINLENGTH(6)]} errorText={"Password is weak"} onInput={changeHandler} />
                <Button type="submit" disabled={!state.isValid}>{isLoginMode ? 'Login' : 'SignUp'}</Button>
            </form>

            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SignUp' : 'Login'}</Button>
        </Card>
    </>
}

export default Auth