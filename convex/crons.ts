import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

// Schedule file cleanup to run every 6 hours
const crons = cronJobs();

crons.interval(
  'cleanup expired files',
  { hours: 6 }, // Run every 6 hours
  internal.actions.cleanupExpiredFiles,
);

export default crons;
