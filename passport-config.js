const LocalStartegy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
function initialize(passport, getUser) {
    const authenticateUser = (mobile, password, done) => {
        const user = getUser(mobile)
        if (!user) {
            return done(null, false, { message: 'No user with that mobile' })
        }

        try {
            if ( bcrypt.compare(password, user.password)) {
                return done(null, user)
            }else{
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }

    }
    passport.use(new LocalStartegy({ usernameField: 'mobile' }),authenticateUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
}

module.exports = initialize