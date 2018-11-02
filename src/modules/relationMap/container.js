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

  unSelectAll = (type: string) => {
    this.setState(prevState => ({
      focusMode: 'TARGET',
      focusedItem: {
        ...prevState.focusedItem,
        [type]: {},
      },
    }));
  };

  selectAll = (data: Object) => (type: string) => {
    const itemIds = Object.keys(data[type] || {});
    const itemAll = itemIds.reduce((obj, itemId) => Object.assign(obj, { [itemId]: true }), {});
    this.setState(prevState => ({
      focusMode: 'TARGET',
      focusedItem: {
        ...prevState.focusedItem,
        [type]: itemAll,
      },
    }));
  };

  reset = () => {
    this.setState(initState);
  };

  changeFocusItem = (newState: RelationMapState) => {
    this.setState(newState);
  };

  reset = () => {
    this.setState({ ...initState });
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
