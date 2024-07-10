import React, { useState, useEffect } from 'react';
import NewOrders from './NewOrders';
import UpdateItems from './UpdateItems/UpdateItems';
import Warehouse from './Warehouse';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const WarehouseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize the active tab based on the URL hash or default to 'newOrders'
    const hash = window.location.hash.substr(1);
    return ['newOrders', 'updateItems', 'warehouse'].includes(hash) ? hash : 'newOrders';
  });

  useEffect(() => {
    // Update the URL hash when the active tab changes
    window.location.hash = activeTab;

    // Add an event listener to handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.substr(1);
      if (['newOrders', 'updateItems', 'warehouse'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const isActiveTab = (tab: string) => activeTab === tab;

  return (
    <div>
      <ButtonGroup variant="contained" color="primary" aria-label="outlined primary button group"
      sx={{ '& > *': { margin: '5px' } }}>
        <Button
          variant={isActiveTab('newOrders') ? 'contained' : 'outlined'}
          onClick={() => handleTabChange('newOrders')}
        >
          New Orders
        </Button>
        <Button
          variant={isActiveTab('updateItems') ? 'contained' : 'outlined'}
          onClick={() => handleTabChange('updateItems')}
        >
          Items Maintenance
        </Button>
        <Button
          variant={isActiveTab('warehouse') ? 'contained' : 'outlined'}
          onClick={() => handleTabChange('warehouse')}
        >
          Warehouse
        </Button>
      </ButtonGroup>
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'newOrders' && <NewOrders />}
        {activeTab === 'updateItems' && <UpdateItems />}
        {activeTab === 'warehouse' && <Warehouse />}
      </div>
    </div>
  );
};

export default WarehouseDashboard;
