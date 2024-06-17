const Home = (props) => {

    // let alreadyPosted = false

    if (props.userlogged === true) {

        const getAll = async () => {
            try {
                let result = await fetch("http://localhost:4000/api/images", { method: "GET" })
                let data = await result.json()
                data.forEach(elem => {
                    let post = document.createElement("div")
                    post.className = "post"
                    let image = document.createElement("img")
                    image.src = "http://localhost:4000/api/getfile/" + elem.id
                    image.className = "post-image"
                    // image.src = "../../" + elem.url
                    let desc = document.createElement("div")
                    let caption
                    let timeStamp
                    let username
                    let history = elem.history
                    history.forEach(stamp => {
                        console.log(stamp)
                        if (stamp.status === "caption") {
                            caption = stamp.value
                            timeStamp = stamp.timestamp
                        }
                        if (stamp.status === "username") {
                            username = stamp.value
                        }
                    })
                    console.log(username)
                    let timeArr = timeStamp.split("_")
                    let autor = document.createElement("p")
                    autor.innerText = username
                    autor.className = "post-autor"
                    let time = document.createElement("p")
                    console.log(timeArr)
                    time.innerHTML = timeArr[0] + "<br>" + timeArr[1]
                    time.className = "post-timestamp"
                    let postCaption = document.createElement("p")
                    postCaption.innerText = caption
                    desc.appendChild(autor)
                    desc.appendChild(postCaption)
                    desc.appendChild(time)
                    desc.className = "post-text"
                    post.appendChild(image)
                    post.appendChild(desc)
                    document.getElementById("feed").appendChild(post)
                });
                document.getElementById("load").style.display = "none"
            } catch (ex) {
                console.log(ex);
            }
        }

        return (
            <div className="content-main" id="feed">
                <button className="load" id="load" onClick={getAll}>Load Feed</button>
            </div>
        )
    }
    else {
        return (
            <>
                <div className="content-info">
                    Login <i className='login-button'> {props.login}</i> to show feed
                </div>
            </>
        )
    }
}

export default Home