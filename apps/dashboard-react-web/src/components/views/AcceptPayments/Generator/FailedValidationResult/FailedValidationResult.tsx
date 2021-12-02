import React from 'react';

import { FailedValidationResults } from '@tezospayments/common';

import './FailedValidationResult.scss';
import { useCurrentLanguageResources } from '../../../../hooks';

interface FailedValidationResultProps {
  results: FailedValidationResults
}

export const FailedValidationResult = (_props: FailedValidationResultProps) => {
  const langResources = useCurrentLanguageResources();
  const acceptPaymentsLangResources = langResources.views.acceptPayments;

  return <div className="failed-validation-result">
    {acceptPaymentsLangResources.errors.fillRequiredData}
  </div>;
};

export const FailedValidationResultPure = React.memo(FailedValidationResult);
