// @flow
import { Container } from 'unstated';

type State = {
  result: Object,
  currentAction: string,
  scrolled: boolean,
};

class ActionContainer extends Container<State> {
  state = {
    result: {},
    currentAction: '',
    scrolled: true,
  };

  setResult = (result: Object) => {
    this.setState({
      result,
      scrolled: false,
    });
  };

  setAction = (currentAction: string) => {
    this.setState({
      currentAction,
    });
  };

  setScroll = (scrolled: boolean) => {
    this.setState({ scrolled });
  };
}

export default ActionContainer;
