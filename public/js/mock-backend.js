const MOCK_CLASSES = [
    {
        classId: 'C-1',
        name: 'Class 1',
        prereqs: []
    },
    {
        classId: 'C-2',
        name: 'Class 2',
        prereqs: [
            'C-1'
        ]
    },
    {
        classId: 'C-3',
        name: 'Class 3',
        prereqs: [
            'C-2'
        ]
    },
    {
        classId: 'C-4',
        name: 'Class 4',
        prereqs: [
            'C-3'
        ]
    },
    {
        classId: 'C-5',
        name: 'Class 5',
        prereqs: [
            'C-2',
            'C-3'
        ]
    },
]
const MOCK_MAJORS = {
    // 'CSD': 'CSD',
    // 'CS': 'CS',
    // 'DTA': 'DTA',
    'AAS-T': 'AAS-T',
    'BS': 'BS',
    'BAS': 'BAS'
}

const MAJOR_CLASSES = {
    'AAS-T': [
        {
            quarter: 1,
            classes: [
                'C-1'
            ],
        },
        {
            quarter: 2,
            classes: [
                'C-2'
            ]
        },
    ],
    'BS': [
        {
            quarter: 1,
            classes: [
                'C-1'
            ]
        },
        {
            quarter: 2,
            classes: [
                'C-2'
            ],
        },
        {
            quarter: 3,
            classes: [
                'C-3'
            ]
        },
    ],
    'BAS': [
        {
            quarter: 1,
            classes: [
                'C-1'
            ]
        },
        {
            quarter: 2,
            classes: [
                'C-2'
            ],
        },
        {
            quarter: 3,
            classes: [
                'C-3'
            ]
        },
        {
            quarter: 4,
            classes: [
                'C-4',
                'C-5'
            ]
        }
    ],
}

function loadMajors() {
    const output = {}
    Object.keys(MOCK_MAJORS).forEach((major) => {
        const classesByMajor = loadClassesByMajor(major)
        output[major] = {
            major: major,
            classes: classesByMajor
        }
    })
    return output
}

function selectClassesByIds(classIds) {
    return MOCK_CLASSES.filter((cls) => {
        return classIds.find((classId) => cls.classId === classId)
    })
}

function loadClassesByMajor(major) {
    if (Object.prototype.hasOwnProperty.call(MAJOR_CLASSES, major)) {
        return MAJOR_CLASSES[major].map((quarter) => {
            const classes = selectClassesByIds(quarter.classes)
            return {
                quarter: quarter.quarter,
                classes: classes
            }
        })
    } else {
        throw new Error(`UnknownMajor:${major}`)
    }
}

const MOCK_USER_PROFILES = {
    'zoe': {
        id: 'MockID 1101',
        login: 'zoe',
        name: 'Zoe Zhang',
        password: '1234',
        major: 'BAS',
    }
}


// use this as the token to represent the user has logged in.
const MOCK_SECRET_LOGIN_TOKEN = 'this is the secret login token' // the data doesn't matter. it's a mock

// represent session data, which holds user data.
// the window.name will hold the following:
// a json object with the username as the key, and the session for each user under the key
class MockStorage {
    constructor() {
        console.log('***** MockStorage', window.name)
        this.data = JSON.parse(window.name || '{}')
    }

    set(key, value) {
        this.data[key] = value
        this.save()
    }

    get(key, defaultValue) {
        if (this.has(key)) {
            return this.data[key]
        } else if (defaultValue) { // set the key with the passed in value
            this.data[key] = defaultValue
            return defaultValue
        } else {
            throw new Error(`InvalidKey:${key}`)
        }
    }

    has(key) {
        return this.data.hasOwnProperty(key)
    }

    del(key) {
        delete this.data[key]
        this.save()
    }

    get length() {
        return Object.keys(this.data).length
    }

    save() {
        window.name = JSON.stringify(this.data)
    }
}

const storage = new MockStorage()

// we will use MockStorage here.
// will be stored with key == "session" in MockStorage
class SessionObject {
    constructor(session, storage) {
        console.log('SessionObject', session, storage)
        this.session = session
        this.storage = storage
        // store the selected classes under key == login
        this.selectedClasses = storage.get(this.session.login, [])
        this.eventTarget = new EventTarget()
    }

    get name() {
        return this.session.name
    }

    get id() {
        return this.session.id
    }

    get token() {
        return this.session.token
    }

    get major() {
        return this.session.major
    }

