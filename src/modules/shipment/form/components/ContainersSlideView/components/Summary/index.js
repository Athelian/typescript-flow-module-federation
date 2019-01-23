// @flow
import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';

import GridColumn from 'components/GridColumn';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import {
  SummaryWrapperStyle,
  LeftPartWrapperStyle,
  BlueStyle,
  GrayLightStyle,
  TealStyle,
} from './style';

type OptionalProps = {
  agreedArrivalDateFrom: string,
  agreedArrivalDateTo: string,
  actualArrivalDateFrom: string,
  actualArrivalDateTo: string,
};

type Props = OptionalProps & {
  containers: Array<Object>,
  approvedAgreementSize: number,
  approvedConfirmationSize: number,
};

const Summary = ({
  agreedArrivalDateFrom,
  agreedArrivalDateTo,
  actualArrivalDateFrom,
  actualArrivalDateTo,
  containers,
  approvedAgreementSize,
  approvedConfirmationSize,
}: Props) => (
  <div className={SummaryWrapperStyle}>
    <GridColumn>
      <div className={LeftPartWrapperStyle}>
        <GridColumn>
          <div>&nbsp;</div>
          <div>
            <FormattedMessage id="modules.shipment.agreedArrival" defaultMessage="AGREED ARRIVAL" />
          </div>
          <div>
            <FormattedMessage id="modules.shipment.agreedArrival" defaultMessage="AGREED ARRIVAL" />
          </div>
        </GridColumn>
        <GridColumn>
          <div>
            <FormattedMessage id="modules.shipment.from" defaultMessage="FROM" />
          </div>
          {agreedArrivalDateFrom ? (
            <div className={BlueStyle}>
              <FormattedDate mode="datetime" value={agreedArrivalDateFrom} />
            </div>
          ) : (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          )}

          {actualArrivalDateFrom ? (
            <div className={BlueStyle}>
              <FormattedDate mode="datetime" value={actualArrivalDateFrom} />
            </div>
          ) : (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          )}
        </GridColumn>
        <GridColumn>
          <div>
            <FormattedMessage id="modules.shipment.to" defaultMessage="TO" />
          </div>

          {agreedArrivalDateTo ? (
            <div className={TealStyle}>
              <FormattedDate mode="datetime" value={agreedArrivalDateTo} />
            </div>
          ) : (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          )}

          {actualArrivalDateTo ? (
            <div className={TealStyle}>
              <FormattedDate mode="datetime" value={actualArrivalDateTo} />
            </div>
          ) : (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          )}
        </GridColumn>
      </div>
    </GridColumn>
    <GridColumn>
      <FieldItem
        label={
          <Label>
            <FormattedMessage
              id="modules.shipment.noOfContainers"
              defaultMessage="NO. OF CONTAINERS"
            />
          </Label>
        }
        input={
          <Display>
            <FormattedNumber value={containers.length} />
          </Display>
        }
      />
      <FieldItem
        label={
          <Label>
            <FormattedMessage
              id="modules.shipment.noOfApprovedAgreements"
              defaultMessage="NO. OF APPROVED AGREEMENTS"
            />
          </Label>
        }
        input={
          <Display color="BLUE">
            <FormattedNumber value={approvedAgreementSize} /> <Icon icon="CONTAINER" />
          </Display>
        }
      />
      <FieldItem
        label={
          <Label>
            <FormattedMessage
              id="modules.shipment.noOfApprovedConfirmations"
              defaultMessage="NO. OF APPROVED CONFIRMATIONS"
            />
          </Label>
        }
        input={
          <Display color="TEAL">
            <FormattedNumber value={approvedConfirmationSize} /> <Icon icon="CONTAINER" />
          </Display>
        }
      />
    </GridColumn>
  </div>
);

export default Summary;
