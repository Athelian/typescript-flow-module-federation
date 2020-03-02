// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Content, FormLayout, SlideViewNavBar } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import LoadingIcon from 'components/LoadingIcon';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SectionWrapper } from 'components/Form';
import StaffSection from './components/StaffSection';
import PartnerSection from './components/PartnerSection';

type Props = {
  isDirty: boolean,
  isValidated: boolean,
  resetState: () => void,
  isSlideView?: boolean,
  isLoading?: boolean,
  isProcessing?: boolean,
  handleSave?: Function,
};

const PartnerForm = ({
  isDirty,
  isValidated,
  resetState,
  isSlideView,
  isLoading,
  isProcessing,
  handleSave,
}: Props) => {
  const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

  return (
    <>
      <CurrentNavBar>
        <EntityIcon icon="PARTNER" color="PARTNER" />
        <JumpToSection>
          <SectionTabs
            link="partner_partnerSection"
            label={
              <FormattedMessage id="modules.Partner.partnerSection" defaultMessage="Partner" />
            }
            icon="PARTNER"
          />

          <SectionTabs
            link="partner_staffSection"
            label={<FormattedMessage id="modules.Partner.staffSection" defaultMessage="Staff" />}
            icon="STAFF"
          />
        </JumpToSection>

        {isDirty && <ResetFormButton onClick={resetState} />}

        {isDirty && (
          <SaveFormButton
            id="partner_form_save_button"
            disabled={!isValidated}
            isLoading={isProcessing}
            onClick={handleSave}
          />
        )}
      </CurrentNavBar>

      <Content>
        {isLoading ? (
          <LoadingIcon />
        ) : (
          <FormLayout>
            <SectionWrapper id="partner_partnerSection">
              <PartnerSection />
            </SectionWrapper>

            <SectionWrapper id="partner_staffSection">
              <StaffSection />
            </SectionWrapper>
          </FormLayout>
        )}
      </Content>
    </>
  );
};

export default PartnerForm;
