import React, { createContext, FC, PropsWithChildren, useCallback, useMemo, useReducer } from 'react';
import { useBootstrapMeContext } from './hooks';
import { meContextReducer } from './reducer';
import { initialMeContextState } from './state';
import { IMeContext } from './types';

export const MeContext = createContext<IMeContext>({
  state: initialMeContextState,
  dispatch: () => null,
  can: () => false,
  canDisplay: () => false,
  hasAnyPermission: () => false,
});

export const MeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(meContextReducer, initialMeContextState);

  useBootstrapMeContext(state, dispatch);

  const can = useCallback((permission: string) => !!state.user.data?.permissions.includes(permission), [state.user.data?.permissions]);

  const permissions = useMemo(
    () => ({
      settings: {
        systemSettings: can('system_settings'),
        coupons: can('coupons'),
        returns: can('returns'),
        cashback: can('cashback'),
        foreignCargoes: can('foreign_cargoes'),
        containers: can('containers'),
        shopNames: can('shop_names'),
        returnReasons: can('return_reasons'),
        countries: can('countries'),
        branches: can('branches'),
        companies: can('companies'),
        tarifs: can('tarifs'),
        productTypes: can('producttypes'),
        regions: can('regions'),
        models: can('models'),
        states: can('states'),
      },
      declarations: {
        dgkDeclarations: can('dgk_declarations'),
        deletedCustomsDeclarations: can('deleted_customs_declarations'),
        postDeclarations: can('post_declarations'),
      },
      queues: {
        bbsQueues: can('bbs_queues'),
        unitedQueues: can('united_queues'),
        azerpostQueues: can('azerpost_queues'),
      },
      notify: {
        smsArchive: can('sms_archive'),
        whatsappArchive: can('whatsapp_archive'),
        mailArchive: can('mail_archive'),
        bulkAppNotification: can('bulk_app_notification'),
        notificationTemplates: can('notification_templates'),
        ticketTemplates: can('ticket_templates'),
      },
      content: {
        stateChanges: can('state_changes'),
        myLogs: can('my_logs'),
        partnerDeclarations: can('partner_declarations'),
        news: can('news'),
        faq: can('faq'),
        shops: can('shops'),
        transportationConditions: can('transportation_conditions'),
        banners: can('banners'),
        popups: can('popups'),
      },
    }),
    [can],
  );

  const hasAnyPermission = useCallback((group: keyof typeof permissions) => Object.values(permissions[group]).some(Boolean), [permissions]);

  const canDisplay = useCallback(
    (route: '*' | 'partner') => {
      switch (route) {
        case '*':
          return state.user.data?.admin === 1;
        case 'partner':
          return state.user.data?.admin === 4;
        default:
          return false;
      }
    },
    [state.user.data],
  );

  return <MeContext.Provider value={{ state, dispatch, can, canDisplay, hasAnyPermission }}>{children}</MeContext.Provider>;
};
