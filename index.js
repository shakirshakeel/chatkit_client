const server = require('server')
const fetch = require('node-fetch')
const Chatkit = require('pusher-chatkit-server')
var http = require('http');

const { get, post } = server.router
const { json, header, status, redirect } = server.reply
var userObj = {};
const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:1114c1ef-c7c0-412a-b93b-48e5becc953b",
  key: "163da3b5-00ec-4e77-83a9-c7b9564940b0:lQ97sCNzJ9EQGwj/GX4se/9QzFuTuMsi9ss0lpik8tk="
})

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
}


const GithubUserFromAccessToken = () => 
{
var options = {
  host: "localhost",
  method: "POST",
  port:8000,
  path: '/api/auth/login',
  headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
  }
}
var req = http.request(options, function (res) {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', (d) => {
    CreateChatkitUserFromGithubUser(d.toString('utf8'));

  })
})
const data = JSON.stringify({
  email: 'shakirshakeel91@gmail.com',
  password: 'secret'
})
req.on('error', (error) => {
  console.error(error)
})
  req.write(data);
  req.end();  
}
const ChatkitCredentialsFromGithubToken = token =>
  // GithubUserFromAccessToken(token)
    // .then(user =>
      chatkit.authenticate({ grant_type: 'client_credentials' }, 'shakirshakeel91@gmail.com')
    // )
    // .catch(console.log)

const CreateChatkitUserFromGithubUser = user => {
 user = JSON.parse(user)
console.log(user.userID.email);
chatkit
chatkit.createUser({
  id: user.userID.email,
  name: user.userID.name
}).catch(console.log)
}
server({ port: process.env.PORT || 3001, security: { csrf: false } }, [
  ctx => header(cors),
  post('/auth', async ctx => {
    try {
    console.log('jani auth me hun');

      // const { code } = JSON.parse(ctx.data)
      // return json({ id: user.login, token })
      const user = await GithubUserFromAccessToken();
      //  const create = await CreateChatkitUserFromGithubUser(user)
      return json({ id: 'shakirshakeel91@gmail.com', token })
    } catch (e) {
      console.log(e)
    }
  }),
  post('/token', async ctx => {
    console.log('here');
    try {
      const { token } = ctx.query
      const creds = await ChatkitCredentialsFromGithubToken(token)
      return json(creds)
    } catch (e) {
      console.log(e)
    }  body: {}
  }),
  get('/success', async ctx => {
    console.log(ctx);
    const prod = 'https://pusher.github.io/chatkit-demo'
    const { code, state, url } = ctx.query
    return redirect(302, `${url || prod}?code=${code}&state=${state}`)
  }),
  get(ctx => status(404)),
])
