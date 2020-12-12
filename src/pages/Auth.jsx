import React from "react"
import {useAppState} from "../AppState.jsx"
import { Form, Button, Container } from 'react-bootstrap'

const Auth = (props) => {
    const type = props.match.params.form;
    const [formData, setFormData] = React.useState({
      username: "",
      password: "",
    });
    const [userData, setUserData] = React.useState(null);
    const { state, dispatch } = useAppState();

    React.useEffect(() => {
      if (userData) {
        const { token, user } = userData;
        dispatch({ type: "auth", payload: { token, username: user.username } });
        window.localStorage.setItem("auth", JSON.stringify({ token, username: user.username }))
        props.history.push("/dashboard");
      }
    }, [userData]);

    const actions = {
      signup: () => {
        return fetch(state.url + "/users", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }).then((response) => response.json());
      },
      login: () => {
        return fetch(state.url + "/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
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
      actions[type]().then((data) => {
        setUserData(data);
      });
    };

    return <Container className="auth">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange}/>
          </Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}/>
            <Button className="auth-button" variant="info" type="submit">{type}</Button>
        </Form>
      </Container>
    
}

export default Auth