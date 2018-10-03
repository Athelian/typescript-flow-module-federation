// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  email: {
    id: 'containers.Users.email',
    defaultMessage: 'EMAIL',
  },
  role: {
    id: 'containers.Users.role',
    defaultMessage: 'ROLE',
  },
  tags: {
    id: 'containers.Users.tags',
    defaultMessage: 'TAGS',
  },
  firstName: {
    id: 'containers.Users.firstName',
    defaultMessage: 'FIRST NAME',
  },
  lastName: {
    id: 'containers.Users.lastName',
    defaultMessage: 'LAST NAME',
  },
  language: {
    id: 'containers.Users.language',
    defaultMessage: 'LANGUAGE',
  },
  timezone: {
    id: 'containers.Users.timezone',
    defaultMessage: 'TIMEZONE',
  },
  createdAt: {
    id: 'containers.Users.createdAt',
    defaultMessage: 'CREATED ON',
  },
  updatedAt: {
    id: 'containers.Users.updatedAt',
    defaultMessage: 'LAST MODIFIED',
  },
  required: {
    id: 'containers.Users.validation.required',
    defaultMessage: 'Required',
  },
  emailError: {
    id: 'containers.Users.validation.email',
    defaultMessage: 'Please enter a valid email address',
  },
  signUpUser: {
    id: 'containers.Users.signUp',
    defaultMessage: 'ADD STAFF',
  },
  tooltipName: {
    id: 'containers.Users.tooltip.name',
    defaultMessage: '[Name] {firstName} {lastName}',
  },
  tooltipEmail: {
    id: 'containers.Users.tooltip.email',
    defaultMessage: '[Email] {email}',
  },
  tooltipRole: {
    id: 'containers.Users.tooltip.role',
    defaultMessage: '[Role] {role}',
  },
  tooltipDetails: {
    id: 'containers.Users.tooltip.details',
    defaultMessage: 'View Details',
  },
  infoTab: {
    id: 'containers.Users.infoTab',
    defaultMessage: 'INFO',
  },
  batchItemsTab: {
    id: 'containers.Users.batchItemsTab',
    defaultMessage: 'BATCHES',
  },
  emailSent: {
    id: 'containers.Users.emailSent',
    defaultMessage: 'An email will be sent shortly to "{email}" to complete staff sign up.',
  },
  noUsers: {
    id: 'containers.Users.noUsers',
    defaultMessage: 'No staff found.',
  },
});
