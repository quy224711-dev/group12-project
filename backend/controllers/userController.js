let users = [];

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
