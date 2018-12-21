// @flow
import * as React from 'react';

const { PureComponent } = React;
type Props = {
  setTemplateColumns: Function,
  templateColumns: Array<string>,
  columns: Array<string>,
  children: React.Node,
};

export default class UpdateTemplateColumn extends PureComponent<Props> {
  componentDidMount() {
    const { columns, setTemplateColumns, templateColumns } = this.props;
    setTemplateColumns(templateColumns.concat(columns));
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
