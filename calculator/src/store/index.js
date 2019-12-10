
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import authenticationReducer from './reducers/authenticationReducer'
import yanuxCoordinatorReducer from './reducers/yanuxCoordinatorReducer'
import calculateReducer from './reducers/calculateReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const loggerMiddleware = createLogger()

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  yanuxCoordinator: yanuxCoordinatorReducer,
  calculator: calculateReducer
})

export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
)

export const getExpression = state => {
  return state.calculator.expression
}

export const getTotal = state => {
  return state.calculator.total
}

export const getLoginUrl = state => {
  return state.authentication.loginUrl
}

export const getAuthState = state => {
  return state.authentication.state
}

export const getAuthError = state => {
  return {
    error: state.authentication.error,
    errorDescription: state.authentication.errorDescription
  }
}

export const getCodeVerifier = state => {
  return state.authentication.codeVerifier
}

export const getIdToken = state => {
  return state.authentication.idToken;
}
