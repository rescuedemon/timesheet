import React from 'react';
import SettingsHolidays from './SettingsHolidays';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface SettingsManagerAccessProps {
  holidays: Holiday[];
  setHolidays: (holidays: Holiday[]) => void;
}

const SettingsManagerAccess: React.FC<SettingsManagerAccessProps> = ({
  holidays,
  setHolidays
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Holiday Management</h3>
        <SettingsHolidays holidays={holidays} setHolidays={setHolidays} />
      </div>
    </div>
  );
};

export default SettingsManagerAccess;