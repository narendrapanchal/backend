const jwt = require('jsonwebtoken');
const secret="secret_key"
const authenticateRole = (requiredRole) => {
return (req, res, next)=> {
    const token = req.header('Authorization');
   
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(token.split(" ")[1], secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        console.log(user);
        
        if (user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden - Insufficient privileges' });
        }
        req.user = user;
        next();
    });
}
}
module.exports=authenticateRole;