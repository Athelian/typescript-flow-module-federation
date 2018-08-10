// @flow
import * as React from 'react';
import logger from 'utils/logger';

type Props = {
  children: React.Node,
  rootViewPort?: ?HTMLDivElement,
  threshold?: Array<number>,
};

type State = {
  activeNode: ?string,
  ratio: number,
};

class JumpToSection extends React.PureComponent<Props, State> {
  static defaultProps = {
    rootViewPort: null,
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
  };

  state = {
    activeNode: null,
    ratio: 0,
  };

  componentDidMount() {
    logger.warn('create IntersectionObserver');
    this.sectionIds = [];
    const { rootViewPort, threshold } = this.props;
    this.io = new IntersectionObserver(
      entries => {
        logger.warn('entries', entries, this.sectionIds);
        if (entries.length) {
          const intersectSections = entries.filter(item => item.isIntersecting);
          const hideSections = entries.filter(item => !item.isIntersecting);
          logger.warn('intersect', intersectSections);
          logger.warn('hide', hideSections);
          const [activeSection] = intersectSections.sort(
            (first, second) => second.intersectionRatio - first.intersectionRatio
          );
          logger.warn('active', activeSection);

          if (!activeSection) {
            logger.warn('not found active section', this.state);
            return;
          }

          const {
            intersectionRatio,
            target: { id: activeNode },
          } = activeSection;
          const ratio = intersectionRatio * 100;
          logger.warn('intersectionRatio', ratio);
          if (ratio > 50) this.setState(() => ({ activeNode, ratio }));
        }
      },
      {
        threshold,
        root: rootViewPort,
        rootMargin: '0px',
      }
    );
    const { children } = this.props;
    React.Children.forEach(children, child => {
      const element = document.querySelector(`#${child.props.link}`);
      if (element) {
        this.sectionIds.push(child.props.link);
        this.io.observe(element);
      }
    });
  }

  componentWillUnmount() {
    logger.warn('remove IntersectionObserver');
    this.io.disconnect();
  }

  handleClick = (id: string) => () => {
    const node = document.querySelector(`#${id}`);
    if (node) {
      node.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  sectionIds: Array<string>;

  io: IntersectionObserver;

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
