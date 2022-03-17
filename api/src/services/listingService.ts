import { APP_URL, IMAGES_BUCKET, LISTING_LIFETIME, MAILER_ADDRESS } from '../config';
import Listing from '../models/listing';
import { AdminViewListing, Category, ErrorName, FilterType, Image, ListingEntry, NotificationType, OwnListing, PaginatedPublicListings, PublicListing, SearchProps, SocketAction, SortBy } from '../types';
import { deleteImages, throwError, toAdminViewListing, toListingEntry, toPublicListing, uploadImages } from '../utils';
import moment from 'moment';
import { sendPrivateMessage, sendPublicMessage, sendToAdmins } from '../socket';
import { sendNotification } from './notificationService';
import { sendEmail } from '../mailer';
import User from '../models/user';

const getListings = async (): Promise<AdminViewListing[]> => {
  const listings = await Listing.find({}).populate('user').sort({ createdAt: -1 });
  return listings.filter(listing => listing.user !== null).map((listing) => toAdminViewListing(listing));
};

const getListing = async (id: string): Promise<AdminViewListing> => {
  const listing = await Listing.findOne({ _id: id, deleted: 0 }).populate('user');
  return toAdminViewListing(listing);
};

const getActivatedListings = async (): Promise<PublicListing[]> => {
  const listings = await Listing.find({ activated: 1, deleted: 0 }).populate('user');
  return listings.map((listing) => toPublicListing(listing));
};

const getActivatedListing = async (id: string): Promise<PublicListing> => {
  const listing = await Listing.findOne({ _id: id, activated: 1, deleted: 0 }).populate('user');
  return toPublicListing(listing);
};

const searchListings = async (props: SearchProps): Promise<PaginatedPublicListings> => {

  const getSort = () => {
    const sort = props.filters.find(f => f.filterType === FilterType.SortBy)?.filterValue;
    switch (sort) {
    case SortBy.Newest:
      return { date: -1 };
    case SortBy.Oldest:
      return { date: 1 };
    case SortBy.Cheapest:
      return { price: 1 };
    case SortBy.MostExpensive:
      return { price: -1 };
    default:
      return { date: -1 };
    }
  };

  const generateQuery = (props: SearchProps) => {
    const generatedQuery: any = { '$and': [{ activated: 1, deleted: 0 }] };
    const stringQuery: any[] = [];

    for (const filter of props.filters) {
      const filterType: string = filter.filterType;
      const filterValue = filter.filterValue;

      if (filterValue !== Category.All && filterType !== FilterType.Text) {

        if (filterType === FilterType.Registered) {
          generatedQuery['$and'].push({ 'registrationNumber': { $exists: true, $ne: '' } });
        } else {
          generatedQuery['$and'].push({ [filterType]: filterValue });
        }

      }
    }

    const text = props.filters.find(f => f.filterType === FilterType.Text);

    if (text) {
      const fixedText = text.filterValue.replace(/\s+/g, '|');
      stringQuery.push({ title: { $regex: fixedText, $options: 'i' } });
      stringQuery.push({ shortDescription: { $regex: fixedText, $options: 'i' } });
      stringQuery.push({ fullDescription: { $regex: fixedText, $options: 'i' } });
      stringQuery.push({ city: { $regex: fixedText, $options: 'i' } });
      stringQuery.push({ province: { $regex: fixedText, $options: 'i' } });
      stringQuery.push({ race: { $regex: fixedText, $options: 'i' } });
      stringQuery.push({ specie: { $regex: fixedText, $options: 'i' } });
    }

    if (stringQuery.length > 0) {
      generatedQuery['$and'].push({ '$or': stringQuery });
    }

    return generatedQuery;
  };

  const query = generateQuery(props);
  const offset = props.offset;
  const limit = props.limit;
  const sort = getSort();

  const total = await Listing.countDocuments(query);
  const listings = await Listing
    .find(query)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .populate('user');

  const paginated: PaginatedPublicListings = {
    data: listings.map((listing) => toPublicListing(listing)),
    total: total
  };

  return paginated;
};

const createListing = async (data: any): Promise<PublicListing> => {
  const listingEntry: ListingEntry = toListingEntry(data);
  const newListing = new Listing(listingEntry);

  const uploadedImages: Image[] = await uploadImages(listingEntry.images, IMAGES_BUCKET);
  newListing.images = uploadedImages;

  const createdListing = await newListing.save();
  const populatedListing = await Listing.findById(createdListing._id).populate('user');

  const publicListing: PublicListing = toPublicListing(populatedListing);

  await sendEmail({
    to: MAILER_ADDRESS,
    subject: `Ilmoitus ${publicListing.title} odottaa tarkistusta`,
    message: `Uusi ilmoitus ${publicListing.title} odottaa tarkistusta.`
  });

  const adminViewListing = toAdminViewListing(populatedListing);
  sendToAdmins(SocketAction.LISTING_WAITING_ACTIVATION, adminViewListing);

  return publicListing;
};

