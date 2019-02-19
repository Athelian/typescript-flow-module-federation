// @flow
import * as React from 'react';
import { isEquals } from 'utils/fp';
import { TagSection } from './components';
import { TagFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  tag: Object,
  onFormReady: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  tag: {},
  onFormReady: () => {},
};

export default class TagForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { tag } = this.props;
    return !isEquals(tag, nextProps.tag);
  }

  render() {
    const { isNew } = this.props;
    return (
      <div className={TagFormWrapperStyle}>
        <TagSection isNew={isNew} />
      </div>
    );
  }
}
