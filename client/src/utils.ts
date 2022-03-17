import Resizer from 'react-image-file-resizer';
import { MessageEntry, OwnListing, Image, ListingEntry, PublicListing, ListingType } from './types';
import moment from 'moment';
import 'moment/locale/fi';

export const isEmptyString = (value: string | undefined): boolean => {
  if (!value) {
    return true;
  } else if (value.length === 0) {
    return true;
  }
  return false;
};

export const isDarkModeSelected = (): boolean | null => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode) {
    const darkMode = JSON.parse(savedMode) as boolean;
    if (darkMode) {
      return true;
    } else {
      return false;
    }
  }
  return null;
};

export const generateRandomId = (length: number): string => {
  let id = '';
  for (let i = 0; i <= length - 1; i++) {
    const random = Math.floor(Math.random() * 10);
    id += random;
  }
  return id.toString();
};

export const resizeFile = (file: Blob, outputType: string | undefined, width: number, height: number): Promise<string | Blob | File | ProgressEvent<FileReader>> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      'WEBP',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      outputType
    );
  });

export const isNotEmail = (email: string) => {
  if (email.includes('@')) {
    return true;
  }
  return false;
};

export const isValidNickname = (nickname: string) => {
  const regex = /[^a-zA-Zäö\d]/i; // Allow a-z äö, 0-9 only
  const isValid = !(regex.test(nickname));

  if (isValid) {
    const regexp = /^\S*$/; // No spaces
    const valid: boolean = (regexp.test(nickname));
    if (valid) {
      return true;
    }
  }

  return false;
};

export const setMetaColor = (darkMode: boolean) => {
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (metaColor) {
    metaColor.setAttribute('content', darkMode === true ? '#121212' : '#f1f1f1');
  }
};

export const isTypeOfOwnListing = (object: unknown): object is OwnListing => {
  return Object.prototype.hasOwnProperty.call(object, 'views') &&
    Object.prototype.hasOwnProperty.call(object, 'activated');
};

export const isString = (text: unknown): text is string => {
  return typeof text == 'string' || text instanceof String;
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value == 'boolean' || value instanceof Boolean;
};

export const isEmail = (email: string): boolean => {
  if (!isString(email)) {
    return false;
  } else if (email.length === 0) {
    return false;
  } else if (email.length > 0 && !email.includes('@')) {
    return false;
  } else {
    return true;
  }
};

export const isValidPassword = (password: string): boolean => {
  if (!isString(password)) {
    return false;
  } else if (password.length < 8) {
    return false;
  } else {
    return true;
  }
};

export const getPrettyDate = (date: Date): string => {
  const isSameDay: boolean = moment(date).isSame(new Date(), 'day');
  const yesterday: moment.Moment = moment().subtract(1, 'day');
  const isYesterday: boolean = moment(date).isSame(yesterday, 'day');

  if (isSameDay) {
    return moment(date).format('[klo] HH:mm');
  } else if (isYesterday) {
    return moment(date).format('[eilen klo] HH:mm');
  } else {
    const isSameYear = moment(date).isSame(new Date(), 'year');
    if (!isSameYear) {
      const year = moment().subtract(1, 'year').format('yyyy');
      return moment(date).format(`Do MMMM[ta] ${isSameYear ? '' : year}`);
    } else {
      return moment(date).format('Do MMMM[ta]');
    }
  }
};

export const toMessageEntry = (to: string, message: string): MessageEntry => {
  const messagEntry: MessageEntry = { to: to, message: message };
  return messagEntry;
};

export const fileToImage = async (file: File): Promise<Image> => {
  const resizedImage = await resizeFile(file, 'blob', 960, 720) as Blob;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const id: string = generateRandomId(5);
        const image: Image = {
          id: id,
          name: id,
          url: reader.result.toString()
        };
        resolve(image);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(resizedImage);
  });
};

export const scrollToBottomOfMessages = (behavior?: ScrollBehavior): void => {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.scrollTo({ top: messageContainer.scrollHeight, behavior: behavior ? behavior : 'auto' });
  }
};

export const scrollToMessage = (messageId: string, behavior: ScrollBehavior): void => {
  const message = document.getElementById(messageId);
  if (message) {
    message.scrollIntoView({ block: 'end', inline: 'nearest', behavior: behavior ? behavior : 'auto' });
  }
};

export const getStoredSelectedConversationId = (): string | null => {
  const stored = localStorage.getItem('selectedConversation');
  if (stored) {
    return stored;
  }
  return null;
};

export const toListingEntry = (object: PublicListing | OwnListing): ListingEntry => {
  const listingEntry: ListingEntry = {
    id: object.id,
    title: object.title,
    category: object.category,
    date: object.date,
    specie: object.specie,
    gender: object.gender,
    age: object.age,
    race: object.race,
    registrationNumber: object.registrationNumber,
    province: object.province,
    city: object.city,
    shortDescription: object.shortDescription,
    fullDescription: object.fullDescription,
    type: object.type || ListingType.Animal,
    price: object.price,
    images: object.images,
    user: object.user
  };
  return listingEntry;
};

export const isCrawler = (): boolean => {
  const userAgent: string = navigator.userAgent;
  const robots = new RegExp(([
    /bot/, /spider/, /crawl/,
    /APIs-Google/, /AdsBot/, /Googlebot/,
    /mediapartners/, /Google Favicon/,
    /FeedFetcher/, /Google-Read-Aloud/,
    /DuplexWeb-Google/, /googleweblight/,
    /bing/, /yandex/, /baidu/, /duckduck/, /yahoo/,
    /ecosia/, /ia_archiver/,
    /facebook/, /instagram/, /pinterest/, /reddit/,
    /slack/, /twitter/, /whatsapp/, /youtube/,
    /semrush/,
  ] as RegExp[]).map((r) => r.source).join('|'), 'i');

  return robots.test(userAgent);
};
