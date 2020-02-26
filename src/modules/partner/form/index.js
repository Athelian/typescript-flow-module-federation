// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import { SectionWrapper } from 'components/Form';
import { PartnerSection } from './components';
// import { PartnerFormWrapperStyle } from './style';

type OptionalProps = {
  isLoading: boolean,
  partner: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isLoading: false,
  partner: {},
};

export default class WarehouseForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { partner } = this.props;
    return !isEquals(partner, nextProps.partner);
  }

  render() {
    const { isLoading } = this.props;

    return (
      <div>
        <SectionWrapper id="partner_partnerSection">
          <PartnerSection isLoading={isLoading} />
        </SectionWrapper>
      </div>
    );
  }
}
