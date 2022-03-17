import { Request } from 'express';

export interface AuthorizedRequest extends Request {
    userId: string;
    userRole: Role;
}

export interface ErrorDefinition {
    name: ErrorName,
    statusCode: number,
    stackTrace: boolean,
    json?: any
}

export interface CustomError {
    name: string
}

export enum ErrorName {
    ValidationError = 'ValidatonError',
    JsonWebTokenError = 'JsonWebTokenError',
    SyntaxError = 'SyntaxError',
    ReferenceError = 'ReferenceError',
    CastError = 'CastError',
    UnknownEndpointError = 'UnknownEndpointError',
    PermissionDeniedError = 'PermissionDeniedError',
    MongoError = 'MongoError',
    AccessControlError = 'AccessControlError',
    UnauthorizedError = 'UnauthorizedError',
    InvalidAccessTokenError = 'InvalidAccessTokenError',
    TokenExpiredError = 'TokenExpiredError',
    WrongCredentialsError = 'WrongCredentialsError',
    TypeError = 'TypeError',
    SessionExpiredError = 'SessionExpiredError',
    UserNotActivatedError = 'UserNotActivatedError',
    NicknameInUseError = 'NicknameInUseError',
    AvatarColorError = 'AvatarColorError',
    EmailInUseError = 'EmailInUseError',
    EmailVerifyRequestNotFoundError = 'EmailVerifyRequestNotFoundError',
    EmailVerifyRequestStatusError = 'EmailVerifyRequestStatusError',
    EmailVerifyRequestNotValidError = 'EmailVerifyRequestNotValidError',
    PasswordRequestNotFoundError = 'PasswordRequestNotFoundError',
    PasswordRequestStatusError = 'PasswordRequestStatusError',
    PasswordRequestNotValidError = 'PasswordRequestNotValidError',
    UsetNotFoundError = 'UsetNotFoundError',
    ListingTooNewError = 'ListingTooNewError',
}

export interface FilterOption {
    filterValue: string,
    filterType: FilterType
}

export enum FilterType {
    City = 'city',
    Province = 'province',
    Category = 'category',
    Race = 'race',
    Specie = 'specie',
    Registered = 'registered',
    Age = 'age',
    Gender = 'gender',
    Text = 'text',
    SortBy = 'sortBy',
    ListingType = 'listingType'
}

export interface UserEntry {
    nickname: string,
    email: string,
    role: Role,
    password: string,
    avatarColor: string,
    activated?: number
}

export interface AdminViewUser extends PublicUser {
    createdAt: Date,
    activated: number,
    lastLoggedIn: Date,
    role: Role
}

export interface LoginData {
    nickname: string,
    password: string,
}

export interface RegisterData {
    nickname: string,
    email: string,
    password: string,
}

export interface AuthorizedUser {
    user: OwnUser,
    accessToken: string,
    refreshToken: string,
}

export interface OwnUser extends PublicUser {
    favorites?: PublicListing[],
    searches?: UserSearch[],
    settings: UserSettings,
    role: Role
}

export interface UserSettings {
    useEmails: boolean,
    useNotifications: boolean
}

export interface PublicUser {
    id: string,
    nickname: string,
    email: string,
    avatarColor: string
}

export enum Role {
    Admin = 'admin',
    User = 'user'
}

export enum Category {
    All = 'Kaikki',
    Give = 'Annetaan',
    Sell = 'Myydään',
    Buy = 'Ostetaan'
}

export enum Gender {
    Female = 'Naaras',
    Male = 'Uros',
    MaleAndFemale = 'Uros ja naaras',
    Unknown = 'Ei tiedossa'
}

export enum Age {
    ZeroToThreeMonths = '0 - 3 kuukautta',
    ThreeToSixMonths = '3 - 6 kuukautta',
    SixToTwelveMonths = '6 - 12 kuukautta',
    OneToThreeYears = '1 - 3 vuotta',
    ThreeToSixYears = '3 - 6 vuotta',
    SixToNineYears = '6 - 9 vuotta',
    OverNineYears = 'Yli 9 vuotta',
}

export enum ListingType {
    Pet = 'Eläin',
    Product = 'Tarvike'
}

export enum Specie {
    Cats = 'Kissat',
    Dogs = 'Koirat',
    Grawers = 'Jyrsijät',
    Reptiles = 'Matelijat',
    Birs = 'Linnut',
    Fished = 'Kalat',
    Others = 'Muut'
}

export interface PublicListing {
    id: string,
    user: PublicUser,
    title: string,
    category: Category,
    specie: Specie,
    gender: Gender,
    age: Age,
    race: string,
    province: string,
    city: string,
    shortDescription: string,
    fullDescription: string,
    registrationNumber: string,
    type: ListingType,
    images?: Image[],
    date: Date,
    price: number
}

export interface OwnListing extends PublicListing {
    activated: number,
    rejected: number
}

export interface PaginatedPublicListings {
    total: number,
    data: PublicListing[],
}

export interface Image {
    id: string,
    name: string,
    url: string,
    deleted?: boolean
}

