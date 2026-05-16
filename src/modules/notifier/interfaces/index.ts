export type INotification = {
    id: number;
    body: string;
    model: { id: number; name: string };
    objectId: number;
    params: object | null;
    isActive: boolean;
    templateId: number | null;
    isBulk: boolean;
    sent: boolean;
    retriedAt: string;
    sentAt: string;
    createdAt: string;
};

export type INotificationPersistence = {
    id: number;
    active: number;
    body: string;
    bulk: number;
    model_id: number;
    model_name: string;
    object_id: number;
    template_id: number | null;
    params: string | null;
    retry_at: string;
    sended_at: string;
    created_at: string;
    sent: number;
};

export type ISmsNotification = INotification & {
    phoneNumber: string;
    userId: number;
};

export type ISmsNotificationPersistence = INotificationPersistence & {
    number: string;
    user_id: number;
};

export type IEmailNotification = INotification & {
    email: string;
    userId: number;
};

export type IEmailNotificationPersistence = INotificationPersistence & {
    email: string;
    user_id: number;
};

export type INotificationTemplate = {
    id: number;
    name: string;
    title: string;
    body: string;
    htmlTemplateId?: string;
    model: { id: number; name: string };
    status: { id: number; name: string } | null;
    planCategory: { id: number; name: string } | null;
    type: { id: number; name: string };
    isActive: boolean;
    delay: number;
    createdAt: string;
};

export type INotificationTemplatePersistence = {
    id: number;
    active: number;
    body: string;
    created_at: string;
    delay: number;
    model_id: number;
    model_name: string;
    name: string;
    state_id: number | null;
    state_name: string | null;
    tariff_category_id: number | null;
    tariff_category_name: string | null;
    template_type_id: number;
    template_type_name: string;
    title: string;
    html_template_id: string;
};

export type SendBulkNotificationDtoType =
    | 'allUsers'
    | 'userIds'
    | 'userBirthday'
    | 'userMonthlyLimit'
    | 'orderStatus'
    | 'courierStatus'
    | 'customsStatus'
    | 'declarationStatus'
    | 'flightId';

export type ISendBulkMobileNotificationDto = {
    type: SendBulkNotificationDtoType;
    templateId: string;
    flightId: string;
    user: { ids: string[]; monthlyLimit: string };
    declarationStatusIds: string[];
    branchIds: string[];
    countryIds: string[];
    orderStatusIds: string[];
    courierStatusIds: string[];
    customsStatusId: string;
    customsDeclarationStatusId: string;
    plannedAt: any;
};

export type ISendBulkSmsNotificationDto = {
    type: SendBulkNotificationDtoType | 'userPhoneNumbers';
    body: string;
    flightId: string;
    user: { ids: string[]; monthlyLimit: string; phoneNumbers: string[] };
    declarationStatusIds: string[];
    branchIds: string[];
    countryIds: string[];
    orderStatusIds: string[];
    courierStatusIds: string[];
    customsStatusId: string;
    customsDeclarationStatusId: string;
    plannedAt: any;
};

export type ISendBulkEmailNotificationDto = {
    type: SendBulkNotificationDtoType | 'userEmails';
    templateId: string;
    flightId: string;
    user: { ids: string[]; monthlyLimit: string; emails: string[] };
    declarationStatusIds: string[];
    branchIds: string[];
    countryIds: string[];
    orderStatusIds: string[];
    courierStatusIds: string[];
    customsStatusId: string;
    customsDeclarationStatusId: string;
    plannedAt: any;
};

export type ISendBulkWhatsappNotificationDto = {
    type: SendBulkNotificationDtoType | 'userPhoneNumbers';
    templateId: string;
    body: string;
    flightId: string;
    user: { ids: string[]; monthlyLimit: string; phoneNumbers: string[] };
    declarationStatusIds: string[];
    branchIds: string[];
    countryIds: string[];
    orderStatusIds: string[];
    courierStatusIds: string[];
    customsStatusId: string;
    customsDeclarationStatusId: string;
    plannedAt: any;
};

export type ICreateNotificationTemplateDto = {
    id?: number | string;
    name: string;
    title: string;
    body: string;
    typeId: string;
    modelId: string;
    statusId: string;
    isActive: boolean;
    delay: string;
    htmlTemplateId: string;
};
