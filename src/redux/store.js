import { configureStore, combineReducers } from '@reduxjs/toolkit'
import CollapsedReducer from './reducers/CollapsedReducer'
import LoadingReducer from './reducers/LoadingReducer'
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})
const store = configureStore({
    reducer: reducer,
})
export default store
