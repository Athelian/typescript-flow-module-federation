// @flow
import * as React from 'react';

type Props = {
  /**
   * List of element we want to ignore.
   * `onOutsideClick()` won't call if click on that element.
   *
   * @type {Array<Node>}
   */
  ignoreElements?: Array<Node>,
  /**
   * Render prop
   *
   * @type {React.Node}
   */
  children: React.Node,
  /**
   * Function will be called when click outside of element
   *
   * @type {Function}
   */
  onOutsideClick: Function,
};

export default class OutsideClickHandler extends React.Component<Props> {
  static defaultProps = { className: '', ignoreElements: [] };

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick);
  }

  onOutsideClick = (evt: MouseEvent) => {
    const { ignoreElements, onOutsideClick } = this.props;
    const isOutsideTarget =
      this.wrapperRef && evt.target instanceof Node && !this.wrapperRef.contains(evt.target);
    const isIgnore =
      ignoreElements && ignoreElements.length
        ? ignoreElements.find(
            item =>
              item &&
              ((evt.target instanceof Node && item.isSameNode(evt.target)) ||
                (evt.target instanceof Node && item.contains(evt.target)))
          )
        : false;
    if (isOutsideTarget && !isIgnore) {
      onOutsideClick(evt);
    }
  };

  setChildNodeRef = (ref: HTMLDivElement | null) => {
    if (ref) this.wrapperRef = ref;
  };

  wrapperRef: HTMLDivElement;

  render() {
    const { children } = this.props;
    return <div ref={this.setChildNodeRef}>{children}</div>;
  }
}
