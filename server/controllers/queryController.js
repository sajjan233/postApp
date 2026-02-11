const Query = require("../models/Query");

/* ===============================
   USER → CREATE QUERY (NO LOGIN)
================================ */
  exports.createQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Query message is required"
      });
    }

    const query = new Query({
      message: message.trim(),
      user: req.user ? req.user._id : null // ✅ login optional
    });

    await query.save();

    res.status(201).json({
      message: "Query submitted successfully",
      query
    });

  } catch (error) {
    console.error("Create Query Error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ===============================
   USER → MY QUERIES (NO LOGIN)
================================ */
exports.getMyQueries = async (req, res) => {
  try {



    const queries = await Query.find({user:req.user.id})
      .sort({ createdAt: -1 });

    res.json(queries);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN → ALL QUERIES
================================ */
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
     

    res.json(queries);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN → UPDATE QUERY
================================ */
exports.updateQueryByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    if (status) query.status = status;
    if (adminReply) query.adminReply = adminReply;

    if (status === "replied" || adminReply) {
      query.repliedBy = req.user._id;
    }

    await query.save();

    res.json({
      message: "Query updated",
      query
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
