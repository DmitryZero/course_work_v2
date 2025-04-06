import React, { useEffect } from 'react';
import logo from './logo.svg';
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

function App() {
  const users: TUser[] = [
    { id: "1", name: "Admin - Никитин Дмитрий", is_admin: true },
    { id: "2", name: "Ложкин Ярослав" },
    { id: "3", name: "Смирнов Никита" },
    { id: "4", name: "Максимов Андрей" },
  ];

  const groups: TGroup[] = [
    { id: "1", name: "Группа 1", users: [users[0], users[1]] },
    { id: "2", name: "Группа 2" },
  ];

  const items: TElement[] = [
    { id: "1", name: "Test 1", description: "Test 1_", permissions: { read: groups[0], write: groups[1] } },
    { id: "2", name: "Test 2", description: "Test 2_", permissions: {} },
    { id: "3", name: "Test 3", description: "Test 3_", permissions: {} },
    { id: "4", name: "Test 4", description: "Test 4_", permissions: {} },
    { id: "5", name: "Test 5", description: "Test 5_", permissions: {} },
  ];

  groups[0].parent_group = groups[1];
  users[0].user_groups = [groups[1]];

  // initializeStore({
  //   groups: groups,
  //   users: users,
  //   current_user: users[0]
  // });

  const fetchUser = useUserStore(state => state.fetchUsers);
  const fetchElements = useElementStore(state => state.fetchElements);
  const fetchGroups = useGroupStore(state => state.fetchGroups);
  useEffect(() => {
    fetchUser(users);
    fetchElements(items);
    fetchGroups(groups);
  }, [])

  const current_user = useUserStore(state => state.currentUser);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Управление правами</h1>
      <CurrentUserSelector />
      <h2 className="text-xl font-bold">Список элементов</h2>
      <ElementCreator />
      <ElementList />
      {
        current_user?.is_admin && <>
          <h2 className="text-xl font-bold">Список групп</h2>
          <GroupCreator />
          <GroupList />
        </>
      }

    </div>
  );
}

export default App;
