import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, readToken } from '../env'

// Public / shared Sanity client (without secret token)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set false for instant consistency, or toggle based on caching
  stega: {
    studioUrl: '/studio',
  },
})

// Server-only client with read token for private datasets
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
  stega: {
    studioUrl: '/studio',
  },
})
