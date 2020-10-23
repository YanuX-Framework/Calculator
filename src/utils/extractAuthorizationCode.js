import queryString from 'query-string'
const extractAuthorizationCode = (state) => {
    const parameters = queryString.parse(window.location.hash);
    if (parameters.state && parameters.code && state === parameters.state) {
        return parameters.code
    }
}

export default extractAuthorizationCode