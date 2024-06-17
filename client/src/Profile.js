import { useState } from 'react';

const Profile = (props) => {

    const INIT_PROFILE = {
        email: "",
        name: "",
        lastname: "",
        id: "",
        nameChanged: "",
        lastnameChanged: "",
        image: "profile-pic.png",
        file: ""
    }
    let [Input, setProfile] = useState(INIT_PROFILE)

    const changeinfo = (updateVal) => {
        setProfile(Input => ({
            ...Input,
            ...updateVal
        }))
    }

    if (props.userlogged === true) {
        const userInfoWithAuth = async () => {
            try {
                const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + props.token, }
                let result = await fetch("http://localhost:4000/api/profile", { method: "GET", headers: headers })
                let data = await result.json()
                console.log(data.decoded)
                document.getElementById("profile").style.visibility = "visible"
                document.getElementById("button").style.display = "none"
                let updateVal = { email: data.decoded.email, name: data.decoded.name, lastname: data.decoded.lastName, id: data.decoded.id }
                changeinfo(updateVal)
                // setProfile(Input => ({
                //     ...Input,
                //     ...updateVal
                // }))
            } catch (ex) {
                console.log(ex);
            }
        }
        // userInfoWithAuth()

        const changeInfoWithAuth = async () => {
            try {
                let body = JSON.stringify({
                    "name": Input.nameChanged,
                    "lastName": Input.lastnameChanged
                })
                console.log(body)
                const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + props.token }
                let result = await fetch("http://localhost:4000/api/profile", { method: "PATCH", headers: headers, body: body })
                let data = await result.json()
                console.log(data)
                let updateVal = { name: Input.nameChanged, lastname: Input.lastnameChanged }
                setProfile(Input => ({
                    ...Input,
                    ...updateVal
                }))
                document.getElementById("panel").open = false
                let info = document.createElement("div")
                document.body.appendChild(info)
                info.className = "login-info"
                info.innerHTML = "Zmieniono dane użytkownika"
                info.style.animationName = "disapear";
            } catch (ex) {
                console.log(ex);
            }
        }

        const postProfileImage = async () => {
            if (Input.file) {
                let name = (Input.file.name).toString()
                let arr = name.split(".")
                let FileType = arr[arr.length - 1]
                if (FileType === "jpg" || FileType === "jpeg" || FileType === "png") {
                    const fd = new FormData()
                    fd.append("file", Input.file)
                    fd.append("album", Input.id)
                    try {
                        const headers = { 'Authorization': 'Bearer ' + props.token }
                        let result = await fetch("http://localhost:4000/api/profile", { method: "POST", body: fd, headers: headers })
                        let data = await result.json()
                        console.log(data)
                        let info = document.createElement("div")
                        document.body.appendChild(info)
                        info.className = "login-info"
                        info.innerHTML = "Wysyłanie zdjęcia powiodło się"
                        info.style.animationName = "disapear";
                        document.getElementById("panel-image").open = false
                    } catch (ex) {
                        console.log(ex);
                    }
                }
                else {
                    let info = document.createElement("div")
                    document.body.appendChild(info)
                    info.className = "login-info"
                    info.innerHTML = 'Wybierz plik z rozszerzeniem "jpg", "jpeg" lub "png"'
                    info.style.animationName = "disapear";
                }
            }
            else {
                let info = document.createElement("div")
                document.body.appendChild(info)
                info.className = "login-info"
                info.innerHTML = "Wybierz plik"
                info.style.animationName = "disapear";
            }
        }

        const showPanel = () => {
            document.getElementById("panel").open = true
        }

        const showPanel2 = () => {
            document.getElementById("panel-image").open = true
        }

        const changeName = (event) => {
            let updateVal = { nameChanged: event.target.value }
            setProfile(Input => ({
                ...Input,
                ...updateVal
            }))
        }

        const changeLastname = (event) => {
            let updateVal = { lastnameChanged: event.target.value }
            setProfile(Input => ({
                ...Input,
                ...updateVal
            }))
            console.log(Input)
        }

        const changeFileInfo = (event) => {
            let updateVal = { file: event.target.files[0] }
            setProfile(Input => ({
                ...Input,
                ...updateVal
            }))
        }

        // const logout = async () => {
        //     console.log("wylogowywanie")
        //     try {
        //         const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + props.token }
        //         let result = await fetch("http://localhost:3000/api/user/logout", { method: "GET", headers: headers })
        //         let data = await result.json()
        //         console.log(data)
        //         let updateVal = { name: Input.nameChanged, lastname: Input.lastnameChanged }
        //         setProfile(Input => ({
        //             ...Input,
        //             ...updateVal
        //         }))
        //         document.getElementById("panel").open = false
        //         let info = document.createElement("div")
        //         document.body.appendChild(info)
        //         info.className = "login-info"
        //         info.innerHTML = "Wylogowano"
        //         info.style.animationName = "disapear";
        //     } catch (ex) {
        //         console.log(ex);
        //     }
        // }

        return (
            <div className="content-main">

                <button className="load" id="button" onClick={userInfoWithAuth}>Load info</button><br></br>

                <div className="profile-box" id="profile">
                    <img className="profile-image-1" src={Input.image} alt="profile pic"></img><br></br>
                    <button className="panel-button-2" onClick={showPanel2}>Change Profile Image</button><br></br>
                    <div className="row">
                        E-mail:
                        <p>
                            {Input.email}
                        </p>
                    </div>
                    <div className="row">
                        Name:
                        <p>
                            {Input.name}
                        </p>
                    </div>
                    <div className="row">
                        Lastname:
                        <p>
                            {Input.lastname}
                        </p>
                    </div>
                    <div className="row">
                        ID:
                        <p>
                            {Input.id}
                        </p>
                    </div>
                    <button className="panel-button" onClick={showPanel}>Change info</button><br></br>
                    {/* <button className="panel-button" onClick={logout}>Logout</button><br></br> */}
                </div>
                <dialog id="panel">
                    Name:<br></br>
                    <input onChange={changeName}></input><br></br>
                    Lastname:<br></br>
                    <input onChange={changeLastname}></input><br></br>
                    <button className='confirm' onClick={changeInfoWithAuth}>Save</button>
                </dialog>
                <dialog id="panel-image">
                    <div className="file-input">
                        <p>Choose an image</p>
                        <input type="file" onChange={changeFileInfo}></input>
                        <br></br>
                        <button className="confirm" onClick={postProfileImage}>Confirm</button>
                    </div>
                </dialog>
            </div >
        )
    }
    else {
        return (
            <>
                <div className="content-info">
                    Login <i className='login-button'> {props.login}</i> to show profile
                </div>
            </>
        )
    }
}
export default Profile