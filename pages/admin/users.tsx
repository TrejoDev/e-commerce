import { useEffect, useState } from 'react'

import useSWR from 'swr';
import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@/components/layouts'
import { IUser } from '@/interfaces';
import { tesloApi } from '@/axiosApi';

const UsersPage = () => {

    const { data, error, isLoading } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
      if( data ){
        setUsers( data )
      }
    }, [data])
    
    
    if (isLoading) return <Typography>loading...</Typography>;
    if( !data && !error ) (<></>);

    const onRoleUpdated = async( userId: string, newRole: string ) => {

        const previosUsers = users.map( user => ({ ...user }) );
        const updatedUsers = users.map( user => ({       //Permite brindar mejor UX, hace el cambio directamente en el frontend antes de las validaciones.
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers( updatedUsers );

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole })
        } catch (error) {
            setUsers( previosUsers );
            console.log(error);
            alert('Failed to update user role')
        }

    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Full name', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridRenderCellParams ) => {
                return (
                    <Select
                        value={ row.role }
                        label='Role'
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem> 
                        <MenuItem value='client'>Client</MenuItem> 
                        <MenuItem value='super-user'>Super User</MenuItem> 
                        <MenuItem value='SEO'>SEO</MenuItem> 
                    </Select>
                )
            }
        },
    ];

    const rows = users.map( user => ({
        id   : user._id,
        email: user.email,
        name : user.name,
        role : user.role,

    }))

    return (
        <AdminLayout
            title={'Users'}
            subTitle={'User maintenance'}
            icon={<PeopleOutline />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}

                    />

                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default UsersPage