export const errorMiddleware = {
  notFound: (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  },

  globalError: (error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  },

  bigIntHandler: (req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
      const sanitizedData = JSON.parse(JSON.stringify(data, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
      }));
      return originalJson.call(this, sanitizedData);
    };
    next();
  }
};
