import React from 'react';

import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';

export const Operations = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations;

  return <View title={operationsLangResources.title}>
    <View.Title>{operationsLangResources.title}</View.Title>
  </View>;
};

export const OperationsPure = React.memo(Operations);
