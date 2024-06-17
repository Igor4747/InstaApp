import { useState } from 'react';

const Login = (props) => {

    let INIT_LOGIN = {
        email: "",
        pass: ""
    }
    let [Input, setLogin] = useState(INIT_LOGIN)

    if (props.userlogged === true) {
        return (
            <div className="content-main">
                You're already logged in<br></br>
                {props.home}
            </div>
        )
    }
    else {
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

        const Login = async () => {
            console.log(Input)
            const body = JSON.stringify({
                "email": Input.email,
                "password": Input.pass
            })
            try {
                const headers = { 'Content-Type': 'application/json' }
                let result = await fetch("http://localhost:4000/api/user/login", { method: "POST", headers: headers, body: body })
                let data = await result.json()
                console.log(data)
                if (data.user) {
                    if (data.user.confirmed === true) {
                        props.updateToken(data.token)
                        props.updateUserStatus(true)
                        props.updateID(data.user.id)
                        props.updateUsername(data.user.name, data.user.lastName)
                        let info = document.createElement("div")
                        document.body.appendChild(info)
                        info.className = "login-info"
                        info.innerHTML = "Logowanie powiodło się"
                        info.style.animationName = "disapear";
                        document.getElementById("back-to-home").open = true
                    }
                }
                else {
                    let info = document.createElement("div")
                    document.body.appendChild(info)
                    info.className = "login-info"
                    info.innerText = data
                    info.style.animationName = "disapear";
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        return (
            <>
                <div className="login" id="login-box">
                    email:
                    <br></br>
                    <input className='email' id="email" onChange={changeEmail}></input>
                    <br></br>
                    password:
                    <br></br>
                    <input className='password' id="pass" type="password" onChange={changePass}></input>
                    <br></br>
                    <button className="submit" onClick={() => Login()}>Login</button>
                    <p className="register">If You don't have an account register <i className='register-button'>{props.register}</i></p>
                    {props.userlogged}
                </div>
                <dialog id="back-to-home">
                    {props.home}
                </dialog>
            </>
        )
    }
}


export default Login