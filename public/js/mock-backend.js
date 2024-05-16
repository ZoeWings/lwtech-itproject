const MOCK_USER_CREDENTIALS = {
    'zoe': '1234'
}

// use this as the token to represent the user has logged in.
const MOCK_SECRET_LOGIN_TOKEN = 'this is the secret login token' // the data doesn't matter. it's a mock

// we will use window.name to pass the login token, so multiple pages in the same window can share data
function setSession(loggedIn) { // loggedIn is a boolean value
    if (loggedIn) { // if true, we set the login token
        window.name = MOCK_SECRET_LOGIN_TOKEN
    } else { // if false, we reset the login token
        window.name = ''
    }
}
 
// right now this is synchronous
// will change to asynchronous later.
function login(login, password) {
    // if the username exists
    if (Object.prototype.hasOwnProperty.call(MOCK_USER_CREDENTIALS, login)) {
        // check if the password is the same
        if (MOCK_USER_CREDENTIALS[login] === password) {
            // success set the session
            setSession(true)
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
    return window.name === MOCK_SECRET_LOGIN_TOKEN
}

function logout(event) {
    console.log('****** logout', event)
    event.preventDefault()
    event.stopPropagation()
    setSession(false)
    window.location.href = 'login.html'
}
