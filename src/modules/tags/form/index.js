// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import { isEquals } from 'utils/fp';
import { TagSection } from './components';
import { TagFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  tag: Object,
  onDetailReady: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  tag: {},
  onDetailReady: () => {},
};

export default class TagForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { tag } = this.props;

    return !isEquals(tag, nextProps.tag);
  }

  render() {
    const { tag, isNew } = this.props;

    return (
      <div className={TagFormWrapperStyle}>
        <SectionWrapper id="tagSection">
          <SectionHeader
            icon="TAG"
            title={<FormattedMessage id="modules.tags.tag" defaultMessage="TAG" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={tag.updatedAt} updatedBy={tag.updatedBy} />
              </>
            )}
          </SectionHeader>
          <TagSection isNew={isNew} />
        </SectionWrapper>
      </div>
    );
  }
}
