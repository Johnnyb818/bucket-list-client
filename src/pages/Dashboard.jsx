import React from "react"
import {useAppState} from "../AppState.jsx"
import {Route, Link} from "react-router-dom"
import Form from "../components/Form.jsx"

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
    <h1>{username}'s Bucket List</h1>
    <Link to="/dashboard/new"><button>New Bucket</button></Link>
    <Route path="/dashboard/:action" render={(rp) => <Form {...rp} getBuckets={getBuckets}/>}/>
    <ul>
      {state.buckets.map(bucket =>( 
        <div className="bucket" key={bucket.id}>
          <img src={bucket.image}/>
          <h2>{bucket.title}</h2>
          <h3>{bucket.location}</h3>
          <h4>{bucket.description}</h4>
          <button onClick={() =>{
            dispatch({type: "select", payload: bucket})
            props.history.push("/dashboard/edit")
          }}>Edit Bucket</button> 
          <button onClick={() =>{
            fetch(url + "/buckets/" + bucket.id, {
              method: "delete",
              headers: {
                Authorization: "bearer " + token
              }
            })
            .then(() => getBuckets())
          }}>Delete Bucket</button>     
        </div>
      ))}
    </ul>
    </div>
  )}


  return buckets ? loaded() : <h1>Loading...</h1>;
}

export default Dashboard