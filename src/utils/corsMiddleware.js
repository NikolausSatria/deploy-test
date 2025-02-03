export function corsMiddleware(req, res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_URL || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  }