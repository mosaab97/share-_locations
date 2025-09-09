import { useState } from 'react'
import './UsersContainers.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/from'
import Card from '../../shared/components/UIElements/Card'
import { useAuth } from '../../shared/context/authContext'

function Auth() {
    const auth = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
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

    const authSubmitHandler = event => {
        event.preventDefault();
        if(state.isValid) {
            auth.login({name: 'Max', id: 'u1' });
        }
    }

    const switchModeHandler = () => {
        if(!isLoginMode) {
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

    return <Card className='authentication'>
        <form
            onSubmit={authSubmitHandler}>

            <h2>Login Required</h2>
            <hr />
            {!isLoginMode && <Input id="name" element="input" type="text" label="Name" validators={[VALIDATOR_MINLENGTH(3)]} errorText={"Please Enter a valid Name"} onInput={changeHandler} />}
            <Input id="email" element="input" type="email" label="E-Mail" validators={[VALIDATOR_EMAIL()]} errorText={"Please Enter a valid Email Address"} onInput={changeHandler} />
            <Input id="password" element="input" type="password" label="Password" validators={[VALIDATOR_MINLENGTH(5)]} errorText={"Password is weak"} onInput={changeHandler} />
            <Button type="submit" disabled={!state.isValid}>{isLoginMode ? 'Login' : 'SignUp'}</Button>
        </form>

        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SignUp' : 'Login'}</Button>
    </Card>
}

export default Auth