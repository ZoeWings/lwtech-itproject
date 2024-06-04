function loadMajors(degreeId) {
    const output = {}
    MOCK_MAJORS.forEach((major) => {
        if (degreeId === 'all' || major.degreeId == degreeId) {
            const classesByMajor = loadClassesByMajor(major)
            output[major.degreeId] = {
                degreeId: major.degreeId,
                name: major.name,
                quarters: classesByMajor
            }
        }
    })
    return output
}

function normalizePrereqistes(prereqs) {
    return prereqs.map((prereq) => {
        // retrieve the class detail.
        const classDetail = MOCK_CLASSES.find((cls) => cls.classId === prereq)
        if (classDetail) {
            // look for alts.
            const altClassIds = classDetail.alts.map((alt) => {
                const altClassDetail = MOCK_CLASSES.find((cls) => cls.classId === alt)
                if (altClassDetail) {
                    return altClassDetail.classId
                } else {
                    return null
                }
            })
                .filter((cls) => !!cls)
            return {
                classIds: [ classDetail.classId ].concat(altClassIds)
            }
        } else {
            return null
        }
    })
        .filter((cls) => !!cls)
}

function loadOneClassDetails(classId) {
    const classDetail = MOCK_CLASSES.find((cls2) => cls2.classId === classId)
    const alternates = classDetail.alts.map((alt) => {
        const altClass = MOCK_CLASSES.find((cls3) => cls3.classId == alt)
        if (altClass) {
            return {
                classId: altClass.classId,
                name: altClass.name,
                prereqs: altClass.prereqs.length > 0 ? [{
                    classIds: altClass.prereqs
                }] : [],
                alts: altClass.alts || []
            }
        } else {
            return null
        }
    })
        .filter((cls) => !!cls)
    return {
        classId: classDetail.classId,
        name: classDetail.name,
        // need to change the prereqs to use alts.
        prereqs: normalizePrereqistes(classDetail.prereqs),
        alts: alternates
    }
}

function loadClassesDetails(classes) {
    // cls contains classId & alts
    return classes.map((cls) => {
        return loadOneClassDetails(cls.classId)
    })
}

function loadClassesByMajor(major) {
    return major.quarters.map((quarter) => {
            const classes = loadClassesDetails(quarter.classes)
            // we should also do the same for all alts classes.
            return {
                quarter: quarter.quarter,
                classes: classes
            }
        })
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
        this.userData = storage.get(this.session.login, {
            major: '',
            selectedClasses: [],
        })
        // this.selectedClasses = storage.get(`selectedClass:${this.session.login}`, [])
        this.eventTarget = new EventTarget()
    }

    get name() {
        return this.session.name
    }

    get id() {
        return this.session.id
    }

    get login() {
        return this.session.login
    }

    get token() {
        return this.session.token
    }

    get major() {
        return this.userData.major
    }

    setMajor(degreeId) {
        const foundMajor = MOCK_MAJORS.find((major) => {
            console.log('******** major', major, degreeId, degreeId === major.degreeId)
            return degreeId === major.degreeId
        })
        console.log('***** setMajor', degreeId, foundMajor, MOCK_MAJORS)
        if (foundMajor) {
            this.userData.major = degreeId
            this.saveUserData()
        } else {
            throw new Error(`UnknownMajor:${degreeId}`)
        }
    }

    get browseMajor() {
        return this.session.browseAllMajors || this.userData.major
    }

    browseAllMajors(setting) {
        if (setting) {
            this.session.browseAllMajors = 'all'
        } else {
            delete this.session.browseAllMajors
        }
        this.saveSessionData()
    }

    get selectedClasses() {
        return this.userData.selectedClasses
    }

    selectClass(classId) {
        // make sure it's not a duplicate.
        if (this.userData.selectedClasses.find((clsId) => clsId === classId)) {
            // this is a duplicate, do nothing
            console.warn('SessionObject.selectClass:addedTwice', classId)
        } else {
            this.userData.selectedClasses.push(classId)
            this.saveUserData()
            this.eventTarget.dispatchEvent(new CustomEvent('selectClass', {
                detail: {
                    classId: classId
                }
            }))
        }
    }

    unselectClass(classId) {
        // console.log('***** SessionObject.unselectClass', classId, this.selectedClasses)
        if (this.userData.selectedClasses.find((clsId) => clsId === classId)) {
            this.userData.selectedClasses = this.userData.selectedClasses.filter((clsId) => clsId !== classId)
            this.saveUserData()
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

    saveUserData() {
        this.storage.set(this.session.login, this.userData)
    }

    saveSessionData() {
        this.storage.set('session', this.session)
    }

    logout() { // logout clears the session
        this.storage.del('session')
    }

    loadClassById(classId) {
        return loadOneClassDetails(classId)
    }

    loadPostReqClasses(classId) {
        return MOCK_CLASSES.filter((cls) => {
            const isPostReq = cls.prereqs.find((prereq) => prereq === classId)
            return !!isPostReq
        })
    }

    isAlternateSelected(classIds) {
        return classIds.find((clsId) => {
            return this.selectedClasses.find((cls2) => cls2 === clsId)
        })
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
        }, storage)
        session.save()
        return session
    } else { // if false, we reset the login token
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
