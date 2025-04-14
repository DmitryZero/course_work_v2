import React from 'react';
import { render, renderHook, screen, waitFor, act } from '@testing-library/react';
import { ElementController } from '../../controllers/elementController';
import { TElement } from '../../interfaces/TElement';
import ElementItem from '../../components/Elements/ElementItem';
import ElementCreator from '../../components/Elements/ElementCreator';
import { useElementStore } from '../../components/Elements/ElementStore';

jest.mock('../../controllers/elementController.ts', () => ({
  ElementController: {
    createElement: jest.fn(),
    updateElement: jest.fn(),
    deleteElement: jest.fn(),
    getElements: jest.fn(),
  },
}));
const mockedElementController = ElementController as jest.Mocked<typeof ElementController>;

describe('Модульные тесты', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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

  test('module 3 - тестирование создания элемента на клиенте', async () => {
    const testElement: TElement = {
      id: '',
      name: 'Test',
      description: 'desc'
    };

    mockedElementController.createElement.mockResolvedValue([{
      id: '123',
      name: 'Test',
      description: 'desc'
    }]);

    const { result } = renderHook(() => useElementStore());

    await act(async () => {
      result.current.createElement(testElement);
    });

    // 5. Проверяем что элемент добавился в стор
    expect(result.current.elements).toEqual([{
      id: '123', // ID должен обновиться из мока
      name: 'Test',
      description: 'desc'
    }]);

    // 6. Проверяем вызов мока
    expect(mockedElementController.createElement).toHaveBeenCalledWith({
      id: '',
      name: 'Test',
      description: 'desc'
    });
  });
})
