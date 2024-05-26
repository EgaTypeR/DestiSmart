const data = require('../lib/data.json')



function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180

  const R = 6371 // Radius bumi dalam kilometer
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

exports.distanceData = async (req, res) => {
  try {
    const { lat, lng, display } = req.query;

    if (!lat || !lng || !display) {
      return res.status(400).json({ error: 'Missing required query parameters: lat, lng, display' });
    }

    const updatedLocate = data
      .map((e) => {
        const [lat2, lng2] = e.location;
        return {
          ...e,
          distance: calculateDistance(parseFloat(lat), parseFloat(lng), lat2, lng2),
        };
      })
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(updatedLocate);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error!' + error });
  }
};