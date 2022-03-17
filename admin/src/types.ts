import { AxiosRequestConfig } from 'axios';

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

export interface OwnUser {
  id: string,
  nickname: string,
  email: string,
  role: Role,
  avatarColor: string
}

export interface Route {
  path: string,
  component: unknown,
}

export interface PublicUser {
  id: string,
  nickname: string,
  email: string,
  role: Role,
  avatarColor: string,
}

export interface AdminViewUser extends PublicUser {
  id: string,
  nickname: string,
  email: string,
  role: Role,
  avatarColor: string,
  createdAt: Date,
  activated: number,
  lastLoggedIn: Date
}

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export enum Category {
  Give = 'annetaan',
  Sell = 'myydään',
  Buy = 'ostetaan'
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
  Animal = 'animal',
  Product = 'product'
}

export enum Specie {
  Cats = 'kissat',
  Dogs = 'koirat',
  Grawers = 'jyrsijät',
  Reptiles = 'matelijat',
  Birs = 'linnut',
  Fished = 'kalat',
  Others = 'muut'
}

export interface ListingEntry {
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
  type: ListingType
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

export interface Image {
  id: string,
  name: string,
  url: string
}

export interface AdminViewListing extends PublicListing {
  createdAt: Date,
  activated: number,
  rejected: number,
  deleted: number,
  user: AdminViewUser
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

export interface Message {
  id: string,
  from: PublicUser,
  to: PublicUser,
  conversationId: string,
  image?: Image,
  createdAt: Date
}

export enum Mode {
  Dark = 'dark',
  Light = 'light'
}

export type AdminViewResource = AdminViewUser | AdminViewListing;

export interface IUseField {
  type: string,
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface GridColumn {
  field: string,
  headerName: string,
  width?: number | undefined,
  valueGetter?: unknown,
  flex?: number | undefined,
  minWidth?: number | undefined,
  align?: unknown,
  type?: unknown,
  renderCell?: unknown,
}

export enum SocketAction {
  LISTING_WAITING_ACTIVATION = 'LISTING_WAITING_ACTIVATION',
  ONLINE_USERS = 'ONLINE_USERS',
  LOG_OUT = 'LOG_OUT'
}

export interface UserStatus {
  userId: string,
  online: boolean
}

