// @flow
import { Container } from 'unstated';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';
import { defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';
import { initDatetimeToContainer } from 'utils/date';

type ShipmentInfoType = {
  followers: Array<{ id: string, firstName: string, lastName: string }>,
  no: ?string,
  blNo: ?string,
  blDate: ?Date,
  bookingNo: ?string,
  booked: boolean,
  bookingDate: ?Date,
  invoiceNo: ?string,
  contractNo: ?string,
  loadType: ?string,
  incoterm: ?string,
  carrier: ?string,
  customFields: Object,
  memo: ?string,
  importer: ?{ id: string, name: string },
  forwarders: Array<{ id: string, name: string }>,
  exporter: ?{ id: string, name: string },
  totalPackageQuantityOverride: number,
  totalPackageQuantityOverriding: boolean,
  totalVolumeOverride: Object,
  totalVolumeOverriding: boolean,
  totalWeightOverride: Object,
  totalWeightOverriding: boolean,
};

const initValues = {
  followers: [],
  no: null,
  blNo: null,
  blDate: null,
  bookingNo: null,
  booked: false,
  bookingDate: null,
  invoiceNo: null,
  contractNo: null,
  loadType: null,
  incoterm: null,
  carrier: null,
  customFields: {
    mask: null,
    fieldValues: [],
  },
  memo: null,
  importer: null,
  forwarders: [],
  exporter: null,
  totalPackageQuantityOverride: 0,
  totalPackageQuantityOverriding: false,
  totalVolumeOverride: { value: 0, metric: defaultVolumeMetric },
  totalVolumeOverriding: false,
  totalWeightOverride: { value: 0, metric: defaultWeightMetric },
  totalWeightOverriding: false,
};

export default class ShipmentInfoContainer extends Container<ShipmentInfoType> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldValues = (values: Object) => {
    this.setState(values);
  };

  // On change Importer or Exporter, set new partner and clean up Followers
  onChangePartner = (fieldName: string, newPartner: Object) => {
    this.setState(({ followers = [], [fieldName]: prevPartner }) => {
      if (prevPartner) {
        const cleanedFollowers = followers.filter(
          follower => follower?.organization?.id !== prevPartner?.id
        );

        return { [fieldName]: newPartner, followers: cleanedFollowers };
      }

      return { [fieldName]: newPartner };
    });
  };

  // On change Forwarders, set new Forwarders clean up Followers
  onChangeForwarders = (newForwarders: Array<Object>) => {
    this.setState(({ followers = [], forwarders: prevForwarders = [] }) => {
      const removedForwarders = prevForwarders.filter(
        prevForwarder => !newForwarders.some(newForwarder => newForwarder.id === prevForwarder.id)
      );

      if (prevForwarders.length > 0 && removedForwarders.length > 0) {
        const cleanedFollowers = followers.filter(
          follower =>
            !removedForwarders.some(
              removedForwarder => removedForwarder.id === follower?.organization?.id
            )
        );

        return { forwarders: newForwarders, followers: cleanedFollowers };
      }

      return { forwarders: newForwarders };
    });
  };

  initDetailValues = (values: Object, timezone: string) => {
    const { blDate, bookingDate, ...rest } = values;

    const info = {
      ...initDatetimeToContainer(blDate, 'blDate', timezone),
      ...initDatetimeToContainer(bookingDate, 'bookingDate', timezone),
      ...rest,
    };

    const parsedValues = { ...initValues, ...info };

    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
