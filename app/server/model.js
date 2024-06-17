class Image {
    constructor(id, album, originalName, url, lastChange, history) {
        this.id = id;
        this.album = album;
        this.originalName = originalName;
        this.url = url;
        this.lastChange = lastChange;
        this.history = history
    }
}
const images = [];

class Tag {
    constructor(id, name, popularity) {
        this.id = id
        this.name = name
        this.popularity = popularity
    }
}
const tags = []

class User {
    constructor(id, name, lastName, email, confirmed, password) {
        this.id = id
        this.name = name
        this.lastName = lastName
        this.email = email
        this.confirmed = confirmed
        this.password = password
    }
}
const users = [
    {
        id: 1211,
        name: "Bob",
        lastName: "Marley",
        email: "bob@onet.pl",
        confirmed: true,
        password: "$2a$10$.OgXvNm1N2po1GklWqMJXODiT9UA7Ard1/bxTj5pI74Vjp87Seo7."
    }
]

let TagString = `#love
#instagood
#fashion
#photooftheday
#art
#photography
#instagram
#beautiful
#picoftheday
#nature
#happy
#cute
#travel
#style
#followme
#tbt
#instadaily
#repost
#like4like
#summer
#beauty
#fitness
#food
#selfie
#me
#instalike
#girl
#friends
#fun
#photo
`
let names = TagString.split('\n')
names.map(function (elem, i) {
    if ((i + 1) != names.length) {
        tags.push({
            id: i + 1,
            name: elem,
            popularity: Math.floor(Math.random() * 100)
        })
    }
})

const DeletedTokens = []



module.exports = { Tag, tags, Image, images, User, users, DeletedTokens };