const updateListing = async (id: string, data: ListingEntry): Promise<PublicListing> => {
  const listingEntry: ListingEntry = toListingEntry(data);

  await deleteImages(listingEntry.images.filter(img => img.deleted), IMAGES_BUCKET);
  const uploadedImages: Image[] = await uploadImages(listingEntry.images, IMAGES_BUCKET);
  listingEntry.images = uploadedImages.filter(image => !image.deleted);

  const updatedListing = await Listing.findByIdAndUpdate(id, listingEntry, { new: true }).populate('user');
  const publicListing: PublicListing = toPublicListing(updatedListing);

  await sendEmail({
    to: MAILER_ADDRESS,
    subject: `Ilmoitus ${publicListing.title} odottaa tarkistusta`,
    message: `Muokattu ilmoitus ${publicListing.title} odottaa tarkistusta.`
  });

  sendPublicMessage(SocketAction.LISTING_DELETED, publicListing);
  
  const adminViewListing = toAdminViewListing(updatedListing);
  sendToAdmins(SocketAction.LISTING_WAITING_ACTIVATION, adminViewListing);

  return toPublicListing(updatedListing);
};

const activateListing = async (id: string): Promise<AdminViewListing> => {
  const listing = await Listing.findByIdAndUpdate(id, { activated: 1 }, { new: true }).populate('user');
  const publicListing: PublicListing = toPublicListing(listing);

  await sendEmail({
    userId: publicListing.user.id,
    to: publicListing.user.email,
    subject: `Ilmoitus ${publicListing.title} julkaistiin`,
    message: `Ilmoituksesi ${publicListing.title} on nyt julkaistu Lemmikkihaussa.\n\nIlmoitus on voimassa ${LISTING_LIFETIME} päivää ja voit tarvittaessa uusia sen aikaisintaan ${Math.round(LISTING_LIFETIME / 2)} päivän päästä. Vanhentuneet ilmoitukset poistetaan automaattisesti.\n\nLinkki ilmoitukseen: ${APP_URL}/ilmoitus/${publicListing.id}`
  });

  await sendNotification(publicListing.user.id, NotificationType.LISTING_ACTIVATED, publicListing);

  sendPublicMessage(SocketAction.LISTING_ACTIVATED, publicListing);
  return toAdminViewListing(listing);
};

const rejectListing = async (id: string): Promise<AdminViewListing> => {
  const listing = await Listing.findByIdAndUpdate(id, { activated: 0, rejected: 1 }, { new: true }).populate('user');
  const publicListing: PublicListing = toPublicListing(listing);

  await sendEmail({
    userId: publicListing.user.id,
    to: publicListing.user.email,
    subject: `Ilmoitus ${publicListing.title} hylättiin`,
    message: `Ilmoituksesi ${publicListing.title} hylättiin. Olethan lukenut käyttöehdot? Voit lähettää ilmoituksen uudelleen tarkistettavaksi.`
  });

  await sendNotification(publicListing.user.id, NotificationType.LISTING_REJECTED, publicListing);

  sendPrivateMessage(publicListing.user.id, SocketAction.LISTING_REJECTED, publicListing);
  return toAdminViewListing(listing);
};

const restoreListing = async (id: string): Promise<AdminViewListing> => {
  const listing = await Listing.findByIdAndUpdate(id, { deleted: 0 }, { new: true }).populate('user');

  const publicListing: PublicListing = toPublicListing(listing);
  sendPublicMessage(SocketAction.LISTING_RESTORED, publicListing);

  return toAdminViewListing(listing);
};

const softDeleteListing = async (id: string): Promise<AdminViewListing> => {
  const listing = await Listing.findByIdAndUpdate(id, { deleted: 1 }, { new: true }).populate('user');

  //Remove listing from users favorites
  await User.updateMany({ $pull: { 'favorites': { $in: [id] } } });

  const publicListing: PublicListing = toPublicListing(listing);
  sendPublicMessage(SocketAction.LISTING_DELETED, publicListing);

  return toAdminViewListing(listing);
};

const hardDeleteListing = async (id: string): Promise<AdminViewListing> => {
  const listing = await Listing.findByIdAndDelete(id).populate('user');

  await deleteImages(listing.images, IMAGES_BUCKET);

  const publicListing: PublicListing = toPublicListing(listing);
  sendPublicMessage(SocketAction.LISTING_DELETED, publicListing);

  return toAdminViewListing(listing);
};

const renewListing = async (id: string): Promise<PublicListing> => {
  const listing: OwnListing = await Listing.findById(id);

  const now: moment.Moment = moment(new Date());
  const createdAt: moment.Moment = moment(listing.date);
  const daysRequired: number = LISTING_LIFETIME / 2;
  const daysBetween: number = now.diff(createdAt, 'days');

  if (daysBetween < daysRequired) {
    throwError(ErrorName.ListingTooNewError);
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, { date: new Date() }, { new: true }).populate('user');

  const publicListing: PublicListing = toPublicListing(listing);
  sendPublicMessage(SocketAction.LISTING_RENEWED, publicListing);

  return toPublicListing(updatedListing);
};

export default {
  getListings,
  getListing,
  searchListings,
  activateListing,
  rejectListing,
  getActivatedListings,
  getActivatedListing,
  restoreListing,
  softDeleteListing,
  hardDeleteListing,
  createListing,
  updateListing,
  renewListing
};