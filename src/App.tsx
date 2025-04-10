import React, { useEffect } from 'react';
import './App.css';
import { TUser } from './interfaces/TUser';
import { TGroup } from './interfaces/TGroup';
import { TElement } from './interfaces/TElement';
import CurrentUserSelector from './components/Users/CurrentUserSelector';
import { useUserStore } from './components/Users/UserStore';
import { useElementStore } from './components/Elements/ElementStore';
import ElementList from './components/Elements/ElementList';
import { useGroupStore } from './components/Groups/GroupStore';
import ElementCreator from './components/Elements/ElementCreator';
import GroupCreator from './components/Groups/GroupCreator';
import GroupList from './components/Groups/GroupList';
import { Alert, Grid, Snackbar } from '@mui/material';
import { useNotificationStore } from './components/General/NotificationStore';


function App() {
  const current_user = useUserStore(state => state.currentUser);

  const fetchUser = useUserStore(state => state.fetchUsers);
  const fetchGroups = useGroupStore(state => state.fetchGroups);
  const fetchElements = useElementStore(state => state.fetchElements);
  useEffect(() => {    
    fetchUser();
    fetchGroups();
    fetchElements();
  }, [])

  
  const notifications = useNotificationStore(state => state.notifications);
  const removeNotification = useNotificationStore(state => state.removeNotification);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Управление правами</h1>
      <CurrentUserSelector />

      <Grid container spacing={2}>
        <Grid size={current_user?.is_admin ? 6 : 12}>
          <h2 className="text-xl font-bold">Управление элементами</h2>
          <ElementCreator />
          <ElementList />
        </Grid>
        <Grid size={6}>
          {
            current_user?.is_admin && <>
              <h2 className="text-xl font-bold">Управление группами</h2>
              <GroupCreator />
              <GroupList />
            </>
          }
        </Grid>
      </Grid>

      <Snackbar
        open={notifications.length > 0}
        autoHideDuration={3000}
        onClose={removeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notifications[0] && (
          <Alert severity={notifications[0].severity} variant="filled">
            {notifications[0].message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
}

export default App;
