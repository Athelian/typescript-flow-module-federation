// @flow
import { Container } from 'unstated';
import { getByPathWithDefault as get, omit } from 'utils/fp';

type RelationMapState = {
  focusedItem: Object,
  targetedItem: Object,
  focusMode: string,
};

const getInitialItem = () => ({
  order: {},
  orderItem: {},
  batch: {},
  shipment: {},
});

const initState = {
  focusedItem: getInitialItem(),
  targetedItem: getInitialItem(),
  focusMode: '',
};

export default class RelationMapContainer extends Container<RelationMapState> {
  state = initState;

  changeMode = (focusMode: string) => {
    this.setState({
      focusMode,
    });
  };

  selectFocusItem = (focusedItem: Object) => {
    this.setState({
      focusedItem,
    });
  };

  selectTargetItem = (targetedItem: Object) => {
    this.setState({
      targetedItem,
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

  changeFocusItem = (newState: RelationMapState) => {
    this.setState(newState);
  };

  reset = () => {
    this.setState({ ...initState });
  };

  resetTargetedItem = () => {
    this.setState(prevState => ({
      ...prevState,
      targetedItem: {},
    }));
  };

  resetFocusedItem = () => {
    this.setState(prevState => ({
      ...prevState,
      focusedItem: {},
    }));
  };

  isTargetTreeMode = () => {
    const { focusMode } = this.state;
    return focusMode === 'TARGET_TREE';
  };

  isTargetMode = () => {
    const { focusMode } = this.state;
    return focusMode === 'TARGET';
  };

  highlightTree = (focusedItem: Object) => {
    this.setState({
      focusedItem,
      focusMode: 'HIGHLIGHT',
    });
  };

  targetTree = (itemRelation: Object) => {
    this.setState(prevState =>
      Object.assign(prevState, {
        targetedItem: { ...itemRelation, shipment: {} },
        focusMode: 'TARGET_TREE',
      })
    );
  };

  addTarget = (itemType: string, id: string, data: Object) => {
    this.setState(prevState => {
      const prevTarget = get({}, `targetedItem.${itemType}`, prevState);
      return {
        ...prevState,
        focusMode: 'TARGET',
        targetedItem: {
          ...prevState.targetedItem,
          [itemType]: {
            ...prevTarget,
            [id]: data,
          },
        },
      };
    });
  };

  removeTarget = (itemType: string, id: string) => {
    this.setState(prevState => {
      const isTarget = get(false, `targetedItem.${itemType}.${id}`, prevState);
      if (isTarget) {
        return {
          ...prevState,
          targetedItem: {
            ...prevState.targetedItem,
            [itemType]: omit([id], get({}, `targetedItem.${itemType}`, prevState)),
          },
        };
      }
      return prevState;
    });
  };

  toggleHighlight = (focusedItem: Object) => (isHighlighted: boolean) => {
    if (isHighlighted) {
      this.resetFocusedItem();
    } else {
      this.highlightTree(focusedItem);
    }
  };

  toggleTargetTree = (focusedItem: Object) => (isHighlighted: boolean) => {
    if (isHighlighted) {
      this.resetTargetedItem();
    } else {
      this.targetTree(focusedItem);
    }
  };

  toggleTarget = (itemType: string, id: string, data: Object) => (isHighlighted: boolean) => {
    if (isHighlighted) {
      this.removeTarget(itemType, id);
    } else {
      this.addTarget(itemType, id, data);
    }
  };
}
