import moment from 'moment';
import { LISTING_LIFETIME } from './config';
import listingService from './services/listingService';

// Loop for listings and delete if older than LISTING_LIFETIME,
// currently check every 12 hours
export async function ttl_listings() {
  setInterval(async () => {
    const listings = await listingService.getActivatedListings();
    listings.forEach(async (listing) => {
      const difference = moment().diff(listing.date, 'days');
      if (difference >= LISTING_LIFETIME) {
        await listingService.hardDeleteListing(listing.id);
      }
    });
  }, 43200000); // 12 hours
}