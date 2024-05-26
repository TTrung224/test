import Modal from 'react-bootstrap/Modal';

const StatusModal = ({modal, setModal, successMsg, failMsg}) => {
    function handleCloseModal(){
        setModal({show: false, success: modal.success})
    }
    return (
        <Modal show={modal.show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                {modal.success ?
                    <Modal.Title>Success</Modal.Title> :
                    <Modal.Title>Failed</Modal.Title>
                }
            </Modal.Header>
            <Modal.Body>
                {modal.success ?
                    <p>{successMsg}</p> :
                    <p>{failMsg}</p>
                }

            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={() => handleCloseModal()}>Close</button>
            </Modal.Footer>
        </Modal>
    );
}

export default StatusModal;