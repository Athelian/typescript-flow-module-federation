// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  children: React.Node,
};

export default class NavBar extends React.Component<Props> {
  el: HTMLElement;

  constructor(props: Props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    const navBarRoot = document.getElementById('navbar-root');
    if (navBarRoot) {
      navBarRoot.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    const navBarRoot = document.getElementById('navbar-root');
    if (navBarRoot) {
      navBarRoot.removeChild(this.el);
    }
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}
