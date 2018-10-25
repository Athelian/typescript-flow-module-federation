// @flow
import { Container } from 'unstated';

type RelationMapState = {
  focusedItem: Object,
  focusMode: string,
};

const initState = {
  focusedItem: {},
  focusMode: '',
};

export default class RelationMapContainer extends Container<RelationMapState> {
  state = initState;

  changeMode = (focusMode: string) => {
    this.setState({
      focusMode,
    });
  };

  selectItem = (focusedItem: Object) => {
    this.setState({
      focusedItem,
    });
  };

  reset = () => {
    this.setState(initState);
  };

  changeFocusItem = (newState: RelationMapState) => {
    this.setState(newState);
  };

  isTargetTreeMode = () => {
    const { focusMode } = this.state;
    return focusMode === 'TARGET_TREE';
  };

  isTargetMode = () => {
    const { focusMode } = this.state;
    return focusMode === 'TARGET';
  };
}
