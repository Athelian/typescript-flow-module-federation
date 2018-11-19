// @flow
import { Container } from 'unstated';
import { getByPathWithDefault as get, omit, isEmpty } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH } from 'modules/relationMap/constants';

type RelationMapState = {
  focusedId: string,
  focusedItem: Object,
  targetedItem: Object,
  focusMode: string,
  trees: Array<Object>,
  lines: Array<Object>,
};

const getInitialItem = () => ({
  order: {},
  orderItem: {},
  batch: {},
  shipment: {},
});

const initState = () => ({
  focusedItem: getInitialItem(),
  targetedItem: getInitialItem(),
  focusMode: '',
  focusedId: '',
  trees: [],
  lines: [],
});

const createTreeObj = (entity: Object) =>
  Object.keys(entity || {}).reduce(
    (obj, entityId) =>
      Object.assign(obj, {
        [entityId]: true,
      }),
    {}
  );

const createLineObj = (entity: Object, type: string) =>
  Object.keys(entity || {}).reduce(
    (obj, entityId) =>
      Object.assign(obj, {
        [entityId]: {
          id: entityId,
          parentId: entity[entityId].parentId,
          index: entity[entityId].index,
          type,
          line: true,
          related: true,
        },
      }),
    {}
  );

const filterRelated = (trees: Array<Object>, itemRelation: Object) => {
  const relatedIds = Object.keys(itemRelation);
  const itemNotHasTree = !trees.some(tree =>
    relatedIds.some(relatedId => get(false, `${relatedId}`, tree))
  );
  if (itemNotHasTree) {
    return [...trees, itemRelation];
  }
  const filteredTree = trees.map(tree => {
    const isRelated = relatedIds.some(relatedId => get(false, `${relatedId}`, tree));
    return isRelated ? { ...tree, ...itemRelation } : tree;
  });
  return filteredTree;
};

const mapRemoveTargetLine = (relation: Object, data: Object, targetedItem: Object) => (
  line: Object
) => {
  const { id, type } = relation;
  const lines: any = Object.entries(line);
  return lines.reduce((result, objData) => {
    const [lineId, lineData] = objData;
    let currentLine = Object.assign(result, { [lineId]: lineData });
    if (type === ORDER) {
      if (lineData.type === ORDER || lineData.type === ORDER_ITEM) {
        currentLine = Object.assign(result, {
          [lineId]: { ...lineData, line: false },
        });
      }
    }
    if (type === ORDER_ITEM) {
      if (lineData.type === ORDER_ITEM && lineData.parentId === data.orderId) {
        const isSelectedLine = (Object.entries(targetedItem.orderItem): any).some(item => {
          const [, itemData] = item;
          const isSameParent = itemData.parentId === data.orderId;
          return isSameParent && itemData.index > lineData.index;
        });
        currentLine = Object.assign(result, {
          [lineId]: {
            ...lineData,
            line: targetedItem.orderItem[lineId] || isSelectedLine,
            related: lineId === id ? false : lineData.related,
          },
        });
      }
      if (lineData.type === BATCH && lineData.parentId === data.id) {
        currentLine = Object.assign(result, {
          [lineId]: {
            ...lineData,
            line: false,
            related: false,
          },
        });
      }
    }
    if (type === BATCH) {
      if (lineData.type === BATCH && lineData.parentId === data.orderItemId) {
        const isSelectedLine = (Object.entries(targetedItem.batch): any).some(item => {
          const [, itemData] = item;
          const isSameParent = itemData.parentId === data.orderItemId;
          return isSameParent && itemData.index > lineData.index;
        });
        currentLine = Object.assign(result, {
          [lineId]: {
            ...lineData,
            line: targetedItem.batch[lineId] || isSelectedLine,
            related: lineId === id ? false : lineData.related,
          },
        });
      }
    }
    return currentLine;
  }, {});
};

