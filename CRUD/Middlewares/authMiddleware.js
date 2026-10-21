const authMiddleware = async (req, res) => {
    const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    
    // Chỉ kiểm tra Authorization đối với các route ghi
    if (writeMethods.includes(req.method)) {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.setHeader('WWW-Authenticate', 'Bearer realm="Access to the write API"');
            throw { status: 401, message: 'Unauthorized: Missing or invalid Bearer token' };
        }
    }
};

module.exports = authMiddleware;