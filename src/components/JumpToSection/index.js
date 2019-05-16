// @flow
import * as React from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import logger from 'utils/logger';

type Props = {
  children: React.Node,
  rootViewPort?: ?HTMLDivElement,
  threshold?: Array<number>,
};

type State = {
  activeNode: ?string,
};

class JumpToSection extends React.Component<Props, State> {
  isMountedOnDOM = false;

  static defaultProps = {
    rootViewPort: null,
    threshold: [0, 1],
  };

  state = {
    activeNode: null,
  };

  io: IntersectionObserver;

  componentDidMount() {
    this.isMountedOnDOM = true;
    logger.warn('create IntersectionObserver');
    const { rootViewPort, threshold } = this.props;
    this.io = new IntersectionObserver(
      entries => {
        if (entries.length) {
          const intersectSections = entries.filter(item => item.isIntersecting);
          const [activeSection] = intersectSections.sort(
            (first, second) => second.intersectionRatio - first.intersectionRatio
          );

          if (!activeSection) {
            return;
          }

          const {
            intersectionRatio,
            target: { id: activeNode },
          } = activeSection;
          const ratio = intersectionRatio * 100;
          if (ratio > 50 && this.isMountedOnDOM) this.setState(() => ({ activeNode }));
        }
      },
      {
        threshold,
        root: rootViewPort,
        rootMargin: '0px',
      }
    );
    const { children } = this.props;
    const TIMEOUT = 1000;
    setTimeout(() => {
      React.Children.forEach(
        children,
        child => {
          const { link } = child.props;
          const element = document.querySelector(`#${link}`);
          if (element) {
            this.io.observe(element);
          } else {
            // wait for the element is rendering on DOM
            const retryFindElement = () => {
              const retryElement = document.querySelector(`#${link}`);
              if (!retryElement) {
                requestAnimationFrame(retryFindElement);
              } else {
                this.io.observe(retryElement);
              }
            };

            requestAnimationFrame(retryFindElement);
          }
        },
        TIMEOUT
      );
    });
  }

  componentWillUnmount() {
    logger.warn('remove IntersectionObserver');
    this.isMountedOnDOM = false;
    this.io.disconnect();
  }

  handleClick = (id: string) => () => {
    const node = document.querySelector(`#${id}`);
    if (node) {
      scrollIntoView(node, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
      });
    }
  };

  render() {
    const { children } = this.props;
    const { activeNode } = this.state;

    return !activeNode
      ? React.Children.map(children, child =>
          React.cloneElement(child, {
            active: child.props.link === activeNode,
            onClick: this.handleClick(child.props.link),
          })
        )
      : React.Children.map(
          children,
          child =>
            document.querySelector(`#${child.props.link}`) &&
            React.cloneElement(child, {
              active: child.props.link === activeNode,
              onClick: this.handleClick(child.props.link),
            })
        );
  }
}

export default JumpToSection;
