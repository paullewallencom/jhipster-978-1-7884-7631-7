import { expect } from 'chai';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import userManagement, { ACTION_TYPES } from 'app/modules/administration/user-management/user-management.reducer';

describe('User managment reducer tests', () => {
  function isEmpty(element): boolean {
    if (element instanceof Array) {
      return element.length === 0;
    } else {
      return Object.keys(element).length === 0;
    }
  }

  function testInitialState(state) {
    expect(state).to.contain({
      loading: false,
      errorMessage: null,
      updating: false,
      updateSuccess: false,
      totalItems: 0
    });
    expect(isEmpty(state.users));
    expect(isEmpty(state.authorities));
    expect(isEmpty(state.user));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(userManagement(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(userManagement(undefined, {}));
    });
  });

  describe('Requests', () => {
    it('should not modify the current state', () => {
      testInitialState(userManagement(undefined, { type: REQUEST(ACTION_TYPES.FETCH_ROLES) }));
    });

    it('should set state to loading', () => {
      testMultipleTypes([REQUEST(ACTION_TYPES.FETCH_USERS), REQUEST(ACTION_TYPES.FETCH_USER)], {}, state => {
        expect(state).to.contain({
          errorMessage: null,
          updateSuccess: false,
          loading: true
        });
      });
    });

    it('should set state to updating', () => {
      testMultipleTypes(
        [REQUEST(ACTION_TYPES.CREATE_USER), REQUEST(ACTION_TYPES.UPDATE_USER), REQUEST(ACTION_TYPES.DELETE_USER)],
        {},
        state => {
          expect(state).to.contain({
            errorMessage: null,
            updateSuccess: false,
            updating: true
          });
        }
      );
    });
  });

  describe('Failures', () => {
    it('should set state to failed and put an error message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_USERS),
          FAILURE(ACTION_TYPES.FETCH_USER),
          FAILURE(ACTION_TYPES.FETCH_ROLES),
          FAILURE(ACTION_TYPES.CREATE_USER),
          FAILURE(ACTION_TYPES.UPDATE_USER),
          FAILURE(ACTION_TYPES.DELETE_USER)
        ],
        'something happened',
        state => {
          expect(state).to.contain({
            loading: false,
            updating: false,
            updateSuccess: false,
            errorMessage: 'something happened'
          });
        }
      );
    });
  });

  describe('Success', () => {
    it('should update state according to a successful fetch users request', () => {
      const headers = { ['x-total-count']: 42 };
      const payload = { data: 'some handsome users', headers };
      const toTest = userManagement(undefined, { type: SUCCESS(ACTION_TYPES.FETCH_USERS), payload });

      expect(toTest).to.contain({
        loading: false,
        users: payload.data,
        totalItems: headers['x-total-count']
      });
    });

    it('should update state according to a successful fetch user request', () => {
      const payload = { data: 'some handsome user' };
      const toTest = userManagement(undefined, { type: SUCCESS(ACTION_TYPES.FETCH_USER), payload });

      expect(toTest).to.contain({
        loading: false,
        user: payload.data
      });
    });

    it('should set state to successful update', () => {
      testMultipleTypes([SUCCESS(ACTION_TYPES.CREATE_USER), SUCCESS(ACTION_TYPES.UPDATE_USER)], { data: 'some handsome user' }, types => {
        expect(types).to.contain({
          updating: false,
          updateSuccess: true,
          user: 'some handsome user'
        });
      });
    });

    it('should set state to successful update with an empty user', () => {
      const toTest = userManagement(undefined, { type: SUCCESS(ACTION_TYPES.DELETE_USER) });

      expect(toTest).to.contain({
        updating: false,
        updateSuccess: true
      });
      expect(isEmpty(toTest.user));
    });
  });
});