    selectClass(classId) {
        // make sure it's not a duplicate.
        if (this.selectedClasses.find((clsId) => clsId === classId)) {
            // this is a duplicate, do nothing
            console.warn('SessionObject.selectClass:addedTwice', classId)
        } else {
            this.selectedClasses.push(classId)
            this.saveSelectClasses()
            this.eventTarget.dispatchEvent(new CustomEvent('selectClass', {
                detail: {
                    classId: classId
                }
            }))
        }
    }

    unselectClass(classId) {
        // console.log('***** SessionObject.unselectClass', classId, this.selectedClasses)
        if (this.selectedClasses.find((clsId) => clsId === classId)) {
            this.selectedClasses = this.selectedClasses.filter((clsId) => clsId !== classId)
            this.saveSelectClasses()
            this.eventTarget.dispatchEvent(new CustomEvent('unselectClass', {
                detail: {
                    classId: classId
                }
            }))
        } else {
            // do nothing
            console.warn('SessionObject.unselectClass:alreadyRemoved', classId)
        }
    }

    subscribe(event, callback) {
        this.eventTarget.addEventListener(event, (event) => {
            console.log('******** SessionObject.subscribe', event)
            event.preventDefault()
            event.stopPropagation()
            callback(event)
        })
    }

    isLoggedIn() {
        console.log('***** isLoggedIn', !!this.session['token'], this.session)
        return !!this.session['token']
    }

    // save to window.name to pass across pages for multiple pages to share data
    save() {
        this.storage.set('session', this.session)
    }

    saveSelectClasses() {
        this.storage.set(this.session.login, this.selectedClasses)
    }

    logout() { // logout clears the session
        this.storage.del('session')
    }
}

// we will use window.name to pass the login token, so multiple pages in the same window can share data
function setSession(loggedIn, userProfile = {}) { // loggedIn is a boolean value
    if (loggedIn) { // if true, we set the login token
        const session = new SessionObject({
            id: userProfile.id,
            login: userProfile.login,
            name: userProfile.name,
            major: userProfile.major,
            token: MOCK_SECRET_LOGIN_TOKEN,
            selectedClasses: userProfile.selectedClasses || []
        }, storage)
        session.save()
        return session
    } else { // if false, we reset the login token
        storage.
        window.name = ''
    }
}

function loadSession() {
    try {
        // check if the "session" key exists...
        // so the storage would be...
        // session is the special key
        // then the rest would be stored in username
        console.log('********* loadSession', storage)
        if (storage.has('session')) {
            return new SessionObject(storage.get('session'), storage)
        } else {
            return new SessionObject({}, storage)
        }
    } catch (e) {
        console.error('loadSession.error', e)
        storage.set('session', {})
        return new SessionObject({}, storage)
    }
}

function updateMajor(login, major) {
    if (Object.prototype.hasOwnProperty.call(MOCK_USER_PROFILES, login)) {
        const userProfile = MOCK_USER_PROFILES[login]
        if (Object.prototype.hasOwnProperty.call(MOCK_MAJORS, major)) {
            userProfile.major = major
            setSession(true, userProfile)
        } else {
            throw new Error(`UnknownMajor:${major}`)
        }
    } else {
        throw new Error(`UnknownLogin:${login}`)
    }
}

// right now this is synchronous
// will change to asynchronous later.
function login(login, password) {
    // if the username exists
    if (Object.prototype.hasOwnProperty.call(MOCK_USER_PROFILES, login)) {
        // check if the password is the same
        const userProfile = MOCK_USER_PROFILES[login]
        if (userProfile.password === password) {
            // success set the session
            return setSession(true, userProfile)
        } else {
            // failure
            return false
        }
    } else {
        // failure
        return false
    }
}

// function isLoggedIn() {
//     // tells us if the user is logged in
//     // use this to protect page 2
//     // if user is not logged in, page 2 will redirect to page 1
//     // check the window.name
//     try {
//         const session = JSON.parse(window.name || '{}')
//         if (Object.prototype.hasOwnProperty.call(session, 'token')) {
//             return session['token'] === MOCK_SECRET_LOGIN_TOKEN
//         } else {
//             return false
//         }
//     } catch (e) {
//         return false
//     }
// }

// function logout(event) {
//     console.log('****** logout', event)
//     event.preventDefault()
//     event.stopPropagation()
//     setSession(false)
//     window.location.href = 'login.html'
// }
