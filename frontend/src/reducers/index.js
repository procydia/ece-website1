import { combineReducers } from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import productReducer from './productReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  product: productReducer
});

