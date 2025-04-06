import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TUser } from './interfaces/TUser';
import { TGroup } from './interfaces/TGroup';
import { TElement } from './interfaces/TElement';
import { initializeStore } from './context/AppDataContext';
import CurrentUserSelector from './components/CurrentUserSelector';

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

  initializeStore({
    groups: groups,
    users: users,
    current_user: users[0]
  });

  return (
    <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Управление правами</h1>
            <CurrentUserSelector />
            <h2 className="text-xl font-bold">Список элементов</h2>
        </div>
  );
}

export default App;
