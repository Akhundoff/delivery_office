import { useState } from 'react';
import { useQuery } from 'react-query';
import { caller, urlMaker } from '@shared/utils';
import { UsersService } from '../../services';

export const useUserPermissions = (userId: string) => {
  const [operationIds, setOperationIds] = useState<number[]>([]);
  const [cashboxId, setCashboxId] = useState<number | undefined>(undefined);
  const [adminBranchId, setAdminBranchId] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const { data: operations, isLoading: operationsLoading } = useQuery(
    ['operations'],
    async () => {
      const result = await UsersService.getOperations();
      return result.status === 200 ? result.data : [];
    },
  );

  const { data: cashboxes } = useQuery('cashboxes-permissions', async () => {
    const response = await caller(urlMaker('/api/admin/cashboxes', { per_page: 1000 }));
    if (response.ok) {
      const result = await response.json();
      return (result.data || []).map((c: any) => ({ id: c.id, name: c.cashbox_name }));
    }
    return [];
  });

  const { data: branches } = useQuery('admin-branches-permissions', async () => {
    const response = await caller(urlMaker('/api/admin/admin_branches', { per_page: 1000 }));
    if (response.ok) {
      const result = await response.json();
      return (result.data || []).map((b: any) => ({ id: b.id, name: b.name }));
    }
    return [];
  });

  const { isLoading: permissionsLoading } = useQuery(
    ['user-permissions', userId],
    async () => {
      const result = await UsersService.getUserPermissions(userId);
      return result.status === 200 ? result.data : null;
    },
    {
      enabled: !!userId,
      onSuccess: (data) => {
        if (data) setOperationIds(data.permissionIds);
      },
    },
  );

  const toggleOperation = (id: number) => {
    setOperationIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const submit = async () => {
    setSubmitting(true);
    const result = await UsersService.updateUserPermissions(userId, operationIds, cashboxId, adminBranchId);
    setSubmitting(false);
    return result;
  };

  return {
    operations: operations ?? [],
    cashboxes: cashboxes ?? [],
    branches: branches ?? [],
    operationIds,
    cashboxId,
    adminBranchId,
    setCashboxId,
    setAdminBranchId,
    toggleOperation,
    submit,
    isLoading: operationsLoading || permissionsLoading,
    submitting,
  };
};
