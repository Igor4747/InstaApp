import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from 'react';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import AddPhoto from './AddPhoto';
import NotFound from './NotFound';

function App() {

  const INIT_OBJ = {
    token: "token",
    userlogged: false,
    userID: "id"
  }

  let [Input, update] = useState(INIT_OBJ)

  const updateToken = (token_input) => {
    let updateVal = { token: token_input }
    update(Input => ({
      ...Input,
      ...updateVal
    }))
  }

  const updateUsername = (name, lastname) => {
    let updateVal = { username: name + " " + lastname }
    update(Input => ({
      ...Input,
      ...updateVal
    }))
  }

  const updateUserStatus = (input) => {
    let updateVal = { userlogged: input}
    update(Input => ({
      ...Input,
      ...updateVal
    }))
  }

  const updateID = (id) => {
    let updateVal = { userID: id }
    update(Input => ({
      ...Input,
      ...updateVal
    }))
  }



  return (
    <>
      <Router>
        <div className="menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/addphoto">Add Photo</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>


        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route exact path="/" element={<Home token={Input.token} userlogged={Input.userlogged} login={<Link to="/login">here</Link>} />} />
          <Route exact path="/login" element={<Login token={Input.token} userlogged={Input.userlogged} updateToken={updateToken} updateUserStatus={updateUserStatus} updateUsername={updateUsername} updateID={updateID} register={<Link to="/register">here</Link>} home={<Link to="/">Back to Home page</Link>} />} />
          <Route exact path="/profile" element={<Profile token={Input.token} userlogged={Input.userlogged} login={<Link to="/login">here</Link>} />} />
          <Route exact path="/addphoto" element={<AddPhoto token={Input.token} userlogged={Input.userlogged} userID={Input.userID} username={Input.username} login={<Link to="/login">here</Link>} home={<Link to="/">Back to Home page</Link>} />} />
          <Route exact path="/register" element={<Register token={Input.token} userlogged={Input.userlogged} />} />
        </Routes>

      </Router>
      {/* <p>{JSON.stringify(Input, null, 5)}</p> */}
    </>
  );
}

export default App;
