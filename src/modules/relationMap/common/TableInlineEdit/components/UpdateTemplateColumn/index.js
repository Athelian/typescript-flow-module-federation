// @flow
import * as React from 'react';

const { Component } = React;
type Props = {
  setTemplateColumns: Function,
  templateColumns: Array<string>,
  columns: Array<string>,
  children: React.Node,
};

export default class UpdateTemplateColumn extends Component<Props> {
  componentDidMount() {
    const { columns, setTemplateColumns, templateColumns } = this.props;
    setTemplateColumns(templateColumns.concat(columns));
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
