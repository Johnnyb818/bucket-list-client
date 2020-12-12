import React from "react"
import {useAppState} from "../AppState.jsx"
import {Route, Link} from "react-router-dom"
import Form from "../components/Form.jsx"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'

const Dashboard = (props) => {

  const { state, dispatch } = useAppState()
  const { token, url, buckets, username } = state

  const getBuckets = async () => {
    const response = await fetch(url + "/buckets/", {
      method: "get",
      headers: {
        Authorization: "bearer " + token
      }
    })
    const fetchedBuckets = await response.json()
    dispatch({type: "getBuckets", payload: fetchedBuckets} )
  }

  React.useEffect(() => {getBuckets()}, [])

  const loaded = () => {
    
    return (
    <div className= "dashboard">
    <br/>
    <h1>{username}'s Bucket List</h1>
    <br/>
    <Link to="/dashboard/new"><Button className="new-item-button" variant="info">Add New List Item</Button></Link>
    <br/>
    <Route path="/dashboard/:action" render={(rp) => <Form {...rp} getBuckets={getBuckets}/>}/>
    <br/>
      <Container>
        <Row>          
        {state.buckets.map(bucket =>(
          <Col>
            <Card className="card-div" key={bucket.id}>
              <Card.Img src={bucket.image}/>
              <Card.Body>
                <Card.Title>{bucket.title}</Card.Title>
                <Card.Text>{bucket.location}</Card.Text>
                <Card.Text>{bucket.description}</Card.Text>
                <Button variant="warning" onClick={() =>{
                  dispatch({type: "select", payload: bucket})
                  props.history.push("/dashboard/edit")
                }}>Edit</Button> 
                <Button variant="danger" onClick={() =>{
                  fetch(url + "/buckets/" + bucket.id, {
                    method: "delete",
                    headers: {
                      Authorization: "bearer " + token
                    }
                  })
                  .then(() => getBuckets())
                }}>Delete</Button>     
              </Card.Body>
            </Card>
          </Col> 
        ))}
        </Row>
      </Container>
    </div>
  )}


  return buckets ? loaded() : <h1>Loading...</h1>;
}

export default Dashboard