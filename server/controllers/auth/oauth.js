const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

const getUserData = async (access_token) => {
    const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data  = await res.json();
    console.log('data', data);
}

router.get('/', async (req, res, next) => {
    const code = req.query.code;
    try {
        const redirect_url = "http://localhost/5000/";
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirect_url
          );
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);
        console.log('Getting Tokens Completed!');

        const user = oAuth2Client.credentials;
        console.log('Credentials', user);
        await getUserData(user.access_token)
    } catch (error) {
        next(error);
    }
})

module.exports = router;