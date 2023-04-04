import React, { useState, useEffect, useRef } from 'react';
import { VirtualScroller } from 'primereact/virtualscroller';
import { Skeleton } from 'primereact/skeleton';
import { classNames } from 'primereact/utils';  
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
    const [lazyItems, setLazyItems] = useState([]);
    const [lazyLoading, setLazyLoading] = useState(true);
    const loadLazyTimeout = useRef(null);
    const [modalShow, setmodalShow] = useState(false);
    const [showData, setData] = useState({});
    const [S1, setS1] = useState('');
    const [S2, setS2] = useState('');
    const [result, setresult] = useState('');
    const [status, setstatus] = useState(0);





    useEffect(() => {
        axios.get('https://hacker-news.firebaseio.com/v0/updates.json?print=pretty').then((response) => {
        setLazyItems(response.data.items)
       
                  console.log(response.data.items)
                });
        setLazyLoading(false);
        setmodalShow(false)
        setresult('')
    }, []);

    const getItem =(id) =>{

        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then((response) => {
        setData(response.data)
                  console.log(response.data)
                 
                  setmodalShow(true)
                });
    }
    const onLazyLoad = (event) => {
        setLazyLoading(true);

        if (loadLazyTimeout.current) {
            clearTimeout(loadLazyTimeout.current);
        }

        loadLazyTimeout.current = setTimeout(() => {
            const { first, last } = event;
            const _lazyItems = [...lazyItems];

            for (let i = first; i < last; i++) {
                _lazyItems[i] = _lazyItems[i]
            }

            setLazyItems(_lazyItems);
            setLazyLoading(false);
        }, Math.random() * 1000 + 250);
    };

    const itemTemplate = (item, options) => {
        const className = classNames('flex align-items-center p-2', {
            'surface-hover': options.odd
        });
     
        return (
            <div className={className} >
           <div>{item}</div>  
            <div className='view-more ' ><button className='btn btn-primary' type="button" onClick={() => getItem(item)}>View More</button></div> 
          </div>
        );
    };
const onsubmit =()=>{

   
        let lens1 = S1.length;
        let lens2 = S2.length;
        if(lens1 !== lens2){
            setstatus(1)
           setresult('Invalid Input')
           toast.warning('Invalid Input', {
            position: toast.POSITION.BOTTOM_RIGHT
          });
           console.log('Invalid Input');
           return
        }
        let s1Str = S1.split('').sort().join('');
        let s2Str = S2.split('').sort().join('');
        if(s1Str === s2Str){
           setstatus(0)
           setresult('S1 And S2  Anagram')
           toast.success('S1 And S2  Anagram', {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } else { 
           setstatus(1)
           setresult('S1 And S2 Not Anagram')
           toast.error('S1 And S2 Not Anagram', {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
     
     

}
    const loadingTemplate = (options) => {
        const className = classNames('flex align-items-center p-2', {
            odd: options.odd
        });

        return (
            <div className={className} style={{ height: '50px' }}>
                <Skeleton width={options.even ? '60%' : '50%'} height="1.3rem" />
            </div>
        );
    };

    return ( 
        <>
        <div className="card flex justify-content-center">
         <div>
          <h3>Latest News list </h3>
          
          </div>
            <VirtualScroller items={lazyItems} itemSize={50} itemTemplate={itemTemplate} lazy onLazyLoad={onLazyLoad} loadingTemplate={loadingTemplate}
                showLoader loading={lazyLoading} className="border-1 surface-border border-round" style={{ width: '100%', height: '400px' }} />
   
   <Modal show={modalShow} onHide={() => setmodalShow(false)} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
          
           <h5>{showData.id} Details</h5>
          
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
          <h2>{showData.type}:</h2>
          <p>{showData.text}</p>
          <h6>-{showData.by}</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setmodalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        </div>
        <div className="card flex justify-content-center">
        <h3>Anagram Check </h3>
       
            <Row>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>S1</Form.Label>
                  <Form.Control type="input" placeholder="Enter S1" value={S1} onChange={(e) => setS1(e.target.value)} />

                </Form.Group>
              </Col>
              <Col xs={6} md={6}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>S2</Form.Label>
                  <Form.Control type="input" placeholder="Enter S2" value={S2} onChange={(e) => setS2(e.target.value)} />

                </Form.Group>
              </Col>
            </Row>

            <Row>
            <Col xs={2} md={2}>
            <Button variant="success" onClick={() => onsubmit()}>Check</Button>
            </Col>
            <Col xs={6} md={6}>
            <h2 className={status == 0 ? "text-success":"text-danger"}>{result}</h2>
            </Col>
            </Row>
           
         
          <ToastContainer />
            </div>
        
    </>
    );
}
        