import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';
import { View } from '../../View';

export const UpdateServiceHeader = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return <View.Title>{servicesLangResources.editing.updateService}</View.Title>;
};

export const UpdateServiceHeaderPure = React.memo(UpdateServiceHeader);