export interface AdminViewListing extends PublicListing {
    createdAt: Date,
    activated: number,
    rejected: number,
    deleted: number,
    user: AdminViewUser
}

export interface SearchProps {
    offset: number,
    limit: number,
    page: number,
    filters: FilterOption[],
}

export enum SortBy {
    Newest = 'Uusin ensin',
    Oldest = 'Vanhin ensin',
    Cheapest = 'Halvin ensin',
    MostExpensive = 'Kallein ensin'
}

export interface ListingEntry {
    title: string,
    category: Category,
    date: Date,
    specie: Specie,
    gender: Gender,
    age: Age,
    race: string,
    registrationNumber: string,
    province: string,
    city: string,
    shortDescription: string,
    fullDescription: string,
    type: ListingType,
    price: number,
    images: Image[],
    user: string,
    activated: number,
    rejected: 0
}

export interface UserSearch {
    id: string,
    date: Date,
    userId: string,
    filters: FilterOption[],
}

export interface UserSaveableSettings {
    settings: UserSettings,
    nickname: string,
    avatarColor: string
}

export interface Email {
    userId?: string,
    to: string,
    subject: string,
    message: string,
}

export interface IEmailVerifyRequest {
    id: string,
    guid: string,
    email: string,
    status: EmailVerifyRequestStatus,
    validTo: Date,
    user: OwnUser
}

export interface EmailVerifyRequestEntry {
    guid: string,
    email: string,
    user: string,
    validTo: Date,
    status: EmailVerifyRequestStatus,
}

export enum EmailVerifyRequestStatus {
    ACTIVATE_USER = 'ACTIVATE_USER',
    CHANGE_EMAIL = 'CHANGE_EMAIL',
    DONE = 'DONE'
}

export interface EmailChangeRequest {
    email: string
}

export interface IPasswordRequest {
    id: string,
    guid: string,
    user: OwnUser,
    email: string,
    status: PasswordRequestStatus,
    validTo: Date
}

export interface PasswordRequestEntry {
    guid: string,
    user: string,
    email: string,
    validTo: Date,
    status: PasswordRequestStatus,
}

export enum PasswordRequestStatus {
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    DONE = 'DONE'
}

export interface PasswordChangeRequest {
    email: string
}

export interface ConversationEntry {
    from: string,
    to: string,
    messages: MessageEntry[],
    image?: Image,
    conversationId?: string
}

export interface EncryptedMessage {
    iv: string,
    content: string
}

export interface PublicConversation {
    id: string,
    from: PublicUser,
    to: PublicUser,
    messages: PublicMessage[],
    deletedBy: string[],
    new?: boolean,
    wasDeleted?: boolean,
    date: Date
}

export interface MessageEntry {
    from: string,
    to: string,
    message: EncryptedMessage,
    date: Date,
    image?: Image
}

export interface PublicMessage {
    id: string,
    from: PublicUser,
    to: PublicUser,
    message: string,
    deletedBy: string[],
    date: Date,
    image: Image,
    conversationId: string
}

export enum SocketRoom {
    USERS = 'USERS',
    ADMINS = 'ADMINS'
}

export interface TypingUser {
    from: string,
    to: string,
    isTyping: boolean,
    date: number
}

export enum SocketAction {
    START_TYPING_MESSAGE = 'START_TYPING_MESSAGE',
    STOP_TYPING_MESSAGE = 'STOP_TYPING_MESSAGE',
    USER_STATUS = 'USER_STATUS',
    IS_USER_ONLINE = 'IS_USER_ONLINE',
    LOG_OUT = 'LOG_OUT',
    LOG_IN = 'LOG_IN',
    ONLINE_USERS = 'ONLINE_USERS',
    NEW_MESSAGE = 'NEW_MESSAGE',
    NEW_CONVERSATION = 'NEW_CONVERSATION',
    NOTIFICATION = 'NOTIFICATION',
    LISTING_ACTIVATED = 'LISTING_ACTIVATED',
    LISTING_REJECTED = 'LISTING_REJECTED',
    LISTING_RESTORED = 'LISTING_REJECTED',
    LISTING_RENEWED = 'LISTING_RENEWED',
    LISTING_DELETED = 'LISTING_DELETED',
    JOIN_ROOM = 'JOIN_ROOM',
    LEAVE_ROOM = 'LEAVE_ROOM',
    ADD_CONVERSATION_MESSAGE = 'ADD_CONVERSATION_MESSAGE',
    LISTING_WAITING_ACTIVATION = 'LISTING_WAITING_ACTIVATION'
}

export interface UserStatus {
    userId: string,
    online: boolean
}

export interface INotification {
    id: string,
    type: NotificationType,
    resource: NotificationResource,
    user: PublicUser,
    checked: boolean,
    date: Date,
}

export type NotificationResource = PublicMessage | PublicConversation | PublicListing

export interface NotificationEntry {
    type: NotificationType,
    resource: PublicMessage | PublicConversation | PublicListing,
    user: string
}

export enum NotificationType {
    NEW_MESSAGE = 'NEW_MESSAGE',
    LISTING_ACTIVATED = 'LISTING_ACTIVATED',
    LISTING_REJECTED = 'LISTING_REJECTED'
}