const mapRemoveTreeLine = (itemData: Object, relation: Object, targetedItem: Object) => (
  line: Object
) => {
  const { relation: itemRelation, data } = itemData;
  const { type: itemType, id } = relation;
  const lineIds = Object.keys(line);
  if (itemType === ORDER) {
    return lineIds.reduce((obj, lineId) => {
      const currentLine = line[lineId];
      if (itemRelation.order[lineId] || itemRelation.orderItem[lineId]) {
        return Object.assign(obj, {
          [lineId]: {
            id: lineId,
            line: false,
            related: false,
          },
        });
      }
      return Object.assign(obj, { [lineId]: currentLine });
    });
  }

  if (itemType === ORDER_ITEM) {
    const orderItemLines = lineIds.filter(lineId => {
      const currentLine = line[lineId];
      return currentLine.type === ORDER_ITEM;
    });
    return lineIds.reduce((obj, lineId) => {
      const currentLine = line[lineId];
      if (currentLine.type === ORDER_ITEM && currentLine.parentId === data.orderId) {
        const isSelectedLine = (Object.entries(targetedItem.orderItem): any).some(item => {
          const [, targetedData] = item;
          const isSameParent = targetedData.parentId === data.orderId;
          return isSameParent && targetedData.index > currentLine.index;
        });
        return Object.assign(obj, {
          [lineId]: {
            ...currentLine,
            line: targetedItem.orderItem[lineId] || isSelectedLine,
            related: lineId === id ? false : currentLine.related,
          },
        });
      }
      if (itemRelation.batch[lineId]) {
        return Object.assign(obj, {
          [lineId]: {
            id: lineId,
            line: false,
            related: false,
          },
        });
      }
      return Object.assign(obj, {
        [lineId]: {
          ...currentLine,
          ...(orderItemLines.length === 1 ? { line: false } : {}),
        },
      });
    }, {});
  }
  return line;
};
export default class RelationMapContainer extends Container<RelationMapState> {
  state = initState();

  currentTree: Object = {};

  overrideState = (state: Object) => {
    this.setState(prevState => ({ ...prevState, ...state }));
  };

