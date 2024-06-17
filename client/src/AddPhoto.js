import { useState } from 'react';

const AddPhoto = (props) => {

    let INIT_LOGIN = {
        file: "",
        user: props.token.user,
        caption: ""
    }
    let [Input, setPath] = useState(INIT_LOGIN)

    if (props.userlogged === true) {
        const changeFileInfo = (event) => {
            let updateVal = { file: event.target.files[0] }
            setPath(Input => ({
                ...Input,
                ...updateVal
            }))
        }
        const changeFileCaption = (event) => {
            let updateVal = { caption: event.target.value }
            setPath(Input => ({
                ...Input,
                ...updateVal
            }))
        }
        const patchCaptionToServer = async (id) => {
            const body = JSON.stringify({
                "status": "caption",
                "value": Input.caption
            })
            try {
                const headers = { 'Content-Type': 'application/json' }
                let result = await fetch("http://localhost:4000/api/images/" + id, { method: "PATCH", headers: headers, body: body })
                console.log("result", await result.json())
            } catch (ex) {
                console.log(ex);
            }
        }

        const patchUsernameToServer = async (id) => {
            const body = JSON.stringify({
                "status": "username",
                "value": props.username
            })
            try {
                const headers = { 'Content-Type': 'application/json' }
                let result = await fetch("http://localhost:4000/api/images/" + id, { method: "PATCH", headers: headers, body: body })
                console.log("result", await result.json())
            } catch (ex) {
                console.log(ex);
            }
        }

        const postFileToServer = async () => {
            if (Input.file) {
                let name = (Input.file.name).toString()
                let arr = name.split(".")
                let FileType = arr[arr.length - 1]
                if (FileType === "jpg" || FileType === "jpeg" || FileType === "png") {
                    const fd = new FormData()
                    fd.append("file", Input.file)
                    fd.append("album", props.userID)
                    try {
                        let result = await fetch("http://localhost:4000/api/images", { method: "POST", body: fd })
                        let data = await result.json()
                        if (Input.caption.length > 0) {
                            patchCaptionToServer(data.image.id);
                        }
                        patchUsernameToServer(data.image.id);
                        let info = document.createElement("div")
                        document.body.appendChild(info)
                        info.className = "login-info"
                        info.innerHTML = "Wysyłanie zdjęcia powiodło się"
                        info.style.animationName = "disapear";
                        document.getElementById("back-to-home").open = true
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

        return (
            <>
                <div className="content-main">
                    <div className="file-input">
                        <p>Choose an image</p>
                        <input type="file" onChange={changeFileInfo}></input>
                        <br></br>
                        Type post caption<br></br>
                        <textarea onChange={changeFileCaption}></textarea>
                        <br></br>
                        <button className="confirm" onClick={postFileToServer}>Send</button>
                    </div>
                </div>
                <dialog id="back-to-home">
                    {props.home}
                </dialog>
            </>
        )
    }
    else {
        return (
            <>
                <div className="content-info">
                    Login <i className='login-button'> {props.login}</i> to add photos
                </div>
            </>
        )
    }
}


export default AddPhoto