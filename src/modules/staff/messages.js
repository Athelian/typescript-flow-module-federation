// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  email: {
    id: 'modules.Users.email',
    defaultMessage: 'EMAIL',
  },
  role: {
    id: 'modules.Users.role',
    defaultMessage: 'ROLE',
  },
  tags: {
    id: 'modules.Users.tags',
    defaultMessage: 'TAGS',
  },
  firstName: {
    id: 'modules.Users.firstName',
    defaultMessage: 'FIRST NAME',
  },
  lastName: {
    id: 'modules.Users.lastName',
    defaultMessage: 'LAST NAME',
  },
  language: {
    id: 'modules.Users.language',
    defaultMessage: 'LANGUAGE',
  },
  timezone: {
    id: 'modules.Users.timezone',
    defaultMessage: 'TIMEZONE',
  },
  createdAt: {
    id: 'modules.Users.createdAt',
    defaultMessage: 'CREATED ON',
  },
  updatedAt: {
    id: 'modules.Users.updatedAt',
    defaultMessage: 'LAST MODIFIED',
  },
  required: {
    id: 'modules.Users.validation.required',
    defaultMessage: 'Required',
  },
  emailError: {
    id: 'modules.Users.validation.email',
    defaultMessage: 'Please enter a valid email address',
  },
  signUpUser: {
    id: 'modules.Users.signUp',
    defaultMessage: 'ADD STAFF',
  },
  tooltipName: {
    id: 'modules.Users.tooltip.name',
    defaultMessage: '[Name] {firstName} {lastName}',
  },
  tooltipEmail: {
    id: 'modules.Users.tooltip.email',
    defaultMessage: '[Email] {email}',
  },
  tooltipRole: {
    id: 'modules.Users.tooltip.role',
    defaultMessage: '[Role] {role}',
  },
  tooltipDetails: {
    id: 'modules.Users.tooltip.details',
    defaultMessage: 'View Details',
  },
  infoTab: {
    id: 'modules.Users.infoTab',
    defaultMessage: 'INFO',
  },
  batchItemsTab: {
    id: 'modules.Users.batchItemsTab',
    defaultMessage: 'BATCHES',
  },
  emailSent: {
    id: 'modules.Users.emailSent',
    defaultMessage: 'An email will be sent shortly to "{email}" to complete staff sign up.',
  },
  noUsers: {
    id: 'modules.Users.noUsers',
    defaultMessage: 'No staff found.',
  },
});
