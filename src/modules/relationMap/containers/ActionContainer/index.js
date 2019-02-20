// @flow
import { Container } from 'unstated';

type State = {
  loading: boolean,
  result: Object,
  currentAction: string,
  scrolled: boolean,
  error: boolean,
};

class ActionContainer extends Container<State> {
  state = {
    loading: false,
    result: {},
    currentAction: '',
    scrolled: true,
    error: false,
  };

  overrideState = (newState: Object) => {
    this.setState(prevState => ({ ...prevState, ...newState }));
  };

  clearResult = () => {
    this.setState({ result: {} });
  };

  setError = (error: boolean) => {
    this.setState({ error });
  };

  setCurrentAction = (action: Function) => {
    this.actionFunc = action;
  };

  setLoading = (loading: boolean) => {
    this.setState({ loading });
  };

  setResult = (result: Object | Function) => {
    this.setState(
      typeof result === 'function'
        ? result
        : {
            result,
            scrolled: false,
          }
    );
  };

  setAction = (currentAction: string) => {
    this.setState({
      currentAction,
    });
  };

  setScroll = (scrolled: boolean) => {
    this.setState({ scrolled });
  };

  actionFunc: Function;
}

export default ActionContainer;
