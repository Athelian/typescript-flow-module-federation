// @flow
import { Container } from 'unstated';
import { getByPathWithDefault as get, omit, isEmpty } from 'utils/fp';
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

  currentTree: Object = {};

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

  cancelTarget = () => {
    this.setState(prevState =>
      Object.assign(prevState, { targetedItem: {}, focusMode: '', targetMode: '', targetedId: '' })
    );
  };

  resetTargetedItem = (itemRelation: Object, itemType: ?string) => {
    const { orders = [], orderItems = [], batches = [] } = this.currentTree;
    this.setState(prevState => {
      const { targetedItem } = prevState;
      const { order, orderItem, batch } = targetedItem;
      const newTarget =
        itemType === ORDER_ITEM
          ? Object.assign(targetedItem, {
              orderItem: omit(Object.keys(itemRelation.orderItem || {}), orderItem),
              batch: omit(Object.keys(itemRelation.batch || {}), batch),
            })
          : Object.assign(targetedItem, {
              order: omit(orders, order),
              orderItem: omit(orderItems, orderItem),
              batch: omit(batches, batch),
            });
      return {
        ...prevState,
        focusMode: 'TARGET',
        targetMode: '',
        targetedId: '',
        targetedItem: newTarget,
      };
    });
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

  isTargetAnyItem = () => {
    const {
      targetedItem: { order = {}, orderItem = {}, batch = {}, shipment = {} },
    } = this.state;
    return !isEmpty(order) || !isEmpty(orderItem) || !isEmpty(batch) || !isEmpty(shipment);
  };

  isCurrentTarget = (id: string) => {
    const { targetedId } = this.state;
    return targetedId === id;
  };

  isCurrentTree = (id: string) => this.currentTree.tree && this.currentTree.tree[id];

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

  formatTargetTreeItem = (itemRelation: Object, itemType: ?string) => {
    const targetedItem =
      itemType === ORDER_ITEM
        ? { ...itemRelation, order: {}, shipment: {} }
        : { ...itemRelation, shipment: {} };
    return targetedItem;
  };

  setCurrentTree = (targetedItem: Object) => {
    const { order, orderItem, batch } = targetedItem;
    this.currentTree = {
      tree: Object.assign({}, order, orderItem, batch),
      orders: Object.keys(order),
      orderItems: Object.keys(orderItem),
      batches: Object.keys(batch),
    };
  };

  targetTree = (itemType: ?string, id: string, targetedItem: Object) => {
    this.setState(prevState =>
      Object.assign(prevState, {
        targetedItem,
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

  toggleTargetTree = (itemRelation: Object, id: string) => (itemType?: string) => () => {
    if (this.isCurrentTree(id)) {
      this.resetTargetedItem(itemRelation, itemType);
      this.currentTree = {};
    } else {
      const targetedItem = this.formatTargetTreeItem(itemRelation, itemType);
      this.setCurrentTree(targetedItem);
      this.targetTree(itemType, id, targetedItem);
    }
  };

  toggleTarget = (itemType: string, id: string, data: Object) => () => {
    if (this.isTargeted(itemType, id)) {
      if (this.isCurrentTree(id)) {
        this.currentTree = {};
      }
      this.removeTarget(itemType, id);
    } else {
      this.addTarget(itemType, id, data);
    }
  };
}
