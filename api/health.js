export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ is_success: false });
  }

  return res.status(200).json({
    is_success: true,
    official_email: "anushka1784.be23@chitkara.edu.in"
  });
}
