import React from 'react';
import { render, renderHook, screen, waitFor, act, within } from '@testing-library/react';
import { ElementController } from '../../controllers/elementController';
import { TElement } from '../../interfaces/TElement';
import ElementItem from '../../components/Elements/ElementItem';
import ElementCreator from '../../components/Elements/ElementCreator';
import { useElementStore } from '../../components/Elements/ElementStore';
import { GroupController } from '../../controllers/GroupController';
import { TGroup } from '../../interfaces/TGroup';
import App from '../../App';
import userEvent from '@testing-library/user-event';
import { useGroupStore } from '../../components/Groups/GroupStore';
import { useUserStore } from '../../components/Users/UserStore';

describe('Интеграционный тест', () => {
    let testElementIds: string[] = [];
    let testGroupIds: string[] = [];

    const cleanupTestElementData = async () => {
        if (testElementIds.length > 0) {
            try {
                for (const elementId of testElementIds) {
                    await ElementController.deleteElement({ id: elementId } as TElement);
                }
            } catch (e) {
                console.warn('Ошибка при очистке тестовых данных:', e);
            }
            testElementIds = [];
        }
    };

    const cleanupTestGroupData = async () => {
        if (testGroupIds.length > 0) {
            try {
                for (const groupId of testGroupIds) {
                    await GroupController.deleteGroup({ id: groupId } as TGroup);
                }
            } catch (e) {
                console.warn('Ошибка при очистке тестовых данных:', e);
            }
            testGroupIds = [];
        }
    };

    afterEach(async () => {
        await cleanupTestElementData();
        await cleanupTestGroupData();
    });

    test('Создание элемента, группы и прокидывание прав', async () => {
        render(<App is_admin={true} />);

        //Создание группы
        const testGroupName = 'TEST_Group_' + Date.now();
        const groupCreationForm = await screen.findByTestId('group-creator-form');
        const groupNameInput = within(groupCreationForm).getByLabelText('Название группы');
        await userEvent.type(groupNameInput, testGroupName);
        const createGroupButton = within(groupCreationForm).getByRole('button', { name: /Создать/i });
        await userEvent.click(createGroupButton);

        await waitFor(async () => {
            expect(await screen.findByText(testGroupName)).toBeInTheDocument();
        }, { timeout: 3000 });

        const groups = await GroupController.getGroups();
        const createdGroup = groups.find(g => g.name === testGroupName);
        expect(createdGroup).toBeDefined();
        if (createdGroup?.id) testGroupIds.push(createdGroup.id);

        const groupsInStore = useGroupStore.getState().groups;
        expect(groupsInStore.some(g => g.name === testGroupName)).toBeTruthy();

        //Создание элемента
        const testElementName = 'TEST_ELEMENT_' + Date.now();
        const testElementDescription = 'Test description';
        const elementCreationForm = await screen.findByTestId('element-creator-form');
        const elementNameInput = within(elementCreationForm).getByLabelText('Название элемента');
        const elementDescInput = within(elementCreationForm).getByLabelText('Описание');

        await userEvent.type(elementNameInput, testElementName);
        await userEvent.type(elementDescInput, testElementDescription);

        const readPermissionLabel = within(elementCreationForm).getByLabelText('Чтение');
        const readPermissionInput = readPermissionLabel
            .closest('.MuiFormControl-root')
            ?.querySelector('input');

        if (!readPermissionInput) {
            throw new Error('Не найдено поле ввода для прав чтения');
        }

        // Открываем dropdown
        await userEvent.click(readPermissionInput);

        // Ждем появления popup и ищем группу ТОЛЬКО внутри него
        const popup = await screen.findByRole('listbox');
        const groupOption = within(popup).getByText(testGroupName);
        await userEvent.click(groupOption);

        // Закрываем dropdown (если нужно)
        await userEvent.keyboard('{Escape}');

        const createElementButton = within(elementCreationForm).getByRole('button', { name: /Создать/i });
        await userEvent.click(createElementButton);

        await waitFor(async () => {
            expect(await screen.findByText(testElementName)).toBeInTheDocument();
        });

        const { elements } = await ElementController.getElements(true);
        const createdElement = elements.find(el => el.name === testElementName);
        expect(createdElement).toBeDefined();
        expect(createdElement).toStrictEqual(expect.objectContaining({
            name: testElementName,
            description: testElementDescription,
            permissions: expect.objectContaining({
                read_ids: [createdGroup?.id],
                write_ids: expect.any(Array),
                delete_ids: expect.any(Array)
            })
        }));
        if (createdElement?.id) testElementIds.push(createdElement.id);

        const elementsInStore = useElementStore.getState().elements;
        expect(elementsInStore.some(el => el.name === testElementName)).toBeTruthy();
    });
})
