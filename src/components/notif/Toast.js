import React, { useState } from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

const Toastt = ({msg,topMsg,coloor}) => {
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);
    const [msgg, setMsgg] = useState(msg);
    const [topMsgg, setTopMsgg] = useState(topMsg);
    const [colooor, setColooor] = useState(coloor);

    return (
        <Row style={{top:'10%',width: '-webkit-fill-available',left:'38%'}} className="position-absolute">
            <Col md={6} className="mb-2">
            <Toast show={showA} onClose={toggleShowA} delay={3000} autohide>
                <Toast.Header>
                <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                />
                <strong className="me-auto" style={{color:`${colooor}`}}>{topMsgg}</strong>
                {/* <small>11 mins ago</small> */}
                </Toast.Header>
                <Toast.Body>{msgg}</Toast.Body>
            </Toast>
            </Col>
        </Row>
    );
};

export default Toastt;