import React from "react";
import {useAppState} from "../AppState.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button, Container } from 'react-bootstrap'

const Form1 = (props) => {
  const {state, dispatch} = useAppState();
  const {token} = state
  const action = props.match.params.action
  const [formData, setFormData] = React.useState(state[action])

  const actions = {
    new: () => {
      return fetch(state.url + "/buckets", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json());
    },
    edit: () => {
      return fetch(state.url + "/buckets/" + state.edit.id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json());
    },
  };

  const handleChange = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    actions[action]().then((data) => {
      props.getBuckets()
      props.history.push("/dashboard/")
    });
  };


  return (
      <Container>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Control className="form-line" type="text" name="title" placeholder="Bucket List Activity" value={formData.title} onChange={handleChange}/>
                <Form.Control className="form-line" type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange}/>
                <Form.Control className="form-line" type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange}/>
                <Form.Control className="form-line" type="text" name="image" placeholder="Image" value={formData.image} onChange={handleChange}/>
                <Button variant="info" type="submit">Add New Adventure</Button>
            </Form.Group>
        </Form>
      </Container>
  );
};

export default Form1;