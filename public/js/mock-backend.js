const MOCK_MAJORS = {
    'CSD': 'CSD',
    'CS': 'CS',
    'DTA': 'DTA',
    'AAS-T': 'AAS-T',
    'BS': 'BS',
    'BAS': 'BAS'
}

function loadMajors() {
    return MOCK_MAJORS
}

const MOCK_USER_PROFILES = {
    'zoe': {
        id: 'MockID 1101',
        login: 'zoe',
        name: 'Zoe Zhang',
        password: '1234',
        major: 'CS'
    }
}


// use this as the token to represent the user has logged in.
const MOCK_SECRET_LOGIN_TOKEN = 'this is the secret login token' // the data doesn't matter. it's a mock

// we will use window.name to pass the login token, so multiple pages in the same window can share data
function setSession(loggedIn, userProfile = {}) { // loggedIn is a boolean value
    if (loggedIn) { // if true, we set the login token
        window.name = JSON.stringify({
            id: userProfile.id,
            login: userProfile.login,
            name: userProfile.name,
            major: userProfile.major,
            token: MOCK_SECRET_LOGIN_TOKEN
        })
    } else { // if false, we reset the login token
        window.name = ''
    }
}

function loadSession() {
    try {
        const parsed = JSON.parse(window.name || '{}')
        return parsed
    } catch (e) {
        return {}
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
            setSession(true, userProfile)
            return true
        } else {
            // failure
            return false
        }
    } else {
        // failure
        return false
    }
}

function isLoggedIn() {
    // tells us if the user is logged in
    // use this to protect page 2
    // if user is not logged in, page 2 will redirect to page 1
    // check the window.name
    try {
        const session = JSON.parse(window.name || '{}')
        if (Object.prototype.hasOwnProperty.call(session, 'token')) {
            return session['token'] === MOCK_SECRET_LOGIN_TOKEN
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}

function logout(event) {
    console.log('****** logout', event)
    event.preventDefault()
    event.stopPropagation()
    setSession(false)
    window.location.href = 'login.html'
}
