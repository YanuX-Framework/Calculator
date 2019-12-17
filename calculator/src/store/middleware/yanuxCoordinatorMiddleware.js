import * as types from '../types';

export default store => next => action => {
    console.log('[YanuX Coordinator Middleware (YXCM)]', action)
    console.log('[YXCM] Dispatching', action)
    let result = next(action)
    const state = store.getState()
    console.log('[YXCM] Next State', state)
    if (state.yanuxCoordinator.coordinator &&
        state.yanuxCoordinator.coordinator.isConnected() &&
        [types.SET_EXPRESSION,
        types.CLEAR_EXPRESSION,
        types.EVALUATE_EXPRESSION,
        types.DELETE_LAST_EXPRESSION_ENTRY].find(t => action.type === t)) {
        state.yanuxCoordinator.coordinator.setResourceData({
            actionType: action.type,
            expression: state.calculator.expression,
            total: state.calculator.total
        })
    }
    return result
}