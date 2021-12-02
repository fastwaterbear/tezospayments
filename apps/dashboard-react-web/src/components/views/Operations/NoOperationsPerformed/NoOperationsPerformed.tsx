import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';

import './NoOperationsPerformed.scss';

export const NoOperationsPerformed = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations.operationList;

  return <div className="no-operations-performed-container">
    {operationsLangResources.noOperationsPerformedYet}
  </div>;
};

export const NoOperationsPerformedPure = React.memo(NoOperationsPerformed);
