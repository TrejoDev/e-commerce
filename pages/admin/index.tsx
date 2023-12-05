import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import { AdminLayout } from '@/components/layouts';
import { SummaryTitle } from '@/components/admin';
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {

  const { data, error, isLoading } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 seg
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 )
    }, 1000 );
    return () => clearInterval( interval );
  }, []);
  
  if (isLoading) return <Typography>loading...</Typography>;

  if( !data && !error  ) {
    <></>
  }

  if(error){
    console.log(error);
    return <Typography>Error loading information</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  } = data!;

  return (
    <AdminLayout 
        title='Dashboard' 
        subTitle='General statistics'  
        icon={ <DashboardOutlined /> }      
    >
      <Grid container spacing={ numberOfOrders }>
        <SummaryTitle 
          title={1} 
          subTitle='Total orders' 
          icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ paidOrders } 
          subTitle='Paid orders' 
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ notPaidOrders } 
          subTitle='Pending orders' 
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ numberOfClients } 
          subTitle='Clients' 
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ numberOfProducts } 
          subTitle='Products' 
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ productsWithNoInventory } 
          subTitle='Out of Stock' 
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ lowInventory } 
          subTitle='Low inventory' 
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTitle 
          title={ refreshIn } 
          subTitle='Update on: ' 
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage