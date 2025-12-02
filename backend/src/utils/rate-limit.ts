import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	ipv6Subnet: 56, // How many bits of IPv6 addresses to use in default keyGenerator
	legacyHeaders: false, // Enable the X-Rate-Limit header.
	limit: 100, // How many requests to allow.
	standardHeaders: 'draft-8', // Enable the Ratelimit header.
	windowMs: 15 * 60 * 1000, // How long to remember requests for, in milliseconds.
})

export default limiter;