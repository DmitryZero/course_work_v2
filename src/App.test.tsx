import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { TElement } from './interfaces/TElement';
import ElementItem from './components/Elements/ElementItem';
import { useElementStore } from './components/Elements/ElementStore';
import ElementCreator from './components/Elements/ElementCreator';
import { ElementController } from './controllers/elementController';

// Мокаем функции из контроллера
jest.mock('../../controllers/elementController', () => ({
  ElementController: {
    createElement: jest.fn(),
    updateElement: jest.fn(),
    deleteElement: jest.fn(),
    getElements: jest.fn(),
  },
}));

//Модульные тест
test('module 1 - Загрузка Element', async () => {
  const element: TElement = {
    id: '1',
    name: 'Договор 1',
    description: 'Описание договора',
    permissions: { read_ids: ['1'], write_ids: ['2'], delete_ids: ['3'] }
  };

  render(<ElementItem element={element} />);

  // Ожидаем, что элемент с текстом "Договор 1" появится на экране
  const linkElement = await screen.findByText('Договор 1');
  const btnHide = await screen.findByText('Развернуть');

  // Проверяем, что элемент найден
  expect(linkElement).toBeInTheDocument();
  expect(btnHide).toBeInTheDocument();
});

test('module 2 - Форма создания элемента', async () => {
  render(<ElementCreator />);

  const name = await screen.findByLabelText('Название элемента');
  const desc = await screen.findByLabelText('Описание');
  const read = await screen.findByLabelText('Чтение');

  expect(name).toBeInTheDocument();
  expect(desc).toBeInTheDocument();
  expect(read).toBeInTheDocument();
});