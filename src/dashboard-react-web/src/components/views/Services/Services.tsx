import React from 'react';

import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';

export const Services = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return <View title={servicesLangResources.title}>
    <View.Title>{servicesLangResources.title}</View.Title>
  </View >;
};

export const ServicesPure = React.memo(Services);
