import { useState } from 'react'
import axios from 'axios';
import './UsersContainers.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/from'
import Card from '../../shared/components/UIElements/Card'
import { useAuth } from '../../shared/context/authContext'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

function Auth() {
    const auth = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
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
        setIsLoading(true);
        if (!isLoginMode) {
            try {
                res = await axios.post('http://localhost:5000/api/users/signup', {
                    name: state.inputs.name.value,
                    email: state.inputs.email.value,
                    password: state.inputs.password.value
                })

            } catch (err) {
                setError(err?.response?.data.message || "something went wrong")
            }
        } else {
            try {
                res = await axios.post('http://localhost:5000/api/users/login', {
                    email: state.inputs.email.value,
                    password: state.inputs.password.value
                })
            } catch (err) {
                setError(err?.response?.data.message || "something went wrong")
            }
        }
        setIsLoading(false)

        if (res) {
            auth.login(res.data.user);
        }
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...state.inputs,
                name: undefined
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
                }
            },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    }

        return <>
        <ErrorModal error={error} onClear={() => setError(null)}/>
        <Card className='authentication'>
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2>Login Required</h2>
            <hr />
            <form
                onSubmit={authSubmitHandler}>

                {!isLoginMode && <Input id="name" element="input" type="text" label="Name" validators={[VALIDATOR_MINLENGTH(3)]} errorText={"Please Enter a valid Name"} onInput={changeHandler} />}
                <Input id="email" element="input" type="email" label="E-Mail" validators={[VALIDATOR_EMAIL()]} errorText={"Please Enter a valid Email Address"} onInput={changeHandler} />
                <Input id="password" element="input" type="password" label="Password" validators={[VALIDATOR_MINLENGTH(5)]} errorText={"Password is weak"} onInput={changeHandler} />
                <Button type="submit" disabled={!state.isValid}>{isLoginMode ? 'Login' : 'SignUp'}</Button>
            </form>

            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SignUp' : 'Login'}</Button>
        </Card>
        </>
}

export default Auth