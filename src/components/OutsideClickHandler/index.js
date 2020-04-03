// @flow
import * as React from 'react';

type OptionalProps = {
  ignoreElements: Array<Node>,
  ignoreClick: boolean,
  className: string,
};

type Props = OptionalProps & {
  children: React.Node,
  onOutsideClick: Function,
};

const defaultProps = {
  ignoreElements: [],
  ignoreClick: true,
  className: '',
};

export default class OutsideClickHandler extends React.Component<Props> {
  wrapperRef: HTMLDivElement;

  static defaultProps = defaultProps;

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick);
  }

  onOutsideClick = (evt: MouseEvent) => {
    const { ignoreElements, ignoreClick, onOutsideClick } = this.props;

    if (ignoreClick) return;

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

  render() {
    const { children, className } = this.props;
    return (
      <div ref={this.setChildNodeRef} className={className}>
        {children}
      </div>
    );
  }
}
