const jwt = require('jsonwebtoken');
jwt.verify(token, process.env.JWT_SECRET);

module.exports = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header("Authorization");

    // Check if token is not provided
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Split the token into the word 'Bearer' and the token itself
    const bearerToken = token.split(" ")[1]; // Token is usually passed as "Bearer <token>"

    // If the token doesn't exist after splitting, return unauthorized
    if (!bearerToken) {
        return res.status(401).json({ msg: "Token format is incorrect" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        // Handle any errors with the token verification
        res.status(400).json({ msg: "Invalid token" });
    }
};
