import { useEffect, useRef, useState } from 'react';
import Button from './Button'
import './FromElements.css';

const ImageUpload = ({id, center, onInput, errorText}) => {

    const filePickerRef = useRef()
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if(!file) return
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }, [file])

    const pickerImageHandler = () => {
        filePickerRef.current.click()
    }

    const pickedHandler = e => {
        let pickedFile;
        let fileIsValid = isValid
        if(e.target.files || e.target.files.length === 0) {
            pickedFile = e.target.files[0];
            fileIsValid = true;
            setFile(pickedFile)
            setIsValid(true)
        } else {
            setIsValid(false)
        }
        onInput(id, pickedFile, fileIsValid)
    }

  return (
    <div className='form-control'>
        <input onChange={pickedHandler} ref={filePickerRef} type='file' id={id} style={{display: 'none'}} accept='.jpg,.png,.jpeg' />
        <div className={`image-upload ${center && 'center' }`}>
            <div className='image-upload__preview'>
                {previewUrl ? <img src={previewUrl} alt='preview' /> : <p>Please pick an image</p>}
            </div>
            <Button type="button" onClick={pickerImageHandler}>Pick Image</Button>
        </div>
        {!isValid && <p>{errorText}</p>}
    </div>
  )
}

export default ImageUpload