import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true; // overall form validity
            for (const inputId in state.inputs) { // loop through all inputs
                if (!state.inputs[inputId]) { // if input is not in the state (e.g. optional fields)
                    continue;
                }
                if (inputId === action.inputId) { // if this is the input that changed
                    formIsValid = formIsValid && action.isValid; // use the new validity
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid; // use the old validity
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            };
        default:
            return state;
    }
};


export const useForm = (initialInputs, initialFormValidity) => {
    const [state, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    const changeHandler = useCallback((id, value, isValid) => {
        dispatch({ type: 'INPUT_CHANGE', value: value, isValid: isValid, inputId: id });
    }, []);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({ type: 'SET_DATA', inputs: inputData, formIsValid: formValidity });
    }, []);

    return [state, changeHandler, setFormData];
}