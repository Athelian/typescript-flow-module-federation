// @flow
import { Container } from 'unstated';

type State = {
  result: Object,
  currentAction: string,
};

class ActionContainer extends Container<State> {
  state = {
    result: {},
    currentAction: '',
  };

  setResult = (result: Object) => {
    this.setState({
      result,
    });
  };

  setAction = (currentAction: string) => {
    this.setState({
      currentAction,
    });
  };
}

export default ActionContainer;
