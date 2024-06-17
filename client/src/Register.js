import { useState } from 'react';
const Register = (props) => {
    let INIT_LOGIN = {
        name: "",
        lastname: "",
        email: "",
        pass: ""
    }
    let [Input, setLogin] = useState(INIT_LOGIN)

    if (props.userlogged === true) {
        return (
            <div className="content-info">
                You're already logged in
            </div>
        )
    }
    else {

        const changeName = (event) => {
            let updateVal = { name: event.target.value }
            setLogin(Input => ({
                ...Input,
                ...updateVal
            }))
        }
        const changeLastname = (event) => {
            let updateVal = { lastname: event.target.value }
            setLogin(Input => ({
                ...Input,
                ...updateVal
            }))
        }

        const changeEmail = (event) => {
            let updateVal = { email: event.target.value }
            setLogin(Input => ({
                ...Input,
                ...updateVal
            }))
        }

        const changePass = (event) => {
            let updateVal = { pass: event.target.value }
            setLogin(Input => ({
                ...Input,
                ...updateVal
            }))
        }

        const closeDialog = () => {
            document.getElementById("confirm").open = false
        }

        const Register = async () => {
            console.log(Input)
            const body = JSON.stringify({
                "name": Input.name,
                "lastName": Input.lastname,
                "email": Input.email,
                "password": Input.pass
            })
            try {
                const headers = { 'Content-Type': 'application/json' }
                let result = await fetch("http://localhost:4000/api/user/register", { method: "POST", headers: headers, body: body })
                let data = await result.json()
                console.log(data)
                let dialog = document.getElementById("confirm")
                let text = document.getElementById("info")
                text.innerHTML = data
                dialog.open = true
            } catch (ex) {
                alert(ex)
                console.log(ex);
            }
        }
        return (
            <>
                <div className="register-panel">
                    <h1>Register</h1>
                    Name:
                    <br></br>
                    <input className='name' id="name" onChange={changeName}></input>
                    <br></br>
                    Lastname:
                    <br></br>
                    <input className='lastname' id="lastname" onChange={changeLastname}></input>
                    <br></br>
                    Email:
                    <br></br>
                    <input className='email' id="email" onChange={changeEmail}></input>
                    <br></br>
                    Password:
                    <br></br>
                    <input className='password' id="pass" type="password" onChange={changePass}></input>
                    <br></br>
                    <button className="confirm" onClick={() => Register()}>Confirm</button>
                    <dialog id="confirm">
                        <p id="info">Info</p>
                        <button className='close-dialog' onClick={closeDialog}>
                            OK
                        </button>
                    </dialog>
                </div>
            </>
        )
    }
}
export default Register