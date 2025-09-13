import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequest = useRef([]);

    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach(abortctr => abortctr.abort())
        };
    }, [])
    
    const sendRequest = useCallback(async (url, method = "GET", data = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequest.current.push(httpAbortController);
        try {
            const res = await axios({
                url,
                method,
                data,
                headers,
                signal: httpAbortController.signal
            })

            activeHttpRequest.current = activeHttpRequest.current.filter(reqCtr => reqCtr !== httpAbortController)

            return res;
        } catch (err) {
            setError(err?.response?.data.message || "something went wrong")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearError = () => {
        setError(null)
    }

    return {isLoading, error, sendRequest, clearError}
}