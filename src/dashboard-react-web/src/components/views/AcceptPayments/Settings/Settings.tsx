import React from 'react';

interface SettingsProps {
  address?: string;
}

export const Settings = (props: SettingsProps) => {
  return <div>Settings: {props.address}</div>;
};

export const SettingsPure = React.memo(Settings);
