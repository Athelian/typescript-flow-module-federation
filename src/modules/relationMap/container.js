// @flow
import { Container } from 'unstated';
import { getByPathWithDefault as get, omit } from 'utils/fp';

type RelationMapState = {
  focusedId: string,
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
  focusedId: '',
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
      targetedItem: {
        ...prevState.targetedItem,
        [type]: {},
      },
    }));
  };

  selectAll = (data: Object) => (type: string) => {
    const itemIds = Object.keys(data[type] || {});
    const itemAll = itemIds.reduce((obj, itemId) => Object.assign(obj, { [itemId]: true }), {});
    this.setState(prevState => ({
      focusMode: 'TARGET',
      targetedItem: {
        ...prevState.targetedItem,
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
      focusedId: '',
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

  isTargeted = (itemType: string, id: string) => {
    const { targetedItem } = this.state;
    const isTargeted = get(false, `${itemType}.${id}` || '', targetedItem);
    return isTargeted;
  };

  isFocused = (itemType: string, id: string) => {
    const { focusedItem } = this.state;
    const isFocused = get(false, `${itemType}.${id}` || '', focusedItem);
    return isFocused;
  };

  highlightTree = (focusedItem: Object, focusedId: string) => {
    this.setState(prevState => ({
      ...prevState,
      focusedId,
      focusedItem,
      // focusMode: 'HIGHLIGHT',
    }));
  };

  targetTree = (itemRelation: Object) => {
    this.setState(prevState =>
      Object.assign(prevState, {
        targetedItem: { ...itemRelation, shipment: {} },
        focusMode: 'TARGET_TREE',
      })
    );
  };

  overrideTarget = (item: Object) => {
    this.setState(prevState => ({
      targetedItem: {
        ...prevState.targetedItem,
        ...item,
      },
    }));
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
          focusMode: 'TARGET',
          targetedItem: {
            ...prevState.targetedItem,
            [itemType]: omit([id], get({}, `targetedItem.${itemType}`, prevState)),
          },
        };
      }
      return prevState;
    });
  };

  toggleHighlight = (focusedItem: Object, focusedId: string) => () => {
    const { focusedId: currentFocusedId } = this.state;
    const isHighlighted = currentFocusedId && currentFocusedId === focusedId;
    if (isHighlighted) {
      this.resetFocusedItem();
    } else {
      this.highlightTree(focusedItem, focusedId);
    }
  };

  toggleTargetTree = (focusedItem: Object) => (isHighlighted: boolean) => {
    if (isHighlighted) {
      this.resetTargetedItem();
    } else {
      this.targetTree(focusedItem);
    }
  };

  toggleTarget = (itemType: string, id: string, data: Object) => () => {
    if (this.isTargeted(itemType, id)) {
      this.removeTarget(itemType, id);
    } else {
      this.addTarget(itemType, id, data);
    }
  };
}
