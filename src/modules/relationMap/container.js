// @flow
import { Container } from 'unstated';
import { getByPathWithDefault as get, omit } from 'utils/fp';
import { ORDER_ITEM } from 'modules/relationMap/constants';

type RelationMapState = {
  focusedId: string,
  focusedItem: Object,
  targetedId: string,
  targetedItem: Object,
  focusMode: string,
  targetMode: string,
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
  targetedId: '',
  targetMode: '',
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

  resetTargetedItem = (itemType: ?string) => {
    this.setState(prevState => ({
      ...prevState,
      focusMode: 'TARGET',
      targetMode: '',
      targetedId: '',
      targetedItem:
        itemType === ORDER_ITEM
          ? Object.assign(prevState.targetedItem, { orderItem: {}, batch: {} })
          : {},
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

  isCurrentTarget = (id: string) => {
    const { targetedId } = this.state;
    return targetedId === id;
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

  targetTree = (itemType: ?string, id: string, itemRelation: Object) => {
    this.setState(prevState =>
      Object.assign(prevState, {
        targetedItem:
          itemType === ORDER_ITEM
            ? { ...itemRelation, order: {}, shipment: {} }
            : { ...itemRelation, shipment: {} },
        focusMode: 'TARGET_TREE',
        targetMode: itemType || '',
        targetedId: id,
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
      const targetedItem = {
        ...prevState.targetedItem,
        [itemType]: {
          ...prevTarget,
          [id]: data,
        },
      };
      return {
        ...prevState,
        focusMode: 'TARGET',
        targetMode: '',
        targetedId: id,
        targetedItem,
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
          targetMode: '',
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

  toggleTargetTree = (focusedItem: Object, id: string) => (itemType?: string) => () => {
    const { focusMode } = this.state;
    if (this.isCurrentTarget(id) && focusMode === 'TARGET_TREE') {
      this.resetTargetedItem(itemType);
    } else {
      this.targetTree(itemType, id, focusedItem);
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
