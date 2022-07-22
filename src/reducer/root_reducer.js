import { combineReducers } from 'redux';
import team_reducer from './team_reducer';
import user_reducer from './user_reducer';
import project_reducer from './project_reducer';
import file_reducer from './file_reducer';
import modal_reducer from './modal_reducer';
import docReducer from './docSlices';
import peerReducer from './peerSlices';
const rootReducer = combineReducers({
  team_reducer,
  user_reducer,
  project_reducer,
  file_reducer,
  modal_reducer,
  docReducer,
  peerReducer,
});

export default rootReducer;