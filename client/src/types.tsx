import { AxiosRequestConfig } from 'axios';
import { RouteComponentProps } from 'react-router-dom';

export interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  isRetried?: boolean
}

export interface AuthorizedUser {
  user: OwnUser | null,
  accessToken: string,
  refreshToken: string
}

export interface PageTitle {
  title: string,
  documentTitle?: string
}

export interface PublicUser {
  id: string,
  nickname: string,
  email: string,
  role: Role,
  avatarColor: string
}

export interface OwnUser extends PublicUser {
  favorites: string[],
  searches: UserSearch[],
  settings: UserSettings
}

export interface UserSettings {
  useEmails: boolean,
  useNotifications: boolean
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

export enum SortBy {
  Newest = 'Uusin ensin',
  Oldest = 'Vanhin ensin',
  Cheapest = 'Halvin ensin',
  MostExpensive = 'Kallein ensin'
}

export enum Gender {
  Male = 'Uros',
  Female = 'Naaras',
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
  Unknown = 'Ei tiedossa'
}

export enum ListingType {
  Animal = 'Eläin',
  Product = 'Tarvike'
}

export enum Specie {
  Cats = 'Kissat',
  Dogs = 'Koirat',
  Grawers = 'Jyrsijät',
  Reptiles = 'Matelijat',
  Birds = 'Linnut',
  Fishes = 'Kalat',
  Others = 'Muut'
}

export interface ListingEntry {
  id?: string;
  title: string,
  category: Category | string,
  date: Date,
  specie: Specie | string,
  gender: Gender | string,
  age: Age | string,
  race: string,
  registrationNumber: string,
  province: string,
  city: string,
  shortDescription: string,
  fullDescription: string,
  type: ListingType,
  price: number | string,
  images: Image[],
  user: PublicUser | null
}

export enum LoginModalStage {
  Login = 'Kirjaudu sisään',
  Register = 'Rekisteröidy',
  ResetPassword = 'Palauta salasana'
}

export interface LoginData {
  nickname: string,
  password: string
}

export interface RegisterData {
  nickname: string,
  email: string,
  password: string
}

export interface IUseField {
  type: string,
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clear: () => void;
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export enum Mode {
  Dark = 'dark',
  Light = 'light'
}

export interface SearchProps {
  offset: number,
  limit: number,
  page: number,
  filters: FilterOption[],
}

export interface FilterOption {
  filterValue: string,
  filterType: FilterType
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
  registrationNumber: string,
  city: string,
  shortDescription: string,
  fullDescription: string,
  type: ListingType,
  images: Image[],
  date: Date,
  price: number
}

export interface OwnListing extends PublicListing {
  activated: number,
  rejected: number
}

export interface Image {
  id: string,
  name: string,
  url: string,
  deleted?: boolean
}

export interface PaginatedPublicListings {
  total: number,
  data: PublicListing[],
}

export enum Severity {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info'
}

export interface ProfileHistory {
  tab: number;
}

export interface UserSearch {
  id: string | null,
  date: Date | null,
  filters: FilterOption[] | null,
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
  ListingType = 'type'
}

export interface UserSaveableSettings {
  settings: UserSettings,
  nickname: string,
  avatarColor: string
}

export interface AxiosErrorMessage {
  error: string
}

export interface Route {
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>,
  requireLogin?: boolean
}

export interface LoggedUserView {
  title: string,
  icon: JSX.Element
}

export interface Email {
  subject: string,
  message: string
}

export interface EmailVerifyRequest {
  id: string,
  guid: string,
  email: string,
  status: EmailVerifyRequestStatus,
  validTo: Date,
  user: OwnUser
}

export enum EmailVerifyRequestStatus {
  ACTIVATE_USER = 'ACTIVATE_USER',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  DONE = 'DONE'
}

export interface EmailChangeRequest {
  email: string
}


export interface PasswordRequest {
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
  ip: string,
}

export enum PasswordRequestStatus {
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  DONE = 'DONE'
}

export interface PasswordChangeRequest {
  email: string
}

export interface MessageEntry {
  to: string,
  message: string,
  image?: Image,
  conversationId?: string
}

export interface EncryptedMessage {
  iv: string,
  content: string
}

export interface DecryptedMessage {
  message: string
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

export interface PublicMessage {
  id: string,
  from: PublicUser,
  to: PublicUser,
  message: string,
  deletedBy: string[],
  date: Date,
  image: Image
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
  ADD_CONVERSATION_MESSAGE = 'ADD_CONVERSATION_MESSAGE'
}

export interface UserStatus {
  userId: string,
  online: boolean
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

export interface Notification {
  id: string,
  type: NotificationType,
  resource: PublicMessage | PublicConversation | PublicListing,
  user: PublicUser,
  date: Date,
  checked: boolean
}

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