// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import { CloneButton } from 'components/Buttons';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
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

  onClone = () => {
    const { tag } = this.props;
    navigate(`/tags/clone/${encodeId(tag.id)}`);
  };

  render() {
    const { tag, isNew } = this.props;

    return (
      <div className={TagFormWrapperStyle}>
        <SectionWrapper id="tagSection">
          <SectionHeader
            icon="TAG"
            title={<FormattedMessage id="modules.Tags.tag" defaultMessage="TAG" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={tag.updatedAt} updatedBy={tag.updatedBy} />
                <CloneButton onClick={this.onClone} />
              </>
            )}
          </SectionHeader>
          <TagSection isNew={isNew} />
        </SectionWrapper>
      </div>
    );
  }
}
