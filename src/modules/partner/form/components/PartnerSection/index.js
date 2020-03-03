// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { PARTNER_UPDATE, PARTNER_SET_TAGS } from 'modules/permission/constants/partner';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { TagsInput, SectionHeader, LastModified, FieldItem, Display, Label } from 'components/Form';
import GridColumn from 'components/GridColumn';
import PartnerFormContainer from 'modules/partner/form/container';
import { Section } from 'components/Sections';
import { PartnerTypesWrapperStyle } from './style';

const PartnerSection = () => {
  const { state, setFieldValue } = PartnerFormContainer.useContainer();

  const hasPermissions = useEntityHasPermissions(state);
  const canUpdate = hasPermissions(PARTNER_UPDATE);

  return (
    <>
      <SectionHeader
        icon="PARTNER"
        title={<FormattedMessage id="modules.Partner.partnerSection" defaultMessage="Partner" />}
      >
        {state.updatedAt && state.updatedBy && (
          <LastModified updatedAt={state.updatedAt} updatedBy={state.updatedBy} />
        )}
      </SectionHeader>

      <Section>
        <GridColumn>
          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.name" defaultMessage="Name" />
              </Label>
            }
            input={<Display height="30px">{state.name || state.organization?.name}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.code" defaultMessage="Code" />
              </Label>
            }
            input={<Display height="30px">{state.code}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.type" defaultMessage="Type" />
              </Label>
            }
            input={
              <div className={PartnerTypesWrapperStyle}>
                {state.types.map(type => (
                  <Display height="30px" key={type}>
                    {type}
                  </Display>
                ))}
              </div>
            }
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.phoneNumber" defaultMessage="Phone Number" />
              </Label>
            }
            input={<Display height="30px">{state.organization?.tel}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.country" defaultMessage="Country" />
              </Label>
            }
            input={<Display height="30px">{state.organization?.country}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.region" defaultMessage="Region" />
              </Label>
            }
            input={<Display height="30px">{state.organization?.region}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.locality" defaultMessage="Locality" />
              </Label>
            }
            input={<Display height="30px">{state.organization?.locality}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.street" defaultMessage="Street" />
              </Label>
            }
            input={<Display height="30px">{state.organization?.street}</Display>}
          />

          <FieldItem
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.postalCode" defaultMessage="Post Code" />
              </Label>
            }
            input={<Display height="30px">{state.organization?.postalCode}</Display>}
          />

          <FieldItem
            vertical
            label={
              <Label height="30px">
                <FormattedMessage id="modules.Partner.tags" defaultMessage="Tags" />
              </Label>
            }
            input={
              <TagsInput
                name="tags"
                tagType="Partner"
                values={state.tags}
                onChange={value => {
                  setFieldValue('tags', value);
                }}
                onClickRemove={value => {
                  setFieldValue(
                    'tags',
                    state.tags.filter(({ id }) => id !== value.id)
                  );
                }}
                editable={{
                  // TODO: Remove hardcoded true when the strings are setup
                  set:
                    (hasPermissions(TAG_LIST) && (canUpdate || hasPermissions(PARTNER_SET_TAGS))) ||
                    true,
                  remove: canUpdate || hasPermissions(PARTNER_SET_TAGS) || true,
                }}
              />
            }
          />
        </GridColumn>
      </Section>
    </>
  );
};
export default PartnerSection;
