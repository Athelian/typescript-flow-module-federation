import React from 'react';

class JumpToSection extends React.PureComponent {
  static propTypes = {
    children: React.Node,
  };

  static defaultProps = {
    children: [],
  };

  state = {
    activeNode: null,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
    this.ensureLastHeightOfSection();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { children } = this.props;
    const ids = React.Children.map(children, child => child.props.link);
    ids.forEach(id => {
      const node = document.querySelector(`#${id}`) || {};
      const { pageYOffset } = window;
      const nodeYPosition = node.offsetTop + node.offsetHeight;

      const scrollPassedTheTop = pageYOffset >= node.offsetTop;
      const scrollNotPassedTheBottom = nodeYPosition > pageYOffset;
      const scrollInNodeArea = scrollPassedTheTop && scrollNotPassedTheBottom;
      if (scrollInNodeArea) {
        this.setState({ activeNode: id });
      }
    });
  };

  handleClick = id => () => {
    const node = document.querySelector(`#${id}`);
    if (node) {
      node.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  ensureLastHeightOfSection = () => {
    const documentHeight = document.body.offsetHeight;
    const { children } = this.props;
    const childNum = React.Children.count(children);
    const lastChild = React.Children.toArray(children)[childNum - 1];
    const lastSectionId = lastChild && lastChild.props.link;

    const lastSectionNode = document.querySelector(`#${lastSectionId}`) || {};
    const lastSectionNodePosition = lastSectionNode.offsetTop + lastSectionNode.offsetHeight;
    const screenHeight = window.screen.height;
    const topOffsetAtButtonOfScreen = documentHeight - screenHeight;
    if (lastSectionNode.offsetTop >= topOffsetAtButtonOfScreen) {
      const growNumber = screenHeight - (documentHeight - lastSectionNodePosition);
      lastSectionNode.style.minHeight = `${growNumber}px`;
    }
  };

  render() {
    const { children } = this.props;
    const { activeNode } = this.state;

    return React.Children.map(children, child =>
      React.cloneElement(child, {
        active: child.props.link === activeNode,
        onClick: this.handleClick(child.props.link),
      })
    );
  }
}

export default JumpToSection;
