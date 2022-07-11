import { combineReducers } from 'redux';
import team_reducer from './team_reducer';
import user_reducer from './user_reducer';
import project_reducer from './project_reducer';

const rootReducer = combineReducers({
  team_reducer,
  user_reducer,
  project_reducer
});

export default rootReducer;