// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
// import { PARTNER_UPDATE } from 'modules/permission/constants/partner';
// import usePermission from 'hooks/usePermission';
// import usePartnerPermission from 'hooks/usePartnerPermission';
import WarehouseInfoContainer from 'modules/warehouse/form/containers';
import validator from 'modules/warehouse/form/validator';
import { getByPath } from 'utils/fp';
import { FormField } from 'modules/form';
import GridColumn from 'components/GridColumn';
import MainSectionPlaceholder from 'components/PlaceHolder/MainSectionPlaceHolder';
import { SectionHeader, TextInputFactory } from 'components/Form';
import { PartnerSectionWrapperStyle, MainFieldsWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  isClone: boolean,
  isLoading: boolean,
};

const PartnerSection = ({ isLoading }: Props) => {
  // const { isOwner } = usePartnerPermission();
  // const { hasPermission } = usePermission(isOwner);
  // const allowUpdate = hasPermission(PARTNER_UPDATE);

  return (
    <Subscribe to={[WarehouseInfoContainer]}>
      {({ originalValues, state, setFieldValue, setFieldArrayValue }) => {
        const values = { ...originalValues, ...state };
        return (
          <MainSectionPlaceholder height={665} isLoading={isLoading}>
            <SectionHeader
              icon="PARTNER"
              title={<FormattedMessage id="modules.Partners.partner" defaultMessage="PARTNER" />}
            />
            <div className={PartnerSectionWrapperStyle}>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
                  <FormField
                    name="name"
                    initValue={values.name}
                    validator={validator}
                    setFieldValue={setFieldValue}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={false}
                        required
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="modules.Partners.name" defaultMessage="Name" />
                        }
                        editable={false}
                      />
                    )}
                  </FormField>

                  <FormField name="code" initValue={values.code} setFieldValue={setFieldValue}>
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={false}
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="modules.Partners.code" defaultMessage="Code" />
                        }
                        editable={false}
                      />
                    )}
                  </FormField>
                  <FormField
                    name="types"
                    initValue={getByPath('types', values)}
                    setFieldValue={(field, value) => setFieldArrayValue('types', value)}
                    values={values}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        isNew={false}
                        originalValue={getByPath('types', originalValues)}
                        label={
                          <FormattedMessage id="modules.Partners.type" defaultMessage="TYPE" />
                        }
                        editable={false}
                      />
                    )}
                  </FormField>
                </GridColumn>
              </div>
            </div>
          </MainSectionPlaceholder>
        );
      }}
    </Subscribe>
  );
};
export default PartnerSection;
