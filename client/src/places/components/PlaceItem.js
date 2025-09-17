import { useState } from "react"
import Button from "../../shared/components/FormElements/Button"
import Card from "../../shared/components/UIElements/Card"
import Modal from "../../shared/components/UIElements/Modal"
import Map from "../../shared/components/UIElements/Map"
import { useAuth } from "../../shared/context/authContext"
import { useHttpClient } from "../../shared/hooks/http"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"

const PlaceItem = ({ id, image, title, description, address, coordinates, onDelete, creatorId }) => {
    const auth = useAuth();
    const {isLoading, error, sendRequest, cleanError} = useHttpClient();
    const [showMap, setShowMap] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const openConfirmModalHandler = () => setShowConfirmModal(true)
    const closeConfirmModalHandler = () => setShowConfirmModal(false)

    const openMapHandler = () => setShowMap(true)
    const closeMapHandler = () => setShowMap(false)

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false)
        const res = await sendRequest(`/places/${id}`, 'DELETE',null,  { Authorization: `Bearer ${auth.token}`})
        if(res) {
            onDelete(id)
        }
    }

    return (
        <>
            <li key={id} className='place-item'>
                <Card className='place-item__content' >
                    {
                        isLoading && <LoadingSpinner asOverlay />
                    }
                    <div className='place-item__image'>
                        <img src={`${process.env.REACT_APP_BACKEND_HOST}/${image}`} alt={title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{title}</h2>
                        <h3>{address}</h3>
                        <p>{description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>View on Map</Button>
                        {auth.user.id === creatorId && <>
                            <Button to={`/places/${id}`}>Edit</Button>
                            <Button onClick={openConfirmModalHandler} danger>Delete</Button>
                        </>
                        
                        }
                    </div>
                </Card>
            </li>
            <ErrorModal error={error} onClear={cleanError} />
            <Modal show={showMap} onCancel={closeMapHandler} header={address} contentClass='place-item__modal-content' footerClass='place-item__modal-actions' footer={<Button onClick={closeMapHandler}>Close</Button>}>
                <div className='map-container'>
                    <Map center={coordinates} zoom={16}/>
                </div>
            </Modal>
            <Modal 
                header="Are you sure?" 
                show={showConfirmModal} 
                onCancel={closeConfirmModalHandler} 
                footerClass='place-item__modal-actions' 
                footer={<>
                    <Button danger onClick={confirmDeleteHandler}>Delete</Button>
                    <Button inverse onClick={closeConfirmModalHandler}>Cancel</Button>
                </>}>
                <p>Are you sure you want to delete this place?</p>
            </Modal>
        </>
    )
}

export default PlaceItem