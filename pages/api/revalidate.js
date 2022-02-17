// pages/api/revalidate.js

export default async function handler(req, res) {
  try {
    // Rebuild the homepage to update the recent posts
    await res.unstable_revalidate('/')
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
