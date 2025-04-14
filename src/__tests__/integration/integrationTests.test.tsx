import React from 'react';
import { render, renderHook, screen, waitFor, act } from '@testing-library/react';
import { ElementController } from '../../controllers/elementController';
import { TElement } from '../../interfaces/TElement';
import ElementItem from '../../components/Elements/ElementItem';
import ElementCreator from '../../components/Elements/ElementCreator';
import { useElementStore } from '../../components/Elements/ElementStore';
import { GroupController } from '../../controllers/GroupController';
import { TGroup } from '../../interfaces/TGroup';

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

    async function createTestElement(testElement: TElement) {
        const createResponse = await ElementController.createElement(testElement);
        const new_element_id = createResponse[0].id;
        testElementIds.push(new_element_id);
        return createResponse[0];
    }

    async function createTestGroup(testGroup: TGroup) {
        const createResponse = await GroupController.createGroup(testGroup);
        const new_group_id = createResponse[0].id;
        testGroupIds.push(new_group_id);
        return createResponse[0];
    }

    test('Создание элемента в бд', async () => {
        const testElement: TElement = {
            id: "",
            name: 'TEST_ELEMENT_' + Date.now(), // Уникальное имя для теста
            description: 'Test description'
        };
        
        const new_element = await createTestElement(testElement);

        // 2. Проверяем создание
        expect(new_element).toMatchObject({
            name: testElement.name,
            description: testElement.description
        });

        // 3. Ищем элемент в БД
        const { elements } = await ElementController.getElements(true);
        const foundElement = elements.find(el => el.id === new_element.id);

        expect(foundElement).toBeDefined();
        expect(foundElement).toMatchObject({
            id: new_element.id,
            name: testElement.name,
            description: testElement.description
        });
    });

    test('Создание группы в бд', async () => {
        const testGroup: TGroup = {
            id: "",
            name: 'TEST_ELEMENT_' + Date.now(), // Уникальное имя для теста            
        };

        const new_group = await createTestGroup(testGroup);

        // 2. Проверяем создание
        expect(new_group).toMatchObject({
            name: testGroup.name
        });

        // 3. Ищем элемент в БД
        const groups = await GroupController.getGroups();
        const foundGroup = groups.find(el => el.id === new_group.id);

        expect(foundGroup).toBeDefined();
        expect(foundGroup).toMatchObject({
            id: new_group.id,
            name: testGroup.name,
        });
    });

    test('Создание родительской и дочерней группы в бд', async () => {
        const testGroup_parent: TGroup = {
            id: "",
            name: 'TEST_ELEMENT_Parent_' + Date.now(),
        };

        const new_parent_group = await createTestGroup(testGroup_parent);

        // 2. Проверяем создание
        expect(new_parent_group).toMatchObject({
            name: testGroup_parent.name
        });

        const testGroup_child: TGroup = {
            id: "",
            name: 'TEST_ELEMENT_Child_' + Date.now(),
            parent_group_id: new_parent_group.id
        };

        const new_child_group = await createTestGroup(testGroup_child);

        // 2. Проверяем создание
        expect(new_child_group).toMatchObject({
            name: testGroup_child.name
        });

        // 3. Ищем элемент в БД
        const groups = await GroupController.getGroups();
        const foundGroup = groups.find(el => el.id === new_child_group.id);

        expect(foundGroup).toBeDefined();
        expect(foundGroup).toMatchObject({
            id: new_child_group.id,
            name: testGroup_child.name,
            parent_group_id: new_parent_group.id
        });
    })
})
