import React from "react";
import {useAppState} from "../AppState.jsx";

const Form = (props) => {
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
      <div className="form">
          <form onSubmit={handleSubmit}>
              <input type="text" name="title" value={formData.title} onChange={handleChange}></input>
              <input type="text" name="location" value={formData.location} onChange={handleChange}></input>
              <input type="text" name="description" value={formData.description} onChange={handleChange}></input>
              <input type="text" name="image" value={formData.image} onChange={handleChange}></input>
              <input type="submit" value={action}/>
          </form>
      </div>
  );
};

export default Form;