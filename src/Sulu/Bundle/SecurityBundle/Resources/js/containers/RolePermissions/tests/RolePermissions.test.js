// @flow
import React from 'react';
import {mount, shallow} from 'enzyme';
import {ResourceRequester} from 'sulu-admin-bundle/services';
import securityContextStore from '../../../stores/SecurityContextStore';
import RolePermissions from '../RolePermissions';

jest.mock('sulu-admin-bundle/utils/Translator', () => ({
    translate: jest.fn((key) => key),
}));

jest.mock('sulu-admin-bundle/services/ResourceRequester', () => ({
    get: jest.fn(),
}));

jest.mock('../../../stores/SecurityContextStore', () => ({
    loadAvailableActions: jest.fn(),
}));

test('Render matrix with correct all values selected if not given', () => {
    const rolePromise = Promise.resolve(
        {
            _embedded: {
                roles: [
                    {id: 1, name: 'Administrator'},
                    {id: 2, name: 'Account Manager'},
                ],
            },
        }
    );
    ResourceRequester.get.mockReturnValue(rolePromise);

    const actionPromise = Promise.resolve(['view', 'add', 'edit', 'delete', 'live', 'security']);
    securityContextStore.loadAvailableActions.mockReturnValue(actionPromise);

    const value = {};
    const rolePermissions = mount(<RolePermissions onChange={jest.fn()} resourceKey="snippets" value={value} />);

    expect(rolePermissions.render()).toMatchSnapshot();

    return Promise.all([rolePromise, actionPromise]).then(() => {
        rolePermissions.update();
        expect(rolePermissions.render()).toMatchSnapshot();
    });
});

test('Render matrix with correct given values', () => {
    const rolePromise = Promise.resolve(
        {
            _embedded: {
                roles: [
                    {id: 1, name: 'Admin'},
                    {id: 2, name: 'Contact Manager'},
                ],
            },
        }
    );
    ResourceRequester.get.mockReturnValue(rolePromise);

    const actionPromise = Promise.resolve(['view', 'add', 'edit', 'delete', 'security']);
    securityContextStore.loadAvailableActions.mockReturnValue(actionPromise);

    const value = {
        '1': {
            view: true,
            add: false,
            edit: true,
            delete: true,
        },
        '2': {
            view: true,
            add: true,
            edit: true,
            delete: false,
        },
    };
    const rolePermissions = mount(<RolePermissions onChange={jest.fn()} resourceKey="snippets" value={value} />);

    expect(rolePermissions.render()).toMatchSnapshot();

    return Promise.all([rolePromise, actionPromise]).then(() => {
        rolePermissions.update();
        expect(rolePermissions.render()).toMatchSnapshot();
    });
});

test('Render matrix with correct all values selected if not given', () => {
    const changeSpy = jest.fn();

    const rolePromise = Promise.resolve(
        {
            _embedded: {
                roles: [
                    {id: 1, name: 'Administrator'},
                    {id: 2, name: 'Account Manager'},
                ],
            },
        }
    );
    ResourceRequester.get.mockReturnValue(rolePromise);

    const actionPromise = Promise.resolve(['view', 'add', 'edit', 'delete', 'live', 'security']);
    securityContextStore.loadAvailableActions.mockReturnValue(actionPromise);

    const value = {};
    const rolePermissions = shallow(<RolePermissions onChange={changeSpy} resourceKey="snippets" value={value} />);

    expect(securityContextStore.loadAvailableActions).toBeCalledWith('snippets');

    return Promise.all([rolePromise, actionPromise]).then(() => {
        const newValue = {
            '1': {
                view: true,
                add: false,
                edit: true,
                delete: true,
            },
            '2': {
                view: true,
                add: true,
                edit: true,
                delete: false,
            },
        };
        rolePermissions.update();

        rolePermissions.find('Matrix').prop('onChange')(newValue);
        expect(changeSpy).toBeCalledWith(newValue);
    });
});