  overrideTarget = (item: Object) => {
    this.setState(prevState => ({
      targetedItem: {
        ...prevState.targetedItem,
        ...item,
      },
    }));
  };

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
    this.setState(initState());
  };

  cancelTarget = () => {
    this.setState(prevState =>
      Object.assign(prevState, { targetedItem: {}, focusMode: '', lines: [], trees: [] })
    );
  };

  resetFocusedItem = () => {
    this.setState(prevState => ({
      ...prevState,
      focusedItem: {},
      focusedId: '',
    }));
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

  isCurrentTree = (id: string) => this.state.trees.some(tree => tree[id]);

  isSubTree = (itemRelation: Object, itemType: string) => {
    const ids = Object.keys({
      ...(itemType === ORDER_ITEM ? {} : itemRelation.order),
      ...itemRelation.orderItem,
      ...itemRelation.batch,
    });
    const { trees } = this.state;
    return ids.every(id => trees.some(tree => get(false, id, tree)));
  };

  isTargetedLine = (id: string) => {
    const { lines } = this.state;
    return lines.some(line => line[id] && line[id].line);
  };

  isRelatedLine = (id: string) => {
    const { lines } = this.state;
    return lines.some(line => line[id] && line[id].related);
  };

  isRelatedTree = (itemRelation: Object) => {
    const { trees } = this.state;
    const relatedIds = Object.keys({
      ...itemRelation.order,
      ...itemRelation.orderItem,
      ...itemRelation.batch,
    });
    return trees.some(tree => relatedIds.some(relatedId => tree[relatedId]));
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

  resetTargetedItem = (itemData: Object, relation: Object) => {
    const { relation: itemRelation } = itemData;
    const { type: itemType } = relation;
    const removeItem = this.formatTargetTreeItem(itemRelation, itemType);
    const removeObj = { ...removeItem.order, ...removeItem.orderItem, ...removeItem.batch };
    const removeIds = Object.keys(removeObj);
    this.setState(prevState => {
      const { targetedItem } = prevState;
      const { order, orderItem, batch } = targetedItem;
      const newTarget = Object.assign(targetedItem, {
        order: itemType === ORDER_ITEM ? order : omit(Object.keys(itemRelation.order || {}), order),
        orderItem: omit(Object.keys(itemRelation.orderItem || {}), orderItem),
        batch: omit(Object.keys(itemRelation.batch || {}), batch),
      });
      return {
        ...prevState,
        focusMode: 'TARGET',
        targetedItem: newTarget,
        trees: prevState.trees.map(tree => omit(removeIds, tree)),
        lines: prevState.lines
          .filter(line => (itemType === ORDER ? !removeIds.some(removeId => line[removeId]) : true))
          .map(mapRemoveTreeLine(itemData, relation, newTarget)),
      };
    });
  };

  formatTargetTreeItem = (itemRelation: Object, itemType: ?string) => {
    const targetedItem =
      itemType === ORDER_ITEM
        ? { ...itemRelation, order: {}, shipment: {} }
        : { ...itemRelation, shipment: {} };
    return targetedItem;
  };

  targetTree = (itemData: Object, relation: Object) => {
    const { relation: itemRelation, data } = itemData;
    const { type: itemType } = relation;
    const targetedItem = this.formatTargetTreeItem(itemRelation, itemType);
    const { order = {}, orderItem = {}, batch = {} } = targetedItem;
    const tree = {
      ...createTreeObj(order),
      ...createTreeObj(orderItem),
      ...createTreeObj(batch),
    };
    const line = {
      ...createLineObj(order, ORDER),
      ...createLineObj(orderItem, ORDER_ITEM),
      ...createLineObj(batch, BATCH),
    };
    this.setState(prevState => {
      const {
        order: targetOrder,
        orderItem: targetOrderItem,
        batch: targetBatch,
      } = prevState.targetedItem;
      const trees = filterRelated(prevState.trees, tree);
      const lines = filterRelated(prevState.lines, line);
      return Object.assign(prevState, {
        targetedItem: {
          order: {
            ...targetOrder,
            ...(itemType === ORDER ? { [Object.keys(order)[0]]: { ...data } } : order),
          },
          orderItem: {
            ...targetOrderItem,
            ...(itemType === ORDER_ITEM
              ? {
                  [Object.keys(orderItem)[0]]: { ...data, ...orderItem[Object.keys(orderItem)[0]] },
                }
              : orderItem),
          },
          batch: { ...targetBatch, ...batch },
        },
        focusMode: 'TARGET_TREE',
        trees,
        lines,
      });
    });
  };

  addTarget = (itemData: Object, relation: Object, itemType: string) => {
    const { id } = relation;
    const { data, relation: itemRelation } = itemData;
    const isInTree = this.isCurrentTree(id);
    const createTree = () => {
      const targetedItem = this.formatTargetTreeItem(itemRelation, itemType);
      const { order = {}, orderItem = {}, batch = {} } = targetedItem;
      const tree = {
        ...createTreeObj(order),
        ...createTreeObj(orderItem),
        ...createTreeObj(batch),
      };
      return tree;
    };

    // const createLine = () => {
    //   const { lines } = this.state
    //   const newLines = lines.map(line => {
    //     const isRelated = previousIds.some(previousId => line[previousId])
    //     if (isRelated) {
    //       return (Object.entries(line): any).reduce((result, data) => {
    //         const [dataId, detail] = data
    //         if (previousIds.includes(dataId)) {
    //           return Object.assign(result, { [dataId]: {
    //               ...detail,
    //               line: true,

    //             }
    //           })
    //         }
    //         return Object.assign(result, { [dataId]: detail })
    //       }, {})
    //     }
    //     return lines
    //   })
    // }
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
        targetedItem,
        trees: [...prevState.trees, !isInTree && createTree()],
      };
    });
  };

  removeTarget = (itemType: string, relation: Object, data: Object) => {
    const { id } = relation;
    this.setState(prevState => {
      const targetedItemByType = get({}, `targetedItem.${itemType}`, prevState);
      const isTarget = targetedItemByType[id] || false;
      if (isTarget) {
        const newTargetItem = {
          ...prevState.targetedItem,
          [itemType]: omit([id], targetedItemByType),
        };
        return {
          ...prevState,
          ...(this.isCurrentTree(id)
            ? {
                trees: prevState.trees.map(tree => omit([id], tree)),
                lines: prevState.lines.map(mapRemoveTargetLine(relation, data, newTargetItem)),
              }
            : {}),
          focusMode: 'TARGET',
          targetedItem: newTargetItem,
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

  toggleTargetTree = (itemData: Object, relation: Object) => () => {
    const { relation: itemRelation } = itemData;
    const { id, type: itemType } = relation;
    if (this.isCurrentTree(id) && this.isSubTree(itemRelation, itemType)) {
      this.resetTargetedItem(itemData, relation);
    } else {
      this.targetTree(itemData, relation);
    }
  };

  toggleTarget = (itemData: Object, relation: Object, itemType: string) => () => {
    const { id } = relation;
    const { data } = itemData;
    if (this.isTargeted(itemType, id)) {
      this.removeTarget(itemType, relation, data);
    } else {
      this.addTarget(itemData, relation, itemType);
    }
  };
}